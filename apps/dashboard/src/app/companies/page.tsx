import Link from "next/link";
import { getCompanies } from "@/lib/operator";

const STATUS_STYLES: Record<string, string> = {
	active: "text-gray-900",
	trial: "text-amber-700",
	suspended: "text-red-600",
};

export default async function CompaniesPage() {
	const companies = await getCompanies();

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-display text-2xl font-semibold text-gray-900">Companies</h1>
				<Link
					href="/companies/new"
					className="bg-wale-700 hover:bg-wale-800 rounded-md px-3 py-2 text-sm font-medium text-white"
				>
					Add company
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
									<td
										className={`px-4 py-3 capitalize ${STATUS_STYLES[company.status] ?? "text-gray-600"}`}
									>
										{company.status}
									</td>
									<td className="px-4 py-3 text-gray-900">
										{company.point_conversion_rate_minor_units}
										<span className="text-gray-400"> minor units / point</span>
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
	);
}
