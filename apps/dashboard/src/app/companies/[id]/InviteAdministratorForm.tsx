"use client";

import { useActionState } from "react";
import { inviteAdministrator } from "../actions";

export function InviteAdministratorForm({ companyId }: { companyId: number }) {
	const [state, formAction, pending] = useActionState(
		inviteAdministrator.bind(null, companyId),
		undefined,
	);

	return (
		<form
			action={formAction}
			className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-6"
		>
			<div className="grow space-y-1">
				<label htmlFor="email" className="block text-sm font-medium text-gray-700">
					Invite an administrator
				</label>
				<input id="email" name="email" type="email" required className="focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none" />
			</div>

			<button
				type="submit"
				disabled={pending}
				className="bg-wale-700 hover:bg-wale-800 rounded-md px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
			>
				{pending ? "Sending…" : "Send invitation"}
			</button>

			{state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
		</form>
	);
}
