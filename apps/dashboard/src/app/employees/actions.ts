"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requestWithSession } from "@/lib/api/client";
import { isApiError, type ApiError } from "@/lib/api/errors";
import { requireCompanyAdministrator } from "@/lib/auth";
import type { ConfirmState } from "@/components/ConfirmButton";
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
	{ ok: true; nextKey: string } | { error: string; nextKey: string } | undefined;

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
		case "INVALID_TRANSFER":
			return "The API refused that as an invalid transfer. Check the amounts and try again.";
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

	if (typeof firstName !== "string" || !firstName.trim())
		return { error: "A first name is required." };
	if (typeof lastName !== "string" || !lastName.trim())
		return { error: "A last name is required." };
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
 * Moves one employee's balance, in either direction.
 *
 * The API splits this across two endpoints, because a grant is one-way: its
 * `points` must be at least 1. Taking points back is a correction against the
 * transfer that handed them over, carrying a signed amount. So the route is
 * chosen by what the form says, not by a separate button:
 *
 *   - a transfer named  → a correction against it (signed, reason required)
 *   - nothing named     → a grant out of the pool (positive only)
 *
 * The API requires an Idempotency-Key on both and covers the body with it, so
 * the key has to come from the form rather than being minted per attempt: a
 * double-submit of the same form must reuse it and collapse into one movement,
 * while a corrected resubmit needs a fresh one. See AdjustPointsForm.
 */
export async function adjustPoints(
	_prevState: GrantState,
	formData: FormData,
): Promise<GrantState> {
	await requireCompanyAdministrator();

	const nextKey = crypto.randomUUID();
	const employeeId = Number(formData.get("employee_id"));
	const points = Number(formData.get("points"));
	const reason = formData.get("reason_note");
	const idempotencyKey = formData.get("idempotency_key");

	const rawTransfer = formData.get("transfer_id");
	const transferId = typeof rawTransfer === "string" && rawTransfer ? Number(rawTransfer) : null;

	if (!Number.isInteger(employeeId) || employeeId <= 0) {
		return { error: "Missing employee.", nextKey };
	}
	if (!Number.isInteger(points) || points === 0) {
		// Zero would be a movement that says nothing and cannot itself be undone.
		return { error: "Points must be a whole number, and not zero.", nextKey };
	}
	if (transferId !== null && (!Number.isInteger(transferId) || transferId <= 0)) {
		return { error: "That transfer is not one we can correct.", nextKey };
	}
	if (points < 0 && transferId === null) {
		return {
			error: "Taking points back means correcting the transfer that handed them over. Choose one.",
			nextKey,
		};
	}
	if (transferId !== null && (typeof reason !== "string" || !reason.trim())) {
		return { error: "A correction needs a reason.", nextKey };
	}
	if (typeof idempotencyKey !== "string" || !idempotencyKey) {
		return { error: "This form is stale. Reload the page and try again.", nextKey };
	}

	const note = typeof reason === "string" && reason.trim() ? reason.trim() : null;

	try {
		if (transferId !== null) {
			await requestWithSession(`/company/point-transfers/${transferId}/corrections`, {
				method: "POST",
				idempotencyKey,
				body: { employee_id: employeeId, points, reason_note: note },
			});
		} else {
			await requestWithSession(`/company/employees/${employeeId}/points`, {
				method: "POST",
				idempotencyKey,
				body: { points, reason_note: note },
			});
		}
	} catch (error) {
		// INSUFFICIENT_POINTS is the pool on a grant, but on a take-back it is
		// the employee who is short — describe() cannot tell the two apart.
		if (points < 0 && isApiError(error) && error.code === "INSUFFICIENT_POINTS") {
			return { error: "This employee does not hold enough points for that.", nextKey };
		}
		return { error: describe(error, "Could not adjust the balance."), nextKey };
	}

	revalidateEmployee(employeeId);
	return { ok: true, nextKey };
}

/**
 * Grants points to several employees at once.
 *
 * One operation, not a loop: the API debits the pool once for the whole sum
 * and either everybody receives points or nobody does. Granting in a loop
 * from here would give up that guarantee — a pool that ran dry halfway would
 * leave some people paid and some not, with no record of which.
 *
 * Allocations arrive as one form field per employee (`points_{id}`), so the
 * form needs no JSON and no hidden bookkeeping. Employees left blank or at
 * zero are simply not in the grant.
 */
export async function grantPointsInBulk(
	_prevState: GrantState,
	formData: FormData,
): Promise<GrantState> {
	await requireCompanyAdministrator();

	const nextKey = crypto.randomUUID();
	const reason = formData.get("reason_note");
	const idempotencyKey = formData.get("idempotency_key");

	const allocations: Array<{ employee_id: number; points: number }> = [];

	for (const [field, raw] of formData.entries()) {
		const match = /^points_(\d+)$/.exec(field);
		if (!match || typeof raw !== "string" || !raw.trim()) continue;

		const employeeId = Number(match[1]);
		const points = Number(raw);

		if (!Number.isInteger(points) || points === 0) {
			return { error: "Every amount must be a whole number.", nextKey };
		}
		// The API takes positive amounts only here: a group grant hands points
		// out. Taking any back is a correction against the transfer it creates.
		if (points < 0) {
			return { error: "A group grant cannot take points back.", nextKey };
		}

		allocations.push({ employee_id: employeeId, points });
	}

	if (allocations.length === 0) {
		return { error: "Enter an amount for at least one employee.", nextKey };
	}
	if (typeof idempotencyKey !== "string" || !idempotencyKey) {
		return { error: "This form is stale. Reload the page and try again.", nextKey };
	}

	try {
		await requestWithSession("/company/point-grants", {
			method: "POST",
			idempotencyKey,
			body: {
				allocations,
				reason_note: typeof reason === "string" && reason.trim() ? reason.trim() : null,
			},
		});
	} catch (error) {
		return { error: describe(error, "Could not grant the points."), nextKey };
	}

	revalidateEmployee();
	return { ok: true, nextKey };
}

/**
 * Undoes a whole transfer by posting its mirror image.
 *
 * Distinct from a correction, which adjusts one employee's share of a
 * transfer by a signed amount. A reversal takes back everything that transfer
 * moved, for everybody it touched — reversing a group grant from one
 * employee's history undoes it for every recipient. The screen has to say so,
 * because the API will not ask twice.
 *
 * The transfer being reversed is not edited: the reversal is its own entry,
 * pointing back at the original through source_transfer_id.
 */
export async function reverseTransfer(
	transferId: number,
	employeeId: number,
	_prevState: ConfirmState,
	formData: FormData,
): Promise<ConfirmState> {
	await requireCompanyAdministrator();

	const reason = formData.get("reason_note");
	const idempotencyKey = formData.get("idempotency_key");

	if (typeof reason !== "string" || !reason.trim()) {
		return { error: "A reversal needs a reason." };
	}
	if (typeof idempotencyKey !== "string" || !idempotencyKey) {
		return { error: "This form is stale. Reload the page and try again." };
	}

	try {
		await requestWithSession(`/company/point-transfers/${transferId}/reversals`, {
			method: "POST",
			idempotencyKey,
			body: { reason_note: reason.trim() },
		});
	} catch (error) {
		// The commonest refusal by far: nothing in the point history says which
		// transfer a reversal undid, so the dashboard cannot hide the action on
		// one that has already been reversed. The API knows, and says so.
		if (isApiError(error) && error.code === "INVALID_TRANSFER") {
			return { error: error.message || "That transfer cannot be reversed." };
		}
		return { error: describe(error, "Could not reverse the transfer.") };
	}

	revalidateEmployee(employeeId);
	return undefined;
}

/**
 * Closes an employee record. Their remaining balance returns to the company
 * pool — this is the API's equivalent of the old delete, and nothing is
 * destroyed: the record and its history stay readable.
 */
export async function deactivateEmployee(
	employeeId: number,
	_prevState: ConfirmState,
	formData: FormData,
): Promise<ConfirmState> {
	await requireCompanyAdministrator();

	const idempotencyKey = formData.get("idempotency_key");
	if (typeof idempotencyKey !== "string" || !idempotencyKey) {
		return { error: "This form is stale. Reload the page and try again." };
	}

	try {
		await requestWithSession(`/company/employees/${employeeId}/deactivate`, {
			method: "POST",
			idempotencyKey,
		});
	} catch (error) {
		return { error: describe(error, "Could not deactivate the employee.") };
	}

	revalidateEmployee(employeeId);
	// Outside the try: redirect() reports itself by throwing, and catching it
	// would turn a successful deactivation into an error message.
	redirect("/employees");
}
