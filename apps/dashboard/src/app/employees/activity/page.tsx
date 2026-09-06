import Link from "next/link";
import { getCompanyActivity, REASON_LABELS } from "@/lib/company";

export default async function ActivityPage({
	searchParams,
}: {
	searchParams: Promise<{ name?: string; type?: string; from?: string; to?: string }>;
}) {
	const { name = "", type = "", from = "", to = "" } = await searchParams;

	// Filtered here rather than upstream: the API exposes point history per
	// employee only, so this page already holds the whole set in memory. See
	// getCompanyActivity for why, and what would replace it.
	const activity = (await getCompanyActivity()).filter((entry) => {
		if (name && !entry.employee_name.toLowerCase().includes(name.toLowerCase())) return false;
		if (type === "credit" && entry.amount <= 0) return false;
		if (type === "debit" && entry.amount >= 0) return false;
		const date = entry.created_at.slice(0, 10);
		if (from && date < from) return false;
		if (to && date > to) return false;
		return true;
	});

	const hasFilters = name || type || from || to;
	const field =
		"focus:border-wale-700 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none";

	return (
		<div className="space-y-6">
			<h1 className="font-display text-2xl font-semibold text-gray-900">Points activity</h1>

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
						className={field}
					/>
				</div>
				<div className="space-y-1">
					<label htmlFor="from" className="block text-sm font-medium text-gray-700">
						From
					</label>
					<input id="from" name="from" type="date" defaultValue={from} className={field} />
				</div>
				<div className="space-y-1">
					<label htmlFor="to" className="block text-sm font-medium text-gray-700">
						To
					</label>
					<input id="to" name="to" type="date" defaultValue={to} className={field} />
				</div>
				<div className="space-y-1">
					<label htmlFor="type" className="block text-sm font-medium text-gray-700">
						Type
					</label>
					<select id="type" name="type" defaultValue={type} className={field}>
						<option value="">All</option>
						<option value="credit">Credit</option>
						<option value="debit">Debit</option>
					</select>
				</div>
				<div className="flex gap-3">
					<button
						type="submit"
						className="bg-wale-700 hover:bg-wale-800 rounded-md px-4 py-2 text-sm font-medium text-white"
					>
						Filter
					</button>
					{hasFilters && (
						<Link
							href="/employees/activity"
							className="hover:text-wale-700 rounded-md px-4 py-2 text-sm font-medium text-gray-500"
						>
							Clear
						</Link>
					)}
				</div>
			</form>

			{activity.length === 0 ? (
				<p className="text-sm text-gray-500">No points activity matches those filters.</p>
			) : (
				<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
					<table className="w-full text-left text-sm">
						<thead className="bg-gray-50 text-gray-500">
							<tr>
								<th className="px-4 py-3 font-medium">Date</th>
								<th className="px-4 py-3 font-medium">Employee</th>
								<th className="px-4 py-3 font-medium">Change</th>
								<th className="px-4 py-3 font-medium">Balance after</th>
								<th className="px-4 py-3 font-medium">Reason</th>
								<th className="px-4 py-3 font-medium">Note</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{activity.map((entry) => (
								<tr key={`${entry.employee_id}-${entry.id}`} className="hover:bg-gray-50">
									<td className="px-4 py-3 whitespace-nowrap text-gray-500">
										{new Date(entry.created_at).toLocaleString()}
									</td>
									<td className="px-4 py-3">
										<Link
											href={`/employees/${entry.employee_id}`}
											className="font-medium text-gray-900"
										>
											{entry.employee_name}
										</Link>
									</td>
									<td
										className={`px-4 py-3 font-medium ${entry.amount > 0 ? "text-green-600" : "text-red-600"}`}
									>
										{entry.amount > 0 ? `+${entry.amount}` : entry.amount}
									</td>
									<td className="px-4 py-3 text-gray-900">
										{entry.balance_after.toLocaleString()}
									</td>
									<td className="px-4 py-3 text-gray-700">
										{REASON_LABELS[entry.reason_code] ?? entry.reason_code}
									</td>
									<td className="px-4 py-3 text-gray-500">{entry.reason_note ?? "—"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
