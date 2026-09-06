import Link from "next/link";
import { DashboardChrome } from "@/components/DashboardChrome";
import { PointsActivityChart } from "@/components/PointsActivityChart";
import { requireUser } from "@/lib/auth";
import { getCompanyReport, getPointsActivityByDay } from "@/lib/company";
import { getCompanies, OPERATOR_CANNOT } from "@/lib/operator";

export default async function HomePage({
	searchParams,
}: {
	searchParams: Promise<{ from?: string; to?: string }>;
}) {
	// The API is split into two route spaces that share no endpoints: a
	// platform operator cannot read /company/* at all. So the landing page has
	// to branch before it fetches anything.
	const user = await requireUser();

	return (
		<DashboardChrome>
			{user.role === "platform_operator" ? (
				<OperatorHome />
			) : (
				<CompanyHome searchParams={searchParams} />
			)}
		</DashboardChrome>
	);
}

async function CompanyHome({
	searchParams,
}: {
	searchParams: Promise<{ from?: string; to?: string }>;
}) {
	const { from = "", to = "" } = await searchParams;

	const [report, activity] = await Promise.all([
		getCompanyReport(),
		getPointsActivityByDay({ from: from || undefined, to: to || undefined }),
	]);

	const statCards = [
		{ label: "Pool balance", value: report.pool_balance.toLocaleString() },
		{ label: "Held by employees", value: report.points_held_by_employees.toLocaleString() },
		{ label: "Granted (all time)", value: `+${report.points_granted_total.toLocaleString()}` },
		{ label: "Returned (all time)", value: `-${report.points_returned_total.toLocaleString()}` },
	];

	return (
		<div className="space-y-8">
			<h1 className="font-display text-2xl font-semibold text-gray-900">Dashboard</h1>

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{statCards.map((card) => (
					<div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4">
						<p className="text-sm text-gray-500">{card.label}</p>
						<p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
					</div>
				))}
			</div>

			<p className="text-sm text-gray-500">
				{report.active_employees.toLocaleString()} active
				{report.inactive_employees > 0 &&
					`, ${report.inactive_employees.toLocaleString()} inactive`}{" "}
				· <Link href="/employees" className="text-wale-700 hover:underline">View employees</Link>
			</p>

			<form className="flex flex-wrap items-end gap-3">
				<div className="space-y-1">
					<label htmlFor="from" className="block text-xs font-medium text-gray-700">
						From
					</label>
					<input
						id="from"
						name="from"
						type="date"
						defaultValue={from}
						className="focus:border-wale-700 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:outline-none"
					/>
				</div>
				<div className="space-y-1">
					<label htmlFor="to" className="block text-xs font-medium text-gray-700">
						To
					</label>
					<input
						id="to"
						name="to"
						type="date"
						defaultValue={to}
						className="focus:border-wale-700 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:outline-none"
					/>
				</div>
				<button
					type="submit"
					className="bg-wale-700 hover:bg-wale-800 rounded-md px-4 py-1.5 text-sm font-medium text-white"
				>
					Filter
				</button>
				{(from || to) && (
					<Link
						href="/"
						className="hover:text-wale-700 px-2 py-1.5 text-sm font-medium text-gray-500"
					>
						Reset
					</Link>
				)}
			</form>

			<div className="rounded-lg border border-gray-200 bg-white p-6">
				<h2 className="font-display mb-4 text-lg font-medium text-gray-900">Points activity</h2>
				<PointsActivityChart data={activity} />
			</div>
		</div>
	);
}

async function OperatorHome() {
	const companies = await getCompanies();

	const totals = companies.reduce(
		(acc, company) => {
			acc[company.status] = (acc[company.status] ?? 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	return (
		<div className="space-y-8">
			<div>
				<h1 className="font-display text-2xl font-semibold text-gray-900">Platform</h1>
				<p className="text-sm text-gray-500">
					Signed in as a platform operator. {OPERATOR_CANNOT}
				</p>
			</div>

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{[
					{ label: "Companies", value: companies.length },
					{ label: "Active", value: totals.active ?? 0 },
					{ label: "Trial", value: totals.trial ?? 0 },
					{ label: "Suspended", value: totals.suspended ?? 0 },
				].map((card) => (
					<div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4">
						<p className="text-sm text-gray-500">{card.label}</p>
						<p className="mt-1 text-2xl font-semibold text-gray-900">
							{card.value.toLocaleString()}
						</p>
					</div>
				))}
			</div>

			<div>
				<div className="mb-3 flex items-center justify-between">
					<h2 className="font-display text-lg font-medium text-gray-900">Companies</h2>
					<Link href="/companies" className="text-wale-700 text-sm font-medium hover:underline">
						Manage companies
					</Link>
				</div>

				{companies.length === 0 ? (
					<p className="text-sm text-gray-500">No companies on the platform yet.</p>
				) : (
					<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
						<table className="w-full text-left text-sm">
							<thead className="bg-gray-50 text-gray-500">
								<tr>
									<th className="px-4 py-3 font-medium">Name</th>
									<th className="px-4 py-3 font-medium">Status</th>
									<th className="px-4 py-3 font-medium">Rate</th>
									<th className="px-4 py-3 font-medium">Discount limit</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{companies.map((company) => (
									<tr key={company.id} className="hover:bg-gray-50">
										<td className="px-4 py-3">
											<Link
												href={`/companies/${company.id}`}
												className="font-medium text-gray-900"
											>
												{company.name}
											</Link>
										</td>
										<td className="px-4 py-3 text-gray-600 capitalize">{company.status}</td>
										<td className="px-4 py-3 text-gray-900">
											{company.point_conversion_rate_minor_units}
										</td>
										<td className="px-4 py-3 text-gray-900">
											{company.discount_limit_percent}%
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
