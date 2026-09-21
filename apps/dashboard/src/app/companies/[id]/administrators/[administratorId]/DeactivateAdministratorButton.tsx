"use client";

import { ConfirmButton } from "@/components/ConfirmButton";
import { deactivateAdministrator } from "../../../actions";

/**
 * Closes an administrator's account. Nothing is destroyed: the row stays so
 * that what the account did remains attributed to it, and the API can activate
 * it again.
 *
 * No idempotency key, unlike the employee equivalent — see the action.
 */
export function DeactivateAdministratorButton({
	companyId,
	administratorId,
	name,
}: {
	companyId: number;
	administratorId: number;
	name: string;
}) {
	return (
		<ConfirmButton
			action={deactivateAdministrator.bind(null, companyId, administratorId)}
			label="Deactivate administrator"
			title={`Deactivate ${name}?`}
			confirmLabel="Deactivate"
			pendingLabel="Deactivating…"
			description={
				<p>
					They will not be able to sign in, or go on using a session they already hold. The account
					is kept so that everything it did stays attributed to it, and it can be activated again.
				</p>
			}
		/>
	);
}
