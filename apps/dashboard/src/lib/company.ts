import "server-only";
import { cache } from "react";
import { requestWithSession } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import { requireCompanyAdministrator } from "@/lib/auth";
import type {
	CompanyReport,
	Employee,
	EmployeeStatus,
	Envelope,
	PaginatedEnvelope,
	PointHistoryEntry,
} from "@/lib/api/types";

/**
 * Reads for the company administrator's half of the API (`/company/*`). The
 * signed-in administrator's company is implied by the session — no company id
 * is ever passed, and the API refuses the request outright if it cannot
 * establish one (TENANT_CONTEXT_MISSING).
 *
 * Each read guards first, so a platform operator landing on one of these
 * screens is redirected rather than shown an unexplained 403.
 */

export const getCompanyReport = cache(async (): Promise<CompanyReport> => {
	await requireCompanyAdministrator();
	const { data } = await requestWithSession<Envelope<CompanyReport>>("/company/report");
	return data;
});

export const getEmployees = cache(
	async (options: { status?: EmployeeStatus } = {}): Promise<Employee[]> => {
		await requireCompanyAdministrator();
		const { data } = await requestWithSession<Envelope<Employee[]>>("/company/employees", {
			query: {
				status: options.status,
				sort: "first_name",
				direction: "asc",
				// This list returns no pagination metadata, so there is no page
				// count to render — take the API's maximum and note the ceiling.
				per_page: EMPLOYEE_PAGE_LIMIT,
			},
		});
		return data;
	},
);

/** The API caps per_page at 100 on every list. */
export const EMPLOYEE_PAGE_LIMIT = 100;

export const getEmployee = cache(async (id: number): Promise<Employee | null> => {
	await requireCompanyAdministrator();
	try {
		const { data } = await requestWithSession<Envelope<Employee>>(`/company/employees/${id}`);
		return data;
	} catch (error) {
		// An employee of another company answers 404 rather than 403, by design
		// — so this covers "no such employee" and "not yours" alike.
		if (isApiError(error) && error.is("NOT_FOUND")) return null;
		throw error;
	}
});

export const getEmployeePointHistory = cache(
	async (id: number, options: { perPage?: number } = {}): Promise<PointHistoryEntry[]> => {
		await requireCompanyAdministrator();
		const response = await requestWithSession<PaginatedEnvelope<PointHistoryEntry>>(
			`/company/employees/${id}/points`,
			{ query: { per_page: options.perPage ?? EMPLOYEE_PAGE_LIMIT } },
		);
		return response.data;
	},
);

export interface ActivityEntry extends PointHistoryEntry {
	employee_id: number;
	employee_name: string;
}

/**
 * Company-wide points activity, newest first.
 *
 * The API has no company-wide feed — point history is only exposed per
 * employee — so this fans out across the employee list. That is one request
 * per employee, which is fine at the scale this dashboard runs at and clearly
 * wrong beyond it. The fix belongs upstream: a `/company/points` endpoint
 * would collapse this to a single paginated call. Until then the fan-out is
 * bounded by EMPLOYEE_PAGE_LIMIT rather than left to grow.
 */
export const getCompanyActivity = cache(async (): Promise<ActivityEntry[]> => {
	const employees = await getEmployees();

	const histories = await Promise.all(
		employees.map(async (employee) => {
			const entries = await getEmployeePointHistory(employee.id);
			return entries.map((entry) => ({
				...entry,
				employee_id: employee.id,
				employee_name: `${employee.first_name} ${employee.last_name}`,
			}));
		}),
	);

	return histories
		.flat()
		.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
});

export interface DailyActivity {
	date: string;
	awarded: number;
	redeemed: number;
}

/**
 * Buckets company activity by day for the chart. Derived from the same
 * fan-out as getCompanyActivity — see the note there.
 */
export async function getPointsActivityByDay(
	range: { from?: string; to?: string } = {},
): Promise<DailyActivity[]> {
	const activity = await getCompanyActivity();
	const byDay = new Map<string, DailyActivity>();

	for (const entry of activity) {
		const date = entry.created_at.slice(0, 10);
		if (range.from && date < range.from) continue;
		if (range.to && date > range.to) continue;

		const day = byDay.get(date) ?? { date, awarded: 0, redeemed: 0 };
		// Positive brought points in, negative took them away.
		if (entry.amount > 0) day.awarded += entry.amount;
		else day.redeemed += Math.abs(entry.amount);
		byDay.set(date, day);
	}

	return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/** Reason codes rendered for people rather than machines. */
export const REASON_LABELS: Record<string, string> = {
	GRANT: "Grant",
	BULK_GRANT: "Bulk grant",
	CORRECTION: "Correction",
	REVERSAL: "Reversal",
	EMPLOYEE_DEACTIVATED: "Returned on deactivation",
	COMPANY_TOPUP: "Company top-up",
	PURCHASE: "Purchase",
};
