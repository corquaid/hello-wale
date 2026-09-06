"use client";

import { deactivateCompanyEmployee } from "../../../actions";

export function DeactivateButton({
	companyId,
	employeeId,
	name,
	balance,
	idempotencyKey,
}: {
	companyId: number;
	employeeId: number;
	name: string;
	balance: number;
	idempotencyKey: string;
}) {
	return (
		<form
			action={deactivateCompanyEmployee.bind(null, companyId, employeeId)}
			onSubmit={(event) => {
				const returning =
					balance > 0
						? ` Their remaining ${balance.toLocaleString()} points return to the company pool.`
						: "";
				if (!confirm(`Deactivate ${name}?${returning}`)) event.preventDefault();
			}}
		>
			<input type="hidden" name="idempotency_key" value={idempotencyKey} />
			<button type="submit" className="text-sm text-red-600 hover:text-red-800">
				Deactivate employee
			</button>
		</form>
	);
}
