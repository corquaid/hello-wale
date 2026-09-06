import "server-only";

/**
 * A minimal cookie jar. The backend authenticates by session cookie, and the
 * dashboard calls it server-side where there is no browser to keep one.
 * Only name and value are kept: these cookies are replayed to exactly one
 * origin, from the server, so attributes (path, domain, expiry) carry no
 * decision we would act on.
 */
export type CookieJar = Record<string, string>;

export function parseSetCookies(response: Response): CookieJar {
	const jar: CookieJar = {};
	// getSetCookie() keeps multiple Set-Cookie headers separate — reading the
	// header as a single string would join them on commas, which also appear
	// inside Expires dates.
	for (const header of response.headers.getSetCookie()) {
		const [pair] = header.split(";");
		const index = pair.indexOf("=");
		if (index < 1) continue;
		jar[pair.slice(0, index).trim()] = pair.slice(index + 1).trim();
	}
	return jar;
}

export function serialiseJar(jar: CookieJar): string {
	return Object.entries(jar)
		.map(([name, value]) => `${name}=${value}`)
		.join("; ");
}

/**
 * Laravel sends the CSRF token as a URL-encoded cookie and expects it back,
 * decoded, in the X-XSRF-TOKEN header. Omitting the decode is the usual cause
 * of a 419 that looks like a CORS problem.
 */
export function xsrfTokenFrom(jar: CookieJar): string {
	const raw = jar["XSRF-TOKEN"];
	return raw ? decodeURIComponent(raw) : "";
}
