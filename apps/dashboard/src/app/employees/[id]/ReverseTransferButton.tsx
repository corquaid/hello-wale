"use client";

import { ConfirmButton } from "@/components/ConfirmButton";
import { reverseTransfer } from "../actions";

/**
 * Undoes the whole transfer behind one history row.
 *
 * A group grant reaches many employees, and reversing it here undoes it for
 * all of them. The API exposes no route that reads a transfer, so the dialog
 * cannot name the others — it says plainly that they exist instead of implying
 * this affects one person.
 */
export function ReverseTransferButton({
	transferId,
	employeeId,
	amount,
	reasonLabel,
	isGroupGrant,
	idempotencyKey,
}: {
	transferId: number;
	employeeId: number;
	amount: number;
	reasonLabel: string;
	isGroupGrant: boolean;
	idempotencyKey: string;
}) {
	return (
		<ConfirmButton
			action={reverseTransfer.bind(null, transferId, employeeId)}
			label="Reverse"
			triggerClassName="text-sm text-red-600 hover:text-red-800"
			title={`Reverse this ${reasonLabel.toLowerCase()}?`}
			confirmLabel="Reverse it"
			pendingLabel="Reversing…"
			description={
				<>
					{isGroupGrant ? (
						<p className="font-medium text-red-600">
							This was a group grant. Reversing it undoes it for <em>every</em> employee who
							received points in it, not only this one.
						</p>
					) : (
						<p>
							This returns the {Math.abs(amount).toLocaleString()} points it moved, putting the
							balance back where it was.
						</p>
					)}
					<p className="mt-2">
						The original is not edited — the reversal is recorded beside it, and both stay in the
						history.
					</p>
				</>
			}
			fields={
				<div className="space-y-1">
					<label
						htmlFor={`reversal_reason_${transferId}`}
						className="block text-sm font-medium text-gray-700"
					>
						Reason
					</label>
					<input
						id={`reversal_reason_${transferId}`}
						name="reason_note"
						required
						maxLength={500}
						placeholder="e.g. Granted to the wrong team"
						className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none"
					/>
				</div>
			}
		>
			<input type="hidden" name="idempotency_key" value={idempotencyKey} />
		</ConfirmButton>
	);
}
