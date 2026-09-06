"use client";

import { useActionState } from "react";
import { createCompanyEmployee } from "../../../actions";

export function NewCompanyEmployeeForm({ companyId }: { companyId: number }) {
	const [state, formAction, pending] = useActionState(
		createCompanyEmployee.bind(null, companyId),
		undefined,
	);

	return (
		<form action={formAction} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
			<div className="space-y-1">
				<label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
					First name
				</label>
				<input
					id="first_name"
					name="first_name"
					required
					className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
				/>
			</div>

			<div className="space-y-1">
				<label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
					Last name
				</label>
				<input
					id="last_name"
					name="last_name"
					required
					className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
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
					className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
				/>
				<p className="text-xs text-gray-500">
					Unique within this company, not across the platform.
				</p>
			</div>

			{state?.error && <p className="text-sm text-red-600">{state.error}</p>}

			<button
				type="submit"
				disabled={pending}
				className="bg-wale-700 hover:bg-wale-800 rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
			>
				{pending ? "Adding…" : "Add employee"}
			</button>
		</form>
	);
}
