import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/session";

// Next.js 16 renamed the `middleware` file convention to `proxy` — this is
// that file, not a leftover. See: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
//
// Demo-mode auth: a single shared-password session cookie (see
// lib/session.ts + app/login/actions.ts), not per-user accounts. This is an
// optimistic check — every Server Action / data request also calls
// requireSession() (see src/lib/auth.ts), so protection doesn't depend on
// this matcher config being correct forever.
export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Public API, called cross-origin from the marketing site — no session
	// cookie to check. See src/app/api/contact/route.ts.
	if (pathname.startsWith("/api/contact")) {
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
		url.pathname = "/customers";
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
