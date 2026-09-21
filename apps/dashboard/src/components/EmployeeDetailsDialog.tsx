"use client";

import { ConfirmButton, type ConfirmState } from "@/components/ConfirmButton";

const field =
	"focus:border-wale-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none";

export interface EmployeeDetails {
	first_name: string;
	last_name: string;
	email: string;
}

/**
 * Corrects an employee's name or email.
 *
 * A dialog rather than a panel on the page: this is a repair, not part of the
 * daily work, and its trigger belongs beside the other thing one does *to* a
 * record rather than with it. The fields speak for themselves, so the dialog
 * carries no explanatory copy.
 *
 * Shared by both route spaces — a company administrator and a platform
 * operator edit the same record through different endpoints, so only the
 * bound action differs.
 *
 * Success is silent by design. The action revalidates, so the corrected name
 * appears in the heading behind the closing dialog, which says more than a
 * line of green text would.
 */
export function EmployeeDetailsDialog({
	action,
	employee,
}: {
	action: (prevState: ConfirmState, formData: FormData) => Promise<ConfirmState>;
	employee: EmployeeDetails;
}) {
	return (
		<ConfirmButton
			action={action}
			label="Edit details"
			triggerClassName="hover:text-wale-700 text-sm text-gray-500"
			title="Edit details"
			confirmLabel="Save details"
			pendingLabel="Saving…"
			tone="primary"
			fields={
				<>
					<div className="space-y-1">
						<label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
							First name
						</label>
						<input
							id="first_name"
							name="first_name"
							defaultValue={employee.first_name}
							maxLength={255}
							required
							className={field}
						/>
					</div>

					<div className="space-y-1">
						<label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
							Last name
						</label>
						<input
							id="last_name"
							name="last_name"
							defaultValue={employee.last_name}
							maxLength={255}
							required
							className={field}
						/>
					</div>

					<div className="space-y-1">
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							defaultValue={employee.email}
							maxLength={255}
							required
							className={field}
						/>
						<p className="text-xs text-gray-500">
							Unique within this company — the same person may work for two of them.
						</p>
					</div>
				</>
			}
		/>
	);
}
