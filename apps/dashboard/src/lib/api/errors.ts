import "server-only";

/**
 * The API answers every failure with `{ message, code }`. The message is
 * explicitly documented as free to change — `code` is the stable contract and
 * the only thing worth branching on. See the `code` enums in the OpenAPI
 * document at ${API_BASE_URL}/../docs.
 */
export type ApiErrorCode =
	// Authentication and authorisation
	| "UNAUTHENTICATED"
	| "INVALID_CREDENTIALS"
	| "FORBIDDEN"
	| "SESSION_UNAVAILABLE"
	// Requests
	| "NOT_FOUND"
	| "VALIDATION_FAILED"
	| "TOO_MANY_REQUESTS"
	| "SERVER_ERROR"
	// Idempotency (every point movement requires an Idempotency-Key)
	| "IDEMPOTENCY_KEY_REQUIRED"
	| "IDEMPOTENCY_KEY_CONFLICT"
	| "IDEMPOTENCY_REQUEST_IN_PROGRESS"
	// Domain rules
	| "INSUFFICIENT_POINTS"
	| "COMPANY_NOT_ACTIVE"
	| "EMPLOYEE_NOT_ACTIVE"
	| "TENANT_CONTEXT_MISSING";

export class ApiError extends Error {
	readonly status: number;
	readonly code: string;
	/** Field name → messages, present on a 422. */
	readonly errors?: Record<string, string[]>;

	constructor(status: number, code: string, message: string, errors?: Record<string, string[]>) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
		this.errors = errors;
	}

	is(...codes: ApiErrorCode[]): boolean {
		return codes.includes(this.code as ApiErrorCode);
	}

	/** The first validation message for a field, if there is one. */
	fieldError(field: string): string | undefined {
		return this.errors?.[field]?.[0];
	}
}

export function isApiError(error: unknown): error is ApiError {
	return error instanceof ApiError;
}
