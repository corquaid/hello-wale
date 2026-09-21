"use client";

import { ConfirmButton } from "@/components/ConfirmButton";
import { activateAdministrator } from "../../../actions";

/**
 * Reopens a closed account. The mirror of the deactivate button beside it,
 * and deliberately not styled as a destructive action.
 */
export function ActivateAdministratorButton({
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
			action={activateAdministrator.bind(null, companyId, administratorId)}
			label="Activate administrator"
			triggerClassName="hover:text-wale-700 text-sm text-gray-500"
			title={`Activate ${name}?`}
			confirmLabel="Activate"
			pendingLabel="Activating…"
			tone="primary"
			description={
				<p>
					They will be able to sign in again with the password they had. Nothing is reissued, and no
					email is sent.
				</p>
			}
		/>
	);
}
