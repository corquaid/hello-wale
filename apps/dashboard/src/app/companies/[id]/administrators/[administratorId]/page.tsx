import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany, getCompanyAdministrator } from "@/lib/operator";
import { ActivateAdministratorButton } from "./ActivateAdministratorButton";
import { DeactivateAdministratorButton } from "./DeactivateAdministratorButton";

export default async function OperatorAdministratorPage({
	params,
}: {
	params: Promise<{ id: string; administratorId: string }>;
}) {
	const { id, administratorId } = await params;
	const companyId = Number(id);
	const adminId = Number(administratorId);
	if (!Number.isInteger(companyId) || !Number.isInteger(adminId)) notFound();

	const [company, administrator] = await Promise.all([
		getCompany(companyId),
		getCompanyAdministrator(companyId, adminId),
	]);
	if (!company || !administrator) notFound();

	const isActive = administrator.status === "active";

	// Everything the API reports about an administrator. There is no route for
	// one on their own — only the company's list — so this is the whole record,
	// not a summary of a larger one.
	const details = [
		{ label: "Name", value: `${administrator.first_name} ${administrator.last_name}` },
		{ label: "Email", value: administrator.email },
		{ label: "Status", value: isActive ? "Active" : "Inactive" },
		{ label: "Administrator since", value: new Date(administrator.created_at).toLocaleString() },
		{ label: "Company", value: company.name },
	];

	return (
		<div className="space-y-8">
			<div className="flex items-start justify-between">
				<div>
					<Link href={`/companies/${companyId}`} className="text-sm text-gray-500 hover:underline">
						← {company.name}
					</Link>
					<h1 className="font-display mt-1 text-2xl font-semibold text-gray-900">
						{administrator.first_name} {administrator.last_name}
					</h1>
					<p className="text-sm text-gray-500">{administrator.email}</p>
					{!isActive && <p className="mt-1 text-sm text-gray-400">Inactive</p>}
				</div>
				{isActive ? (
					<DeactivateAdministratorButton
						companyId={companyId}
						administratorId={administrator.id}
						name={`${administrator.first_name} ${administrator.last_name}`}
					/>
				) : (
					<ActivateAdministratorButton
						companyId={companyId}
						administratorId={administrator.id}
						name={`${administrator.first_name} ${administrator.last_name}`}
					/>
				)}
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

			{!isActive && (
				<p className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
					This account is inactive. It can neither sign in nor go on using a session it already
					held, and its past actions stay attributed to it. Activating it restores the password it
					had.
				</p>
			)}
		</div>
	);
}
