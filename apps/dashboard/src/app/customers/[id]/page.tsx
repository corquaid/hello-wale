import { notFound } from "next/navigation";
import { getCustomer, getTransactions } from "@/lib/customers";
import { AssignPointsForm } from "./AssignPointsForm";
import { DeleteCustomerButton } from "./DeleteCustomerButton";

export default async function CustomerDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const customer = await getCustomer(id);

	if (!customer) {
		notFound();
	}

	const transactions = await getTransactions(id);

	return (
		<div className="space-y-8">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="font-display text-2xl font-semibold text-gray-900">{customer.name}</h1>
					<p className="text-sm text-gray-500">{customer.email}</p>
				</div>
				<DeleteCustomerButton customerId={customer.customer_id} name={customer.name} />
			</div>

			<div className="rounded-lg border border-gray-200 bg-white p-6">
				<p className="text-sm text-gray-500">Points balance</p>
				<p className="text-3xl font-semibold text-gray-900">{customer.balance}</p>
			</div>

			<div>
				<h2 className="mb-3 font-display text-lg font-medium text-gray-900">Points adjustment</h2>
				<AssignPointsForm customerId={customer.customer_id} />
			</div>

			<div>
				<h2 className="mb-3 font-display text-lg font-medium text-gray-900">History</h2>
				{transactions.length === 0 ? (
					<p className="text-sm text-gray-500">No points activity yet.</p>
				) : (
					<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
						<table className="w-full text-left text-sm">
							<thead className="bg-gray-50 text-gray-500">
								<tr>
									<th className="px-4 py-3 font-medium">Date</th>
									<th className="px-4 py-3 font-medium">Change</th>
									<th className="px-4 py-3 font-medium">Reason</th>
									<th className="px-4 py-3 font-medium">By</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{transactions.map((tx) => (
									<tr key={tx.id}>
										<td className="px-4 py-3 text-gray-500">
											{new Date(tx.created_at).toLocaleString()}
										</td>
										<td
											className={`px-4 py-3 font-medium ${tx.delta > 0 ? "text-green-600" : "text-red-600"}`}
										>
											{tx.delta > 0 ? `+${tx.delta}` : tx.delta}
										</td>
										<td className="px-4 py-3 text-gray-700">{tx.reason}</td>
										<td className="px-4 py-3 text-gray-500">{tx.created_by ?? "—"}</td>
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
