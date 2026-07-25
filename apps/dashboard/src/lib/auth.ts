import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { verifySession, type SessionPayload } from "@/lib/session";

/**
 * Verifies the shared-password session cookie and redirects to /login if
 * there isn't one. Call this at the top of every protected Server
 * Component, Server Action, and Route Handler — proxy.ts does an optimistic
 * check, but this is the check that actually matters. Memoized per-request.
 */
export const requireSession = cache(async (): Promise<SessionPayload> => {
	const session = await verifySession();

	if (!session) {
		redirect("/login");
	}

	return session;
});
