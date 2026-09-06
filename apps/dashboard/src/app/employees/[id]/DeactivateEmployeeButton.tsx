"use client";

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
		<form
			action={deactivateEmployee.bind(null, employeeId)}
			onSubmit={(event) => {
				const returning =
					balance > 0
						? ` Their remaining ${balance.toLocaleString()} points return to the company pool.`
						: "";
				if (!confirm(`Deactivate ${name}?${returning}`)) {
					event.preventDefault();
				}
			}}
		>
			<input type="hidden" name="idempotency_key" value={idempotencyKey} />
			<button type="submit" className="text-sm text-red-600 hover:text-red-800">
				Deactivate employee
			</button>
		</form>
	);
}
