"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import logo from "@/assets/logo.png";
import { acceptInvitation } from "./actions";

export function AcceptInvitationForm({ token }: { token: string }) {
	const [state, formAction, pending] = useActionState(
		acceptInvitation.bind(null, token),
		undefined,
	);

	const field =
		"focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none";

	return (
		<div className="bg-wale-50 flex min-h-screen items-center justify-center px-4">
			<form
				action={formAction}
				className="w-full max-w-sm space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
			>
				<Image src={logo} alt="HelloWale" className="h-7 w-auto" priority />

				<div>
					<h1 className="font-display text-lg font-medium text-gray-900">Accept your invitation</h1>
					<p className="mt-1 text-sm text-gray-500">
						Set your name and a password to finish setting up your administrator account.
					</p>
				</div>

				<div className="space-y-4">
					<div className="space-y-1">
						<label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
							First name
						</label>
						<input
							id="first_name"
							name="first_name"
							autoComplete="given-name"
							maxLength={255}
							required
							className={field}
						/>
					</div>

					<div className="space-y-1">
						<label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
							Last name
						</label>
						<input
							id="last_name"
							name="last_name"
							autoComplete="family-name"
							maxLength={255}
							required
							className={field}
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
							autoComplete="new-password"
							required
							className={field}
						/>
					</div>

					<div className="space-y-1">
						<label
							htmlFor="password_confirmation"
							className="block text-sm font-medium text-gray-700"
						>
							Confirm password
						</label>
						<input
							id="password_confirmation"
							name="password_confirmation"
							type="password"
							autoComplete="new-password"
							required
							className={field}
						/>
					</div>
				</div>

				{state?.error && <p className="text-sm text-red-600">{state.error}</p>}

				<button
					type="submit"
					disabled={pending}
					className="bg-wale-700 hover:bg-wale-800 w-full rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
				>
					{pending ? "Setting up…" : "Accept invitation"}
				</button>

				{/* An invitation is single use, so somebody arriving on a spent link
				    needs somewhere to go other than back into this form. */}
				<p className="text-center text-sm text-gray-500">
					Already have an account?{" "}
					<Link href="/login" className="text-wale-700 hover:underline">
						Sign in
					</Link>
				</p>
			</form>
		</div>
	);
}
