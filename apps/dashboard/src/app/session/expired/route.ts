import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/session";

/**
 * Clears a session cookie whose upstream session is gone.
 *
 * This exists as a Route Handler rather than a helper because Next.js only
 * allows cookies to be written from a Server Action or a Route Handler — and
 * the place that discovers the session is dead is requireUser(), which usually
 * runs while a Server Component renders. Without this the stale cookie would
 * survive, proxy.ts would keep treating it as signed in, and /login would
 * bounce straight back to / in a loop.
 */
export async function GET() {
	await deleteSession();
	redirect("/login");
}
