"use client";

import { useActionState, useState } from "react";
import { adjustPoints } from "../actions";
import type { GrantState } from "../actions";

export interface CorrectableTransfer {
	transferId: number;
	/** Rendered on the server: lib/company is server-only. */
	label: string;
}

/**
 * Moves an employee's balance in either direction.
 *
 * The API has no negative grant — `points` on a grant must be at least 1 — so
 * taking points back is a *correction* against the transfer that handed them
 * over, and that transfer has to be named. Hence the picker, and hence a
 * negative amount cannot be submitted without one: it is the API's model
 * showing through, not a preference. The transfer being corrected is never
 * edited; the correction lands beside it in the history.
 *
 * The API requires an Idempotency-Key here and covers the body with it, so the
 * key belongs to a filled-in form rather than to an attempt. It arrives from
 * the server (stable across hydration) and is replaced only once a submission
 * has been answered — a double-submit collapses into one movement, while a
 * rejected one can be corrected and sent again.
 */
export function AdjustPointsForm({
	employeeId,
	transfers,
	initialIdempotencyKey,
	disabled,
}: {
	employeeId: number;
	transfers: CorrectableTransfer[];
	initialIdempotencyKey: string;
	disabled?: boolean;
}) {
	const [state, formAction, pending] = useActionState(adjustPoints, undefined);

	if (disabled) {
		return (
			<p className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
				This employee is inactive, so their points cannot be moved.
			</p>
		);
	}

	// Clearing the fields is a remount, not an effect: the key changes only once
	// a submission has been *accepted*, so a rejected one keeps what was typed
	// and can be fixed and sent again.
	return (
		<AdjustPointsFields
			key={state && "ok" in state ? state.nextKey : "pristine"}
			employeeId={employeeId}
			transfers={transfers}
			// Derived, not stored: the action hands back the key the next
			// submission should carry, so there is nothing to synchronise.
			idempotencyKey={state?.nextKey ?? initialIdempotencyKey}
			state={state}
			formAction={formAction}
			pending={pending}
		/>
	);
}

function AdjustPointsFields({
	employeeId,
	transfers,
	idempotencyKey,
	state,
	formAction,
	pending,
}: {
	employeeId: number;
	transfers: CorrectableTransfer[];
	idempotencyKey: string;
	state: GrantState;
	formAction: (formData: FormData) => void;
	pending: boolean;
}) {
	const [points, setPoints] = useState("");
	const [transferId, setTransferId] = useState("");

	const takingBack = Number(points) < 0;

	// Only a take-back corrects anything: anything else is a plain grant, which
	// names no transfer. Derived rather than cleared on change, so going back to
	// a negative amount restores whatever was picked before. A disabled select
	// is not submitted either way, so the action sees no transfer and grants.
	const selectedTransfer = takingBack ? transferId : "";

	// A correction always answers "why"; a plain grant need not.
	const reasonRequired = takingBack;

	const field =
		"focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none";

	return (
		<form action={formAction} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
			<input type="hidden" name="employee_id" value={employeeId} />
			<input type="hidden" name="idempotency_key" value={idempotencyKey} />

			<div className="space-y-1">
				<label htmlFor="points" className="block text-sm font-medium text-gray-700">
					Points
				</label>
				<input
					id="points"
					name="points"
					type="number"
					step="1"
					required
					value={points}
					onChange={(event) => setPoints(event.target.value)}
					placeholder="e.g. 250, or -250 to take points back"
					className={field}
				/>
				<p className="text-xs text-gray-500">
					A positive number comes out of the company pool. A negative one takes points back into it,
					which the API can only do as a correction to an earlier transfer.
				</p>
			</div>

			<div className="space-y-1">
				<label htmlFor="transfer_id" className="block text-sm font-medium text-gray-700">
					Correct an earlier transfer{" "}
					<span className="font-normal text-gray-400">
						{takingBack ? "(required)" : "(only applies when removing points)"}
					</span>
				</label>
				<select
					id="transfer_id"
					name="transfer_id"
					required={takingBack}
					disabled={!takingBack || transfers.length === 0}
					value={selectedTransfer}
					onChange={(event) => setTransferId(event.target.value)}
					className={`${field} bg-white disabled:bg-gray-50 disabled:text-gray-400`}
				>
					<option value="">
						{transfers.length === 0 ? "No earlier transfer to correct" : "Choose a transfer…"}
					</option>
					{transfers.map((transfer) => (
						<option key={transfer.transferId} value={transfer.transferId}>
							{transfer.label}
						</option>
					))}
				</select>
				{transfers.length === 0 && (
					<p className="text-xs text-gray-500">
						This employee has no points activity yet, so there is nothing to correct — only grants
						are possible.
					</p>
				)}
			</div>

			<div className="space-y-1">
				<label htmlFor="reason_note" className="block text-sm font-medium text-gray-700">
					Reason{" "}
					<span className="font-normal text-gray-400">
						{reasonRequired ? "(required)" : "(optional)"}
					</span>
				</label>
				<input
					id="reason_note"
					name="reason_note"
					required={reasonRequired}
					maxLength={500}
					placeholder={
						takingBack ? "e.g. Granted twice by mistake" : "e.g. Welcome bonus, Q3 recognition"
					}
					className={field}
				/>
			</div>

			{state && "error" in state && <p className="text-sm text-red-600">{state.error}</p>}
			{state && "ok" in state && <p className="text-sm text-green-700">Balance adjusted.</p>}

			<button
				type="submit"
				disabled={pending}
				className="bg-wale-700 hover:bg-wale-800 rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
			>
				{pending ? "Saving…" : takingBack ? "Remove points" : "Add points"}
			</button>
		</form>
	);
}
