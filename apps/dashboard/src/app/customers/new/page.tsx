"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createCustomer } from "../actions";

export default function NewCustomerPage() {
	const [state, formAction, pending] = useActionState(createCustomer, undefined);

	return (
		<div className="max-w-md space-y-6">
			<h1 className="text-2xl font-semibold text-gray-900">Add employee</h1>

			<form action={formAction} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
				<div className="space-y-1">
					<label htmlFor="name" className="block text-sm font-medium text-gray-700">
						Name
					</label>
					<input
						id="name"
						name="name"
						required
						className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-wale-700 focus:outline-none"
					/>
				</div>

				<div className="space-y-1">
					<label htmlFor="email" className="block text-sm font-medium text-gray-700">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-wale-700 focus:outline-none"
					/>
				</div>

				{state?.error && <p className="text-sm text-red-600">{state.error}</p>}

				<div className="flex items-center gap-3">
					<button
						type="submit"
						disabled={pending}
						className="rounded-md bg-wale-700 px-3 py-2 text-sm font-medium text-white hover:bg-wale-800 disabled:opacity-50"
					>
						{pending ? "Creating…" : "Create employee"}
					</button>
					<Link href="/customers" className="text-sm text-gray-500 hover:text-wale-700">
						Cancel
					</Link>
				</div>
			</form>
		</div>
	);
}
