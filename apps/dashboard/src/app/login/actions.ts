"use server";

import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";

export type LoginState = { error: string } | undefined;

// Demo-mode auth: one shared username/password, set via env vars, not a
// real user directory. Good enough for an MVP demo; swap for per-account
// auth before this becomes the real admin tool.
export async function login(
	_prevState: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const username = formData.get("username");
	const password = formData.get("password");

	if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
		return { error: "Enter a username and password." };
	}

	const expectedUsername = process.env.DASHBOARD_USERNAME;
	const expectedPassword = process.env.DASHBOARD_PASSWORD;

	if (!expectedUsername || !expectedPassword) {
		return { error: "Dashboard login is not configured (missing DASHBOARD_USERNAME/DASHBOARD_PASSWORD)." };
	}

	if (username !== expectedUsername || password !== expectedPassword) {
		return { error: "Invalid username or password." };
	}

	await createSession(username);
	redirect("/");
}
