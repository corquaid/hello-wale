import { requireUser } from "@/lib/auth";
import type { Role } from "@/lib/api/types";

const ROLE_LABELS: Record<Role, string> = {
	platform_operator: "Platform operator",
	company_administrator: "Company administrator",
};

/**
 * Read-only by necessity as much as by choice: the API has no route that
 * changes an account. /auth/me is the whole of it — there is no profile
 * update and no password change to offer.
 */
export default async function AccountPage() {
	const user = await requireUser();

	const details: Array<{ label: string; value: string }> = [
		{ label: "Name", value: `${user.first_name} ${user.last_name}` },
		{ label: "Email", value: user.email },
		{ label: "Role", value: ROLE_LABELS[user.role] ?? user.role },
	];

	// Only a company administrator has one, and only when the API names it.
	if (user.company) details.push({ label: "Company", value: user.company.name });

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-display text-2xl font-semibold text-gray-900">Account</h1>
				<p className="text-sm text-gray-500">Who you are signed in as.</p>
			</div>

			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
				<table className="w-full text-left text-sm">
					<tbody className="divide-y divide-gray-100">
						{details.map((detail) => (
							<tr key={detail.label}>
								<th scope="row" className="w-56 px-4 py-3 font-medium text-gray-500">
									{detail.label}
								</th>
								<td className="px-4 py-3 text-gray-900">{detail.value}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<p className="text-sm text-gray-500">
				These details cannot be changed here — the API exposes no route for editing an account or
				its password. Ask a platform operator if something is wrong.
			</p>
		</div>
	);
}
