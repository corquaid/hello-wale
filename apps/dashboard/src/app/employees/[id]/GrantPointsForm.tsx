"use client";

import { useActionState, useEffect, useRef } from "react";
import { grantPoints } from "../actions";

/**
 * The API requires an Idempotency-Key on every point movement, and the key
 * covers the request body: repeating one with the same body replays the first
 * answer, while reusing it with a different body is refused as a conflict.
 *
 * So the key belongs to a filled-in form, not to an attempt. It arrives from
 * the server (which keeps it stable across hydration) and is replaced only
 * after a grant succeeds — a double-submit collapses into one grant, and a
 * rejected submission can be corrected and sent again.
 */
export function GrantPointsForm({
	employeeId,
	initialIdempotencyKey,
	disabled,
}: {
	employeeId: number;
	initialIdempotencyKey: string;
	disabled?: boolean;
}) {
	const [state, formAction, pending] = useActionState(grantPoints, undefined);
	const formRef = useRef<HTMLFormElement>(null);

	// Derived, not stored: the action hands back the key the next submission
	// should carry, so there is nothing to synchronise. Until the first
	// response arrives, the server-rendered key stands — which is what makes a
	// double-submit reuse one key and collapse into a single grant.
	const idempotencyKey = state?.nextKey ?? initialIdempotencyKey;

	useEffect(() => {
		if (state && "ok" in state) formRef.current?.reset();
	}, [state]);

	if (disabled) {
		return (
			<p className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
				This employee is inactive, so points cannot be granted to them.
			</p>
		);
	}

	return (
		<form
			ref={formRef}
			action={formAction}
			className="space-y-4 rounded-lg border border-gray-200 bg-white p-6"
		>
			<input type="hidden" name="employee_id" value={employeeId} />
			<input type="hidden" name="idempotency_key" value={idempotencyKey} />

			<div className="space-y-1">
				<label htmlFor="points" className="block text-sm font-medium text-gray-700">
					Points to grant
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
					Comes out of the company pool. To take points back, correct the original transfer.
				</p>
			</div>

			<div className="space-y-1">
				<label htmlFor="reason_note" className="block text-sm font-medium text-gray-700">
					Reason <span className="font-normal text-gray-400">(optional)</span>
				</label>
				<input
					id="reason_note"
					name="reason_note"
					placeholder="e.g. Welcome bonus, Q3 recognition"
					className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
				/>
			</div>

			{state && "error" in state && <p className="text-sm text-red-600">{state.error}</p>}
			{state && "ok" in state && <p className="text-sm text-green-700">Points granted.</p>}

			<button
				type="submit"
				disabled={pending}
				className="bg-wale-700 hover:bg-wale-800 rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
			>
				{pending ? "Granting…" : "Grant points"}
			</button>
		</form>
	);
}
