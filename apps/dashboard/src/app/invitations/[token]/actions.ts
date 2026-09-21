"use server";

import { redirect } from "next/navigation";
import { openCsrfJar, rawRequest, serialiseJar, xsrfTokenFrom } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import type { AuthenticatedUser, Envelope } from "@/lib/api/types";
import { createSession } from "@/lib/session";

export type AcceptState = { error: string } | undefined;

/**
 * Takes up an invitation: sets a name and password, and signs the new
 * administrator in.
 *
 * The same three steps as signing in — CSRF cookie, the write, then keep the
 * session that comes back — but the credential is the token in the path
 * rather than an email and password, and the API spends it here. There is no
 * second attempt with the same link.
 */
export async function acceptInvitation(
	token: string,
	_prevState: AcceptState,
	formData: FormData,
): Promise<AcceptState> {
	const firstName = formData.get("first_name");
	const lastName = formData.get("last_name");
	const password = formData.get("password");
	const passwordConfirmation = formData.get("password_confirmation");

	if (typeof firstName !== "string" || !firstName.trim()) {
		return { error: "Enter your first name." };
	}
	if (typeof lastName !== "string" || !lastName.trim()) {
		return { error: "Enter your last name." };
	}
	if (typeof password !== "string" || !password) {
		return { error: "Choose a password." };
	}
	// Checked here as well as upstream so the answer is immediate, and so the
	// token is not spent on a request that was never going to succeed.
	if (password !== passwordConfirmation) {
		return { error: "The two passwords do not match." };
	}

	try {
		const { jar, xsrfToken } = await openCsrfJar();

		const { data, setCookies } = await rawRequest<Envelope<AuthenticatedUser>>(
			`/invitations/${encodeURIComponent(token)}/accept`,
			{
				method: "POST",
				body: {
					first_name: firstName.trim(),
					last_name: lastName.trim(),
					password,
					password_confirmation: passwordConfirmation,
				},
				cookie: serialiseJar(jar),
				xsrfToken,
			},
		);

		// Accepting signs the new account in, and Laravel regenerates the session
		// id when it does, so the session is in the cookies that come back.
		const sessionJar = { ...jar, ...setCookies };

		await createSession({
			cookie: serialiseJar(sessionJar),
			xsrfToken: xsrfTokenFrom(sessionJar) || xsrfToken,
			user: data.data,
		});
	} catch (error) {
		if (isApiError(error)) {
			if (error.is("INVITATION_EXPIRED")) {
				return { error: "This invitation has expired. Ask for a new one." };
			}
			if (error.is("INVITATION_ALREADY_ACCEPTED")) {
				return { error: "This invitation has already been used. Sign in instead." };
			}
			if (error.is("EMAIL_ALREADY_REGISTERED")) {
				return { error: "An account already exists for this address. Sign in instead." };
			}
			if (error.is("NOT_FOUND")) {
				return { error: "This invitation link is not valid. Check it and try again." };
			}
			if (error.is("VALIDATION_FAILED")) {
				return {
					error:
						error.fieldError("password") ??
						error.fieldError("first_name") ??
						error.fieldError("last_name") ??
						"Check the details and try again.",
				};
			}
			if (error.is("TOO_MANY_REQUESTS")) {
				return { error: "Too many attempts. Wait a minute and try again." };
			}
			if (error.is("SESSION_UNAVAILABLE")) {
				return {
					error:
						"The API will not open a session for this origin. Add API_ORIGIN to the backend's SANCTUM_STATEFUL_DOMAINS.",
				};
			}
		}

		console.error("Accepting an invitation failed", error);
		return { error: "Could not reach the API. Try again." };
	}

	redirect("/");
}
