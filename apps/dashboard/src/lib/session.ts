import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Demo-mode auth: a single shared username/password (see login/actions.ts),
// not per-user Supabase Auth accounts. This file only manages the signed
// session cookie that remembers "someone signed in with the shared password".
const COOKIE_NAME = "session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecretKey() {
	const secret = process.env.SESSION_SECRET;
	if (!secret) {
		throw new Error("SESSION_SECRET is not set. Generate one with `openssl rand -base64 32`.");
	}
	return new TextEncoder().encode(secret);
}

export interface SessionPayload {
	username: string;
	expiresAt: number;
}

async function encrypt(payload: SessionPayload) {
	return new SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(new Date(payload.expiresAt))
		.sign(getSecretKey());
}

async function decrypt(session: string | undefined): Promise<SessionPayload | null> {
	if (!session) return null;
	try {
		const { payload } = await jwtVerify(session, getSecretKey(), { algorithms: ["HS256"] });
		return payload as unknown as SessionPayload;
	} catch {
		return null;
	}
}

export async function createSession(username: string) {
	const expiresAt = Date.now() + SESSION_DURATION_MS;
	const session = await encrypt({ username, expiresAt });
	const cookieStore = await cookies();

	cookieStore.set(COOKIE_NAME, session, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		expires: new Date(expiresAt),
		sameSite: "lax",
		path: "/",
	});
}

export async function verifySession(): Promise<SessionPayload | null> {
	const cookieStore = await cookies();
	return decrypt(cookieStore.get(COOKIE_NAME)?.value);
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_NAME);
}
