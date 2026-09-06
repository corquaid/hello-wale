import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/session";

// Next.js 16 renamed the `middleware` file convention to `proxy` — this is
// that file, not a leftover. See: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
//
// Auth is the backend API's session, held inside this app's own encrypted
// cookie (see lib/session.ts + app/login/actions.ts). This is an optimistic
// check on that cookie alone — it cannot know whether the upstream session is
// still alive, so every Server Action / data request also calls requireUser()
// (see src/lib/auth.ts), which asks the API. Protection doesn't depend on this
// matcher config being correct forever.
export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Public API, called cross-origin from the marketing site — no session
	// cookie to check. See src/app/api/contact/route.ts.
	if (pathname.startsWith("/api/contact")) {
		return NextResponse.next();
	}

	// Clears a stale cookie and bounces to /login. It must be reachable while
	// still holding a session cookie, which is exactly what the rule below
	// would otherwise redirect away. See app/session/expired/route.ts.
	if (pathname === "/session/expired") {
		return NextResponse.next();
	}

	const session = await verifySession();
	const isPublicRoute = pathname === "/login";

	if (!session && !isPublicRoute) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	if (session && isPublicRoute) {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all paths except:
		 * - _next/static, _next/image (Next internals)
		 * - favicon.ico and other static assets
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
