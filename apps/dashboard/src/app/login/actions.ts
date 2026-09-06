"use server";

import { redirect } from "next/navigation";
import { openCsrfJar, rawRequest, serialiseJar, xsrfTokenFrom } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import type { AuthenticatedUser, Envelope } from "@/lib/api/types";
import { createSession, deleteSession, verifySession } from "@/lib/session";

export type LoginState = { error: string } | undefined;

/**
 * Signs in against the backend API and keeps the session it hands back.
 *
 * Three steps, all of them required by the backend:
 *   1. GET /sanctum/csrf-cookie — Laravel refuses any write, sign-in included,
 *      without a CSRF token.
 *   2. POST /auth/login — answers with a regenerated session cookie.
 *   3. Store both cookies in this app's own encrypted cookie, since the
 *      browser never speaks to the API directly.
 */
export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
	const email = formData.get("email");
	const password = formData.get("password");

	if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
		return { error: "Enter an email address and password." };
	}

	try {
		const { jar, xsrfToken } = await openCsrfJar();

		const { data, setCookies } = await rawRequest<Envelope<AuthenticatedUser>>("/auth/login", {
			method: "POST",
			body: { email, password },
			cookie: serialiseJar(jar),
			xsrfToken,
		});

		// Laravel regenerates the session id on sign-in, so the cookies that
		// come back on this response — not the ones we sent — are the session.
		const sessionJar = { ...jar, ...setCookies };

		await createSession({
			cookie: serialiseJar(sessionJar),
			// The refreshed XSRF cookie belongs to the regenerated session; fall
			// back to the pre-login token if this response did not re-issue one.
			xsrfToken: xsrfTokenFrom(sessionJar) || xsrfToken,
			user: data.data,
		});
	} catch (error) {
		if (isApiError(error)) {
			if (error.is("INVALID_CREDENTIALS")) {
				return { error: "Invalid email or password." };
			}
			if (error.is("TOO_MANY_REQUESTS")) {
				return { error: "Too many sign-in attempts. Wait a minute and try again." };
			}
			if (error.is("VALIDATION_FAILED")) {
				return { error: error.fieldError("email") ?? "Check the details and try again." };
			}
			// The API refuses to sign in a request it cannot give a session to,
			// which means API_ORIGIN is not in the backend's stateful domains.
			if (error.is("SESSION_UNAVAILABLE")) {
				return {
					error:
						"The API will not open a session for this origin. Add API_ORIGIN to the backend's SANCTUM_STATEFUL_DOMAINS.",
				};
			}
		}

		console.error("Sign-in failed", error);
		return { error: "Could not reach the API. Try again." };
	}

	redirect("/");
}

/**
 * Ends the upstream session as well as this one. A failure upstream is not
 * worth blocking on — the local cookie goes either way, so the user is signed
 * out of the dashboard even if the API never hears about it.
 */
export async function signOut() {
	const session = await verifySession();

	if (session) {
		try {
			await rawRequest("/auth/logout", {
				method: "POST",
				cookie: session.cookie,
				xsrfToken: session.xsrfToken,
			});
		} catch (error) {
			console.error("Upstream sign-out failed", error);
		}
	}

	await deleteSession();
	redirect("/login");
}
