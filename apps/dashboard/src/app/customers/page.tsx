import Link from "next/link";
import { getCustomers } from "@/lib/customers";

export default async function CustomersPage() {
	const customers = await getCustomers();

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-display text-2xl font-semibold text-gray-900">Customers</h1>
				<Link
					href="/customers/new"
					className="rounded-md bg-wale-700 px-3 py-2 text-sm font-medium text-white hover:bg-wale-800"
				>
					Add employee
				</Link>
			</div>

			{customers.length === 0 ? (
				<p className="text-sm text-gray-500">No customers yet.</p>
			) : (
				<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
					<table className="w-full text-left text-sm">
						<thead className="bg-gray-50 text-gray-500">
							<tr>
								<th className="px-4 py-3 font-medium">Name</th>
								<th className="px-4 py-3 font-medium">Email</th>
								<th className="px-4 py-3 font-medium">Points balance</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{customers.map((customer) => (
								<tr key={customer.customer_id} className="hover:bg-gray-50">
									<td className="px-4 py-3">
										<Link
											href={`/customers/${customer.customer_id}`}
											className="font-medium text-gray-900"
										>
											{customer.name}
										</Link>
									</td>
									<td className="px-4 py-3 text-gray-600">{customer.email}</td>
									<td className="px-4 py-3 text-gray-900">{customer.balance}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
