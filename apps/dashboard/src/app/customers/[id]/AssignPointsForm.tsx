"use client";

import { useActionState } from "react";
import { assignPoints } from "../actions";

export function AssignPointsForm({ customerId }: { customerId: string }) {
	const [state, formAction, pending] = useActionState(assignPoints, undefined);

	return (
		<form action={formAction} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
			<input type="hidden" name="customerId" value={customerId} />

			<div className="space-y-1">
				<label htmlFor="delta" className="block text-sm font-medium text-gray-700">
					Points (use a minus sign to deduct, e.g. -50)
				</label>
				<input
					id="delta"
					name="delta"
					type="number"
					step="1"
					required
					className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-wale-700 focus:outline-none"
				/>
			</div>

			<div className="space-y-1">
				<label htmlFor="reason" className="block text-sm font-medium text-gray-700">
					Reason
				</label>
				<input
					id="reason"
					name="reason"
					required
					placeholder="e.g. Welcome bonus, order #1234 redemption"
					className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-wale-700 focus:outline-none"
				/>
			</div>

			{state?.error && <p className="text-sm text-red-600">{state.error}</p>}

			<button
				type="submit"
				disabled={pending}
				className="rounded-md bg-wale-700 px-3 py-2 text-sm font-medium text-white hover:bg-wale-800 disabled:opacity-50"
			>
				{pending ? "Saving…" : "Assign points"}
			</button>
		</form>
	);
}
