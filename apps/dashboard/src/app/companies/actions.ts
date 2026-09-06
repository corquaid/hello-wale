"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requestWithSession } from "@/lib/api/client";
import { isApiError, type ApiError } from "@/lib/api/errors";
import { requireOperator } from "@/lib/auth";
import type { Company, Employee, Envelope } from "@/lib/api/types";

export type ActionState = { error: string } | undefined;

/** See the twin in app/employees/actions.ts — only `code` is ever matched on. */
function describe(error: unknown, fallback: string): string {
	if (!isApiError(error)) {
		console.error(fallback, error);
		return "Could not reach the API. Try again.";
	}

	const api = error as ApiError;

	switch (api.code) {
		case "COMPANY_NOT_ACTIVE":
			return "This company is not active, so its points cannot be moved.";
		case "IDEMPOTENCY_KEY_CONFLICT":
			return "This form was already submitted with different details. Reload and try again.";
		case "IDEMPOTENCY_REQUEST_IN_PROGRESS":
			return "That submission is still being processed. Give it a moment.";
		case "VALIDATION_FAILED":
			return Object.values(api.errors ?? {})[0]?.[0] ?? "Check the details and try again.";
		case "TOO_MANY_REQUESTS":
			return "Too many requests. Wait a moment and try again.";
		default:
			console.error(fallback, api);
			return api.message || fallback;
	}
}

function revalidateCompany(companyId: number) {
	revalidatePath(`/companies/${companyId}`);
	revalidatePath(`/companies/${companyId}/audit-logs`);
	revalidatePath("/companies");
	revalidatePath("/");
}

/**
 * Brings points into a company's pool from outside the platform. This is the
 * operator's only way to move points, and it stops at the pool — handing them
 * to a named employee is the company administrator's job.
 */
export async function topUpCompany(
	companyId: number,
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireOperator();

	const points = Number(formData.get("points"));
	const reason = formData.get("reason_note");
	const idempotencyKey = formData.get("idempotency_key");

	if (!Number.isInteger(points) || points <= 0) {
		return { error: "Points must be a whole number above zero." };
	}
	if (typeof idempotencyKey !== "string" || !idempotencyKey) {
		return { error: "This form is stale. Reload the page and try again." };
	}

	try {
		await requestWithSession(`/operator/companies/${companyId}/points`, {
			method: "POST",
			idempotencyKey,
			body: {
				points,
				reason_note: typeof reason === "string" && reason.trim() ? reason.trim() : null,
			},
		});
	} catch (error) {
		return { error: describe(error, "Could not top up the pool.") };
	}

	revalidateCompany(companyId);
	redirect(`/companies/${companyId}`);
}

export async function updateCompany(
	companyId: number,
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireOperator();

	const name = formData.get("name");
	const status = formData.get("status");
	const rate = Number(formData.get("point_conversion_rate_minor_units"));
	const discount = Number(formData.get("discount_limit_percent"));

	if (typeof name !== "string" || !name.trim()) return { error: "A name is required." };
	if (!Number.isInteger(rate) || rate <= 0) {
		// Whole minor units only — the API rejects a fraction outright.
		return { error: "The conversion rate must be a whole number of minor units." };
	}
	if (!Number.isInteger(discount) || discount < 0 || discount > 100) {
		return { error: "The discount limit must be a whole percentage between 0 and 100." };
	}

	try {
		await requestWithSession(`/operator/companies/${companyId}`, {
			method: "PATCH",
			body: {
				name: name.trim(),
				status,
				point_conversion_rate_minor_units: rate,
				discount_limit_percent: discount,
			},
		});
	} catch (error) {
		return { error: describe(error, "Could not update the company.") };
	}

	revalidateCompany(companyId);
	redirect(`/companies/${companyId}`);
}

export async function createCompany(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireOperator();

	const name = formData.get("name");
	const status = formData.get("status");
	const rate = Number(formData.get("point_conversion_rate_minor_units"));
	const discount = Number(formData.get("discount_limit_percent"));

	if (typeof name !== "string" || !name.trim()) return { error: "A name is required." };
	if (!Number.isInteger(rate) || rate <= 0) {
		return { error: "The conversion rate must be a whole number of minor units." };
	}
	if (!Number.isInteger(discount) || discount < 0 || discount > 100) {
		return { error: "The discount limit must be a whole percentage between 0 and 100." };
	}

	let company: Company;
	try {
		const { data } = await requestWithSession<Envelope<Company>>("/operator/companies", {
			method: "POST",
			body: {
				name: name.trim(),
				status,
				point_conversion_rate_minor_units: rate,
				discount_limit_percent: discount,
			},
		});
		company = data;
	} catch (error) {
		return { error: describe(error, "Could not create the company.") };
	}

	revalidatePath("/companies");
	revalidatePath("/");
	redirect(`/companies/${company.id}`);
}

export async function createCompanyEmployee(
	companyId: number,
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireOperator();

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
		const { data } = await requestWithSession<Envelope<Employee>>(
			`/operator/companies/${companyId}/employees`,
			{
				method: "POST",
				body: {
					first_name: firstName.trim(),
					last_name: lastName.trim(),
					email: email.trim(),
				},
			},
		);
		employee = data;
	} catch (error) {
		return { error: describe(error, "Could not add the employee.") };
	}

	revalidateCompany(companyId);
	redirect(`/companies/${companyId}/employees/${employee.id}`);
}

export async function deactivateCompanyEmployee(
	companyId: number,
	employeeId: number,
	formData: FormData,
) {
	await requireOperator();

	const idempotencyKey = formData.get("idempotency_key");
	if (typeof idempotencyKey !== "string" || !idempotencyKey) {
		throw new Error("Missing idempotency key for deactivation.");
	}

	await requestWithSession(`/operator/companies/${companyId}/employees/${employeeId}/deactivate`, {
		method: "POST",
		idempotencyKey,
	});

	revalidateCompany(companyId);
	redirect(`/companies/${companyId}`);
}

export async function inviteAdministrator(
	companyId: number,
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireOperator();

	const email = formData.get("email");
	if (typeof email !== "string" || !email.trim()) return { error: "An email address is required." };

	try {
		await requestWithSession(`/operator/companies/${companyId}/invitations`, {
			method: "POST",
			body: { email: email.trim() },
		});
	} catch (error) {
		return { error: describe(error, "Could not send the invitation.") };
	}

	revalidateCompany(companyId);
	redirect(`/companies/${companyId}`);
}
