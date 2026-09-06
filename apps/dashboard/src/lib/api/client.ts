import "server-only";
import { ApiError } from "@/lib/api/errors";
import { verifySession } from "@/lib/session";
import {
	parseSetCookies,
	serialiseJar,
	xsrfTokenFrom,
	type CookieJar,
} from "@/lib/api/cookies";

/**
 * Every call to the benefit-points API goes through here.
 *
 * The API authenticates browsers by session cookie and only issues bearer
 * tokens on the server (`php artisan token:issue`), with no route that hands
 * one out — so a login form has to use the cookie flow. Two consequences shape
 * this client:
 *
 * 1. Sanctum only grants a session to requests whose Origin is in its stateful
 *    domain list; anything else is refused at sign-in with SESSION_UNAVAILABLE.
 *    So we send an explicit Origin, and it must match what the backend is
 *    configured to accept (see API_ORIGIN in .env.example).
 * 2. Writes need the CSRF token, or the answer is 419 regardless of the
 *    session. See requestWithSession().
 *
 * Calls are made from the server, never the browser, which is what keeps the
 * backend's CORS allowlist irrelevant to this app.
 */

function apiUrl(): string {
	const url = process.env.API_URL;
	if (!url) {
		throw new Error("API_URL is not set (e.g. http://localhost:8080).");
	}
	return url.replace(/\/$/, "");
}

/**
 * The origin this app claims when calling the API. It is not cosmetic: the
 * backend decides whether a request may hold a session by matching it against
 * SANCTUM_STATEFUL_DOMAINS.
 */
function apiOrigin(): string {
	return process.env.API_ORIGIN ?? "http://localhost:3000";
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
	method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
	body?: unknown;
	query?: Record<string, QueryValue>;
	/** Required by every endpoint that moves points, and by both deactivates. */
	idempotencyKey?: string;
	/** Passed through to Next's fetch cache. Reads default to no caching. */
	cache?: RequestCache;
	next?: { revalidate?: number | false; tags?: string[] };
}

export interface RawResponse<T> {
	data: T;
	/** Cookies the API set on this response, if any. */
	setCookies: CookieJar;
	status: number;
	headers: Headers;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
	const url = new URL(`${apiUrl()}/api/v1${path.startsWith("/") ? path : `/${path}`}`);
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value === undefined || value === null || value === "") continue;
		url.searchParams.set(key, String(value));
	}
	return url.toString();
}

async function toApiError(response: Response): Promise<ApiError> {
	let payload: { message?: string; code?: string; errors?: Record<string, string[]> } = {};
	try {
		payload = await response.json();
	} catch {
		// A gateway or PHP fatal can answer with something that is not JSON.
	}

	// 419 is Laravel's CSRF rejection and carries no `code` of its own. It
	// means the token did not match the session, so treat it as being signed
	// out rather than as an unexplained failure.
	const fallbackCode = response.status === 419 ? "UNAUTHENTICATED" : "SERVER_ERROR";

	return new ApiError(
		response.status,
		payload.code ?? fallbackCode,
		payload.message ?? `The API answered ${response.status}.`,
		payload.errors,
	);
}

/**
 * One request, with the caller supplying whatever credentials it has. Used
 * directly by the sign-in flow, which holds a cookie jar that is not yet a
 * session; everything else goes through requestWithSession().
 */
export async function rawRequest<T>(
	path: string,
	options: RequestOptions & { cookie?: string; xsrfToken?: string } = {},
): Promise<RawResponse<T>> {
	const method = options.method ?? "GET";
	const headers = new Headers({
		Accept: "application/json",
		Origin: apiOrigin(),
		// Marks the call as an XHR, which is how Laravel decides to answer with
		// JSON instead of a redirect to a login page that does not exist here.
		"X-Requested-With": "XMLHttpRequest",
	});

	if (options.cookie) headers.set("Cookie", options.cookie);
	if (options.body !== undefined) headers.set("Content-Type", "application/json");
	if (!SAFE_METHODS.has(method) && options.xsrfToken) {
		headers.set("X-XSRF-TOKEN", options.xsrfToken);
	}
	if (options.idempotencyKey) headers.set("Idempotency-Key", options.idempotencyKey);

	const response = await fetch(buildUrl(path, options.query), {
		method,
		headers,
		body: options.body === undefined ? undefined : JSON.stringify(options.body),
		// Reads must not be cached by default: this is an administrative tool
		// where a stale balance is worse than an extra request.
		cache: options.cache ?? "no-store",
		...(options.next ? { next: options.next } : {}),
		redirect: "manual",
	});

	if (!response.ok) throw await toApiError(response);

	const setCookies = parseSetCookies(response);
	const data =
		response.status === 204 || response.headers.get("content-length") === "0"
			? (undefined as T)
			: ((await response.json()) as T);

	return { data, setCookies, status: response.status, headers: response.headers };
}

/**
 * Opens a cookie jar holding a CSRF token. Laravel will not accept a write —
 * including the sign-in POST itself — without one.
 */
export async function openCsrfJar(): Promise<{ jar: CookieJar; xsrfToken: string }> {
	const response = await fetch(`${apiUrl()}/sanctum/csrf-cookie`, {
		headers: { Accept: "application/json", Origin: apiOrigin() },
		cache: "no-store",
	});

	if (!response.ok) throw await toApiError(response);

	const jar = parseSetCookies(response);
	return { jar, xsrfToken: xsrfTokenFrom(jar) };
}

/**
 * A request made as the signed-in user. Reads the credentials out of this
 * app's session cookie and replays them upstream.
 *
 * Throws ApiError("UNAUTHENTICATED") when there is no session, so callers can
 * treat "signed out" and "the API says signed out" the same way — see
 * lib/auth.ts, which turns that into a redirect.
 */
export async function requestWithSession<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	const session = await verifySession();

	if (!session) {
		throw new ApiError(401, "UNAUTHENTICATED", "Not signed in.");
	}

	const { data } = await rawRequest<T>(path, {
		...options,
		cookie: session.cookie,
		xsrfToken: session.xsrfToken,
	});

	return data;
}

export { serialiseJar, xsrfTokenFrom };
