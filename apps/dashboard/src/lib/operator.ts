import "server-only";
import { cache } from "react";
import { requestWithSession } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import { requireOperator } from "@/lib/auth";
import type {
	AuditLog,
	Company,
	Employee,
	Envelope,
	Invitation,
	PaginatedEnvelope,
} from "@/lib/api/types";

/**
 * Reads for the platform operator's half of the API (`/operator/*`).
 *
 * The operator space mirrors most of what a company administrator can see,
 * but scoped to a company named in the path rather than implied by the
 * session. It is not a superset: there is no operator route for an employee's
 * points history, nor for granting, correcting or reversing points. An
 * operator funds a company's pool; only the company hands points to its own
 * people. See OPERATOR_CANNOT below, which the UI uses to say so out loud
 * rather than showing an empty panel.
 */

/** The API caps per_page at 100 on every list. */
const PAGE_LIMIT = 100;

export const OPERATOR_CANNOT =
	"Points history, grants and corrections belong to the company's own administrators — the platform operator funds the pool but does not move points inside a company.";

export const getCompanies = cache(async (): Promise<Company[]> => {
	await requireOperator();
	const { data } = await requestWithSession<Envelope<Company[]>>("/operator/companies", {
		query: { sort: "name", direction: "asc", per_page: PAGE_LIMIT },
	});
	return data;
});

export const getCompany = cache(async (companyId: number): Promise<Company | null> => {
	await requireOperator();
	try {
		const { data } = await requestWithSession<Envelope<Company>>(
			`/operator/companies/${companyId}`,
		);
		return data;
	} catch (error) {
		if (isApiError(error) && error.is("NOT_FOUND")) return null;
		throw error;
	}
});

export const getCompanyReport = cache(async (companyId: number) => {
	await requireOperator();
	const { data } = await requestWithSession<
		Envelope<{
			pool_balance: number;
			points_granted_total: number;
			points_returned_total: number;
			points_held_by_employees: number;
			active_employees: number;
			inactive_employees: number;
		}>
	>(`/operator/companies/${companyId}/report`);
	return data;
});

export const getCompanyEmployees = cache(async (companyId: number): Promise<Employee[]> => {
	await requireOperator();
	const { data } = await requestWithSession<Envelope<Employee[]>>(
		`/operator/companies/${companyId}/employees`,
		{ query: { sort: "first_name", direction: "asc", per_page: PAGE_LIMIT } },
	);
	return data;
});

export const getCompanyEmployee = cache(
	async (companyId: number, employeeId: number): Promise<Employee | null> => {
		await requireOperator();
		try {
			const { data } = await requestWithSession<Envelope<Employee>>(
				`/operator/companies/${companyId}/employees/${employeeId}`,
			);
			return data;
		} catch (error) {
			if (isApiError(error) && error.is("NOT_FOUND")) return null;
			throw error;
		}
	},
);

export const getAuditLogs = cache(async (companyId: number): Promise<AuditLog[]> => {
	await requireOperator();
	const response = await requestWithSession<PaginatedEnvelope<AuditLog>>(
		`/operator/companies/${companyId}/audit-logs`,
		{ query: { per_page: PAGE_LIMIT } },
	);
	return response.data;
});

export const getInvitations = cache(async (companyId: number): Promise<Invitation[]> => {
	await requireOperator();
	const response = await requestWithSession<PaginatedEnvelope<Invitation>>(
		`/operator/companies/${companyId}/invitations`,
		{ query: { per_page: PAGE_LIMIT } },
	);
	return response.data;
});

/** Turns an audit row's before/after pair into the fields that actually moved. */
export function changedFields(entry: AuditLog): Array<[string, unknown, unknown]> {
	const before = entry.before ?? {};
	const after = entry.after ?? {};
	const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
	return [...keys]
		.filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
		.map((key) => [key, before[key], after[key]]);
}
