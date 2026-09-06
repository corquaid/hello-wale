"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requestWithSession } from "@/lib/api/client";
import { isApiError, type ApiError } from "@/lib/api/errors";
import { requireCompanyAdministrator } from "@/lib/auth";
import type { Employee, Envelope } from "@/lib/api/types";

export type ActionState = { error: string } | { ok: true } | undefined;

/**
 * Grant results carry the key the *next* submission should use.
 *
 * The API keys idempotency on the body as well as the header, so once a
 * request has been answered — accepted or rejected — reusing its key with
 * changed details is refused as a conflict. Minting the next key here means a
 * corrected resubmission always carries a fresh one, while a double-submit
 * that races the first response still reuses it and is collapsed into one
 * grant.
 */
export type GrantState =
	| { ok: true; nextKey: string }
	| { error: string; nextKey: string }
	| undefined;

/**
 * Turns an ApiError into something worth showing a person. Only the `code` is
 * matched on — the API documents its messages as free to change.
 */
function describe(error: unknown, fallback: string): string {
	if (!isApiError(error)) {
		console.error(fallback, error);
		return "Could not reach the API. Try again.";
	}

	const api = error as ApiError;

	switch (api.code) {
		case "INSUFFICIENT_POINTS":
			return "The company pool does not hold enough points for this.";
		case "COMPANY_NOT_ACTIVE":
			return "This company is not active, so its points cannot be moved.";
		case "EMPLOYEE_NOT_ACTIVE":
			return "This employee is not active, so their points cannot be moved.";
		case "IDEMPOTENCY_KEY_CONFLICT":
			return "This form was already submitted with different details. Reload and try again.";
		case "IDEMPOTENCY_REQUEST_IN_PROGRESS":
			return "That submission is still being processed. Give it a moment.";
		case "VALIDATION_FAILED":
			// Surface the first field message; it is the specific one.
			return Object.values(api.errors ?? {})[0]?.[0] ?? "Check the details and try again.";
		case "TOO_MANY_REQUESTS":
			return "Too many requests. Wait a moment and try again.";
		default:
			console.error(fallback, api);
			return api.message || fallback;
	}
}

function revalidateEmployee(employeeId?: number) {
	if (employeeId) revalidatePath(`/employees/${employeeId}`);
	revalidatePath("/employees");
	revalidatePath("/employees/activity");
	revalidatePath("/");
}

export async function createEmployee(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireCompanyAdministrator();

	const firstName = formData.get("first_name");
	const lastName = formData.get("last_name");
	const email = formData.get("email");

	if (typeof firstName !== "string" || !firstName.trim()) return { error: "A first name is required." };
	if (typeof lastName !== "string" || !lastName.trim()) return { error: "A last name is required." };
	if (typeof email !== "string" || !email.trim()) return { error: "An email address is required." };

	let employee: Employee;
	try {
		const { data } = await requestWithSession<Envelope<Employee>>("/company/employees", {
			method: "POST",
			body: {
				first_name: firstName.trim(),
				last_name: lastName.trim(),
				email: email.trim(),
			},
		});
		employee = data;
	} catch (error) {
		return { error: describe(error, "Could not add the employee.") };
	}

	revalidateEmployee(employee.id);
	redirect(`/employees/${employee.id}`);
}

/**
 * Grants points to one employee out of the company pool.
 *
 * The API requires an Idempotency-Key here and covers the body with it, so the
 * key has to come from the form rather than being minted per attempt: a
 * double-submit of the same form must reuse it (and be collapsed into one
 * grant), while a corrected resubmit needs a fresh one. See GrantPointsForm.
 */
export async function grantPoints(
	_prevState: GrantState,
	formData: FormData,
): Promise<GrantState> {
	await requireCompanyAdministrator();

	const nextKey = crypto.randomUUID();
	const employeeId = Number(formData.get("employee_id"));
	const points = Number(formData.get("points"));
	const reason = formData.get("reason_note");
	const idempotencyKey = formData.get("idempotency_key");

	if (!Number.isInteger(employeeId) || employeeId <= 0) {
		return { error: "Missing employee.", nextKey };
	}
	if (!Number.isInteger(points) || points <= 0) {
		// Unlike the old Supabase delta, a grant only moves points outward.
		// Taking them back is a correction against the original transfer.
		return { error: "Points must be a whole number above zero.", nextKey };
	}
	if (typeof idempotencyKey !== "string" || !idempotencyKey) {
		return { error: "This form is stale. Reload the page and try again.", nextKey };
	}

	try {
		await requestWithSession(`/company/employees/${employeeId}/points`, {
			method: "POST",
			idempotencyKey,
			body: {
				points,
				reason_note: typeof reason === "string" && reason.trim() ? reason.trim() : null,
			},
		});
	} catch (error) {
		return { error: describe(error, "Could not grant the points."), nextKey };
	}

	revalidateEmployee(employeeId);
	return { ok: true, nextKey };
}

/**
 * Closes an employee record. Their remaining balance returns to the company
 * pool — this is the API's equivalent of the old delete, and nothing is
 * destroyed: the record and its history stay readable.
 */
export async function deactivateEmployee(employeeId: number, formData: FormData) {
	await requireCompanyAdministrator();

	const idempotencyKey = formData.get("idempotency_key");
	if (typeof idempotencyKey !== "string" || !idempotencyKey) {
		throw new Error("Missing idempotency key for deactivation.");
	}

	await requestWithSession(`/company/employees/${employeeId}/deactivate`, {
		method: "POST",
		idempotencyKey,
	});

	revalidateEmployee(employeeId);
	redirect("/employees");
}
