"use client";

import Image from "next/image";
import { useActionState } from "react";
import logo from "@/assets/logo.png";
import { login } from "./actions";

export default function LoginPage() {
	const [state, formAction, pending] = useActionState(login, undefined);

	return (
		<div className="bg-wale-50 flex min-h-screen items-center justify-center px-4">
			<form
				action={formAction}
				className="w-full max-w-sm space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
			>
				<Image src={logo} alt="HelloWale" className="h-7 w-auto" priority />

				<div className="space-y-4">
					<div className="space-y-1">
						<label htmlFor="username" className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							id="username"
							name="username"
							type="text"
							autoComplete="username"
							required
							className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
						/>
					</div>

					<div className="space-y-1">
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
						/>
					</div>
				</div>

				{state?.error && <p className="text-sm text-red-600">{state.error}</p>}

				<button
					type="submit"
					disabled={pending}
					className="bg-wale-700 hover:bg-wale-800 w-full rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
				>
					{pending ? "Signing in…" : "Sign in"}
				</button>
			</form>
		</div>
	);
}
