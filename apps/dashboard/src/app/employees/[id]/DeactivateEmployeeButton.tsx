"use client";

import { ConfirmButton } from "@/components/ConfirmButton";
import { deactivateEmployee } from "../actions";

/**
 * Replaces the old delete. Deactivating closes the record and returns whatever
 * the employee still holds to the company pool; nothing is destroyed, and the
 * history stays readable. The API requires an idempotency key here too.
 */
export function DeactivateEmployeeButton({
	employeeId,
	name,
	balance,
	idempotencyKey,
}: {
	employeeId: number;
	name: string;
	balance: number;
	idempotencyKey: string;
}) {
	return (
		<ConfirmButton
			action={deactivateEmployee.bind(null, employeeId)}
			label="Deactivate employee"
			title={`Deactivate ${name}?`}
			confirmLabel="Deactivate"
			pendingLabel="Deactivating…"
			description={
				<>
					<p>
						Their record is closed, not deleted — it stays readable, and so does everything that
						ever moved on their account.
					</p>
					{balance > 0 && (
						<p className="mt-2">
							Their remaining{" "}
							<span className="font-medium text-gray-900">{balance.toLocaleString()}</span> points
							return to the company pool.
						</p>
					)}
				</>
			}
		>
			<input type="hidden" name="idempotency_key" value={idempotencyKey} />
		</ConfirmButton>
	);
}
