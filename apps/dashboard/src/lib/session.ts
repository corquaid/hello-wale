import "server-only";
import { EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";
import type { AuthenticatedUser } from "@/lib/api/types";

/**
 * The dashboard signs in against the backend API, which answers with a Laravel
 * session cookie. The browser never talks to that API directly — every call is
 * made server-side (Server Components and Server Actions), so the upstream
 * cookies have to be held somewhere between requests. They live here, inside
 * this app's own httpOnly cookie.
 *
 * Encrypted rather than merely signed: unlike the old shared-password payload,
 * this one carries a live credential. A signed JWT is readable by anyone
 * holding the cookie, and the Laravel session cookie inside it is all an
 * attacker would need to act as the signed-in administrator.
 */
const COOKIE_NAME = "session";

export interface SessionPayload {
	/** Serialised `Cookie:` header to replay upstream (session + XSRF cookies). */
	cookie: string;
	/** Decoded XSRF-TOKEN, sent as `X-XSRF-TOKEN` on every write. */
	xsrfToken: string;
	/** Identity as of sign-in. `/auth/me` remains the authority. */
	user: AuthenticatedUser;
	expiresAt: number;
}

/**
 * A256GCM needs exactly 32 bytes, and SESSION_SECRET is a free-form string
 * (the documented `openssl rand -base64 32` gives 44 characters). Hashing
 * makes any secret the right length without asking the operator to care.
 */
async function getEncryptionKey(): Promise<Uint8Array> {
	const secret = process.env.SESSION_SECRET;
	if (!secret) {
		throw new Error("SESSION_SECRET is not set. Generate one with `openssl rand -base64 32`.");
	}
	const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
	return new Uint8Array(digest);
}

/**
 * Mirrors the upstream session's own lifetime. The backend's SESSION_LIFETIME
 * defaults to 120 minutes; holding our cookie longer than the session it
 * points at only produces calls that fail with UNAUTHENTICATED.
 */
function sessionDurationMs(): number {
	const minutes = Number(process.env.API_SESSION_LIFETIME_MINUTES ?? 120);
	return (Number.isFinite(minutes) && minutes > 0 ? minutes : 120) * 60 * 1000;
}

export async function createSession(
	input: Omit<SessionPayload, "expiresAt">,
): Promise<SessionPayload> {
	const expiresAt = Date.now() + sessionDurationMs();
	const payload: SessionPayload = { ...input, expiresAt };

	const jwe = await new EncryptJWT({ ...payload })
		.setProtectedHeader({ alg: "dir", enc: "A256GCM" })
		.setIssuedAt()
		.setExpirationTime(new Date(expiresAt))
		.encrypt(await getEncryptionKey());

	const cookieStore = await cookies();
	cookieStore.set(COOKIE_NAME, jwe, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		expires: new Date(expiresAt),
		sameSite: "lax",
		path: "/",
	});

	return payload;
}

export async function verifySession(): Promise<SessionPayload | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value;
	if (!token) return null;

	try {
		const { payload } = await jwtDecrypt(token, await getEncryptionKey());
		return payload as unknown as SessionPayload;
	} catch {
		// Tampered, expired, or encrypted under a rotated secret.
		return null;
	}
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_NAME);
}
