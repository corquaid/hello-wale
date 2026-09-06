"use client";

import { useActionState } from "react";
import { createCompany } from "../actions";

export function NewCompanyForm() {
	const [state, formAction, pending] = useActionState(createCompany, undefined);

	return (
		<form action={formAction} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
			<div className="space-y-1">
				<label htmlFor="name" className="block text-sm font-medium text-gray-700">
					Name
				</label>
				<input
					id="name"
					name="name"
					required
					className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
				/>
			</div>

			<div className="space-y-1">
				<label htmlFor="status" className="block text-sm font-medium text-gray-700">
					Status
				</label>
				<select
					id="status"
					name="status"
					defaultValue="trial"
					className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
				>
					<option value="trial">Trial</option>
					<option value="active">Active</option>
					<option value="suspended">Suspended</option>
				</select>
			</div>

			<div className="space-y-1">
				<label
					htmlFor="point_conversion_rate_minor_units"
					className="block text-sm font-medium text-gray-700"
				>
					Conversion rate
				</label>
				<input
					id="point_conversion_rate_minor_units"
					name="point_conversion_rate_minor_units"
					type="number"
					step="1"
					min="1"
					defaultValue={100}
					required
					className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
				/>
				<p className="text-xs text-gray-500">
					Whole minor units of currency for one point — never a fraction.
				</p>
			</div>

			<div className="space-y-1">
				<label htmlFor="discount_limit_percent" className="block text-sm font-medium text-gray-700">
					Discount limit
				</label>
				<input
					id="discount_limit_percent"
					name="discount_limit_percent"
					type="number"
					step="1"
					min="0"
					max="100"
					defaultValue={20}
					required
					className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
				/>
			</div>

			{state?.error && <p className="text-sm text-red-600">{state.error}</p>}

			<button
				type="submit"
				disabled={pending}
				className="bg-wale-700 hover:bg-wale-800 rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
			>
				{pending ? "Creating…" : "Add company"}
			</button>
		</form>
	);
}
