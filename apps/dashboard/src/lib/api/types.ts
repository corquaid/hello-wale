import "server-only";

/**
 * Hand-written mirrors of the API's response schemas. The source of truth is
 * the OpenAPI document the backend serves at /docs (raw: /openapi.json) — if
 * these drift, that document wins.
 */

export type Role = "platform_operator" | "company_administrator";

export interface AuthenticatedUser {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	role: Role;
	/** Null for platform operators, who belong to no company by definition. */
	company_id: number | null;
}

export type CompanyStatus = "active" | "suspended" | "trial";
export type EmployeeStatus = "active" | "inactive";
export type EntryMovement = "credit" | "debit";

export type ReasonCode =
	| "GRANT"
	| "BULK_GRANT"
	| "CORRECTION"
	| "REVERSAL"
	| "EMPLOYEE_DEACTIVATED"
	| "COMPANY_TOPUP"
	| "PURCHASE";

export interface Company {
	id: number;
	name: string;
	status: CompanyStatus;
	/** Whole minor units of currency for one point. */
	point_conversion_rate_minor_units: number;
	/** Whole percentage, 0 to 100. */
	discount_limit_percent: number;
	created_at: string;
	updated_at: string;
}

export interface Employee {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	status: EmployeeStatus;
	points_balance: number;
	deactivated_at: string | null;
	created_at: string;
}

export interface CompanyReport {
	/** Points bought and not yet handed out. */
	pool_balance: number;
	/** Everything that has ever reached an employee account. */
	points_granted_total: number;
	/** Everything that has ever come back, mostly through deactivations. */
	points_returned_total: number;
	/** What employees hold right now: granted minus returned. */
	points_held_by_employees: number;
	active_employees: number;
	inactive_employees: number;
}

export interface PointHistoryEntry {
	id: number;
	transfer_id: number;
	/** Negative took points away, positive brought them in. */
	amount: number;
	balance_after: number;
	reason_code: ReasonCode;
	reason_note: string | null;
	created_at: string;
}

export interface PointEntry {
	id: number;
	account_id: number;
	/** Negative debits the account, positive credits it. */
	amount: number;
	balance_after: number;
	reason_code: ReasonCode;
	created_at: string;
}

export interface PointTransfer {
	id: number;
	reason_code: ReasonCode;
	reason_note: string | null;
	/** Set on a correction or a reversal: the transfer this one undoes. */
	source_transfer_id: number | null;
	initiated_by: number | null;
	created_at: string;
	entries: PointEntry[];
}

export interface AuditLog {
	id: number;
	action: string;
	auditable_type: string;
	auditable_id: number;
	/** Null on creation: there was nothing there before. */
	before: Record<string, unknown> | null;
	/** Null on deletion: there is nothing there now. */
	after: Record<string, unknown> | null;
	actor_id: number | null;
	ip: string | null;
	created_at: string;
}

export interface Invitation {
	id: number;
	email: string;
	role: Role;
	expires_at: string;
	accepted_at: string | null;
	/** Identifier of the account that sent this invitation. */
	invited_by: number | null;
	created_at: string;
}

/** Laravel's paginator metadata. Only some list endpoints return it. */
export interface PaginationMeta {
	current_page: number;
	from: number | null;
	last_page: number;
	per_page: number;
	to: number | null;
	total: number;
}

/** Every response wraps its payload in `data`. */
export interface Envelope<T> {
	data: T;
}

export interface PaginatedEnvelope<T> {
	data: T[];
	meta: PaginationMeta;
	links: { first: string | null; last: string | null; prev: string | null; next: string | null };
}
