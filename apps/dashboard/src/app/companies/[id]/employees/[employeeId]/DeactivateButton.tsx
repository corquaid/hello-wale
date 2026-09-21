"use client";

import { ConfirmButton } from "@/components/ConfirmButton";
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
		<ConfirmButton
			action={deactivateCompanyEmployee.bind(null, companyId, employeeId)}
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
