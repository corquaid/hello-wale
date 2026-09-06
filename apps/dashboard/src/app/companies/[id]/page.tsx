import Link from "next/link";
import { notFound } from "next/navigation";
import {
	getCompany,
	getCompanyEmployees,
	getCompanyReport,
	getInvitations,
	OPERATOR_CANNOT,
} from "@/lib/operator";
import { InviteAdministratorForm } from "./InviteAdministratorForm";
import { TopUpForm } from "./TopUpForm";

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const companyId = Number(id);
	if (!Number.isInteger(companyId) || companyId <= 0) notFound();

	const company = await getCompany(companyId);
	if (!company) notFound();

	const [report, employees, invitations] = await Promise.all([
		getCompanyReport(companyId),
		getCompanyEmployees(companyId),
		getInvitations(companyId),
	]);

	const statCards = [
		{ label: "Pool balance", value: report.pool_balance.toLocaleString() },
		{ label: "Held by employees", value: report.points_held_by_employees.toLocaleString() },
		{ label: "Granted (all time)", value: `+${report.points_granted_total.toLocaleString()}` },
		{ label: "Returned (all time)", value: `-${report.points_returned_total.toLocaleString()}` },
	];

	return (
		<div className="space-y-8">
			<div className="flex items-start justify-between">
				<div>
					<Link href="/companies" className="text-sm text-gray-500 hover:underline">
						← Companies
					</Link>
					<h1 className="font-display mt-1 text-2xl font-semibold text-gray-900">
						{company.name}
					</h1>
					<p className="text-sm text-gray-500 capitalize">
						{company.status} · {company.point_conversion_rate_minor_units} minor units per
						point · {company.discount_limit_percent}% discount limit
					</p>
				</div>
				<div className="flex gap-4">
					<Link
						href={`/companies/${companyId}/settings`}
						className="hover:text-wale-700 text-sm text-gray-500"
					>
						Settings
					</Link>
					<Link
						href={`/companies/${companyId}/audit-logs`}
						className="hover:text-wale-700 text-sm text-gray-500"
					>
						Audit log
					</Link>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{statCards.map((card) => (
					<div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4">
						<p className="text-sm text-gray-500">{card.label}</p>
						<p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
					</div>
				))}
			</div>

			<div>
				<h2 className="font-display mb-3 text-lg font-medium text-gray-900">Fund the pool</h2>
				<TopUpForm companyId={companyId} initialIdempotencyKey={crypto.randomUUID()} />
			</div>

			<div>
				<div className="mb-3 flex items-center justify-between">
					<h2 className="font-display text-lg font-medium text-gray-900">Employees</h2>
					<Link
						href={`/companies/${companyId}/employees/new`}
						className="text-wale-700 text-sm font-medium hover:underline"
					>
						Add employee
					</Link>
				</div>

				{employees.length === 0 ? (
					<p className="text-sm text-gray-500">No employees yet.</p>
				) : (
					<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
						<table className="w-full text-left text-sm">
							<thead className="bg-gray-50 text-gray-500">
								<tr>
									<th className="px-4 py-3 font-medium">Name</th>
									<th className="px-4 py-3 font-medium">Email</th>
									<th className="px-4 py-3 font-medium">Status</th>
									<th className="px-4 py-3 font-medium">Points balance</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{employees.map((employee) => (
									<tr key={employee.id} className="hover:bg-gray-50">
										<td className="px-4 py-3">
											<Link
												href={`/companies/${companyId}/employees/${employee.id}`}
												className="font-medium text-gray-900"
											>
												{employee.first_name} {employee.last_name}
											</Link>
										</td>
										<td className="px-4 py-3 text-gray-600">{employee.email}</td>
										<td className="px-4 py-3">
											{employee.status === "active" ? (
												<span className="text-gray-600">Active</span>
											) : (
												<span className="text-gray-400">Inactive</span>
											)}
										</td>
										<td className="px-4 py-3 text-gray-900">
											{employee.points_balance.toLocaleString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<p className="mt-3 text-xs text-gray-500">{OPERATOR_CANNOT}</p>
			</div>

			<div>
				<h2 className="font-display mb-3 text-lg font-medium text-gray-900">Administrators</h2>

				{invitations.length === 0 ? (
					<p className="mb-4 text-sm text-gray-500">No invitations sent yet.</p>
				) : (
					<div className="mb-4 overflow-x-auto rounded-lg border border-gray-200 bg-white">
						<table className="w-full text-left text-sm">
							<thead className="bg-gray-50 text-gray-500">
								<tr>
									<th className="px-4 py-3 font-medium">Email</th>
									<th className="px-4 py-3 font-medium">Sent</th>
									<th className="px-4 py-3 font-medium">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{invitations.map((invitation) => (
									<tr key={invitation.id}>
										<td className="px-4 py-3 text-gray-900">{invitation.email}</td>
										<td className="px-4 py-3 whitespace-nowrap text-gray-500">
											{new Date(invitation.created_at).toLocaleDateString()}
										</td>
										<td className="px-4 py-3 text-gray-600">
											{invitation.accepted_at
												? `Accepted ${new Date(invitation.accepted_at).toLocaleDateString()}`
												: new Date(invitation.expires_at) < new Date()
													? "Expired"
													: `Pending until ${new Date(invitation.expires_at).toLocaleDateString()}`}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<InviteAdministratorForm companyId={companyId} />
			</div>
		</div>
	);
}
