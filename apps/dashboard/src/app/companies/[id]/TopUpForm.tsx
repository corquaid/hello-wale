"use client";

import { useActionState } from "react";
import { topUpCompany } from "../actions";

/**
 * Bringing points into the pool is a point movement, so the API requires an
 * Idempotency-Key. The key comes from the server to stay stable across
 * hydration; on success this action redirects, so the page — and the key —
 * are replaced outright rather than needing to rotate in place.
 */
export function TopUpForm({
	companyId,
	initialIdempotencyKey,
}: {
	companyId: number;
	initialIdempotencyKey: string;
}) {
	const [state, formAction, pending] = useActionState(
		topUpCompany.bind(null, companyId),
		undefined,
	);

	return (
		<form action={formAction} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
			<input type="hidden" name="idempotency_key" value={initialIdempotencyKey} />

			<div className="space-y-1">
				<label htmlFor="points" className="block text-sm font-medium text-gray-700">
					Points to add
				</label>
				<input
					id="points"
					name="points"
					type="number"
					step="1"
					min="1"
					required
					className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
				/>
				<p className="text-xs text-gray-500">
					Brought in from outside the platform, into this company&rsquo;s pool.
				</p>
			</div>

			<div className="space-y-1">
				<label htmlFor="reason_note" className="block text-sm font-medium text-gray-700">
					Reason <span className="font-normal text-gray-400">(optional)</span>
				</label>
				<input
					id="reason_note"
					name="reason_note"
					placeholder="e.g. Q3 invoice settled"
					className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
				/>
			</div>

			{state?.error && <p className="text-sm text-red-600">{state.error}</p>}

			<button
				type="submit"
				disabled={pending}
				className="bg-wale-700 hover:bg-wale-800 rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
			>
				{pending ? "Adding…" : "Add to pool"}
			</button>
		</form>
	);
}
