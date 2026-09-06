import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { requestWithSession } from "@/lib/api/client";
import { isApiError } from "@/lib/api/errors";
import type { AuthenticatedUser, Envelope, Role } from "@/lib/api/types";
import { verifySession } from "@/lib/session";

/**
 * Call at the top of every protected Server Component, Server Action and Route
 * Handler. proxy.ts does an optimistic check on the cookie alone; this is the
 * check that actually matters, because only the API can say whether the
 * upstream session behind that cookie is still alive.
 *
 * Memoized per request, so a page that guards in several places still makes
 * one /auth/me call.
 */
export const requireUser = cache(async (): Promise<AuthenticatedUser> => {
	const session = await verifySession();
	if (!session) redirect("/login");

	try {
		const { data } = await requestWithSession<Envelope<AuthenticatedUser>>("/auth/me");
		return data;
	} catch (error) {
		// The upstream session expires on its own schedule (120 minutes by
		// default), so our cookie outliving it is ordinary, not exceptional.
		// Clearing it has to happen in a Route Handler — Next.js refuses cookie
		// writes during a render, and this usually runs inside one.
		if (isApiError(error) && error.is("UNAUTHENTICATED")) {
			redirect("/session/expired");
		}
		throw error;
	}
});

/**
 * The API is split into two route spaces — /operator and /company — and the
 * wrong one refuses everything. Guarding on role here turns what would be an
 * opaque 403 deep inside a page into a redirect the user can act on.
 */
export async function requireRole(role: Role): Promise<AuthenticatedUser> {
	const user = await requireUser();
	if (user.role !== role) redirect("/");
	return user;
}

export const requireOperator = () => requireRole("platform_operator");

/**
 * Company administrators are always scoped to one company, so this narrows
 * company_id to a number and saves every caller a null check the API has
 * already ruled out.
 */
export async function requireCompanyAdministrator(): Promise<
	AuthenticatedUser & { company_id: number }
> {
	const user = await requireRole("company_administrator");
	if (user.company_id === null) {
		throw new Error("A company administrator was returned without a company_id.");
	}
	return user as AuthenticatedUser & { company_id: number };
}

/** The signed-in user, or null — for chrome that renders either way. */
export const getUser = cache(async (): Promise<AuthenticatedUser | null> => {
	const session = await verifySession();
	if (!session) return null;

	try {
		const { data } = await requestWithSession<Envelope<AuthenticatedUser>>("/auth/me");
		return data;
	} catch {
		return null;
	}
});
