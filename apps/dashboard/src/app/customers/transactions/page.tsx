import Link from "next/link";
import { getAllTransactions } from "@/lib/customers";

export default async function TransactionsPage({
	searchParams,
}: {
	searchParams: Promise<{ name?: string; type?: string; from?: string; to?: string }>;
}) {
	const { name = "", type = "", from = "", to = "" } = await searchParams;

	const transactions = await getAllTransactions({
		customerName: name || undefined,
		type: type === "credit" || type === "debit" ? type : undefined,
		from: from || undefined,
		to: to || undefined,
	});

	const hasFilters = name || type || from || to;

	return (
		<div className="space-y-6">
			<h1 className="font-display text-2xl font-semibold text-gray-900">Transactions</h1>

			<form className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
				<div className="space-y-1">
					<label htmlFor="name" className="block text-sm font-medium text-gray-700">
						Employee name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						defaultValue={name}
						placeholder="Search by name"
						className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-wale-700 focus:outline-none"
					/>
				</div>
				<div className="space-y-1">
					<label htmlFor="from" className="block text-sm font-medium text-gray-700">
						From
					</label>
					<input
						id="from"
						name="from"
						type="date"
						defaultValue={from}
						className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-wale-700 focus:outline-none"
					/>
				</div>
				<div className="space-y-1">
					<label htmlFor="to" className="block text-sm font-medium text-gray-700">
						To
					</label>
					<input
						id="to"
						name="to"
						type="date"
						defaultValue={to}
						className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-wale-700 focus:outline-none"
					/>
				</div>
				<div className="space-y-1">
					<label htmlFor="type" className="block text-sm font-medium text-gray-700">
						Type
					</label>
					<select
						id="type"
						name="type"
						defaultValue={type}
						className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-wale-700 focus:outline-none"
					>
						<option value="">All</option>
						<option value="credit">Credit</option>
						<option value="debit">Debit</option>
					</select>
				</div>
				<div className="flex gap-3">
					<button
						type="submit"
						className="rounded-md bg-wale-700 px-4 py-2 text-sm font-medium text-white hover:bg-wale-800"
					>
						Filter
					</button>
					{hasFilters && (
						<Link
							href="/customers/transactions"
							className="rounded-md px-4 py-2 text-sm font-medium text-gray-500 hover:text-wale-700"
						>
							Clear
						</Link>
					)}
				</div>
			</form>

			{transactions.length === 0 ? (
				<p className="text-sm text-gray-500">No transactions match those filters.</p>
			) : (
				<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
					<table className="w-full text-left text-sm">
						<thead className="bg-gray-50 text-gray-500">
							<tr>
								<th className="px-4 py-3 font-medium">Date</th>
								<th className="px-4 py-3 font-medium">Employee</th>
								<th className="px-4 py-3 font-medium">Change</th>
								<th className="px-4 py-3 font-medium">Reason</th>
								<th className="px-4 py-3 font-medium">By</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{transactions.map((tx) => (
								<tr key={tx.id} className="hover:bg-gray-50">
									<td className="px-4 py-3 text-gray-500">
										{new Date(tx.created_at).toLocaleString()}
									</td>
									<td className="px-4 py-3">
										<Link
											href={`/customers/${tx.customer_id}`}
											className="font-medium text-gray-900"
										>
											{tx.customer_name}
										</Link>
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
	);
}
