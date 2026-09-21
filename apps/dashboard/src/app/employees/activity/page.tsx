import Link from "next/link";
import { getCompanyActivity, groupByTransfer, REASON_LABELS } from "@/lib/company";

export default async function ActivityPage({
	searchParams,
}: {
	searchParams: Promise<{
		name?: string;
		type?: string;
		reason?: string;
		from?: string;
		to?: string;
		view?: string;
	}>;
}) {
	const { name = "", type = "", reason = "", from = "", to = "", view = "" } = await searchParams;

	const byTransfer = view === "transfers";

	// Filtered here rather than upstream: the API exposes point history per
	// employee only, so this page already holds the whole set in memory. See
	// getCompanyActivity for why, and what would replace it.
	const all = await getCompanyActivity();

	const activity = all.filter((entry) => {
		if (name && !entry.employee_name.toLowerCase().includes(name.toLowerCase())) return false;
		if (type === "credit" && entry.amount <= 0) return false;
		if (type === "debit" && entry.amount >= 0) return false;
		if (reason && entry.reason_code !== reason) return false;
		const date = entry.created_at.slice(0, 10);
		if (from && date < from) return false;
		if (to && date > to) return false;
		return true;
	});

	// Built from everything this company has, not from what survived the other
	// filters: options that come and go as you narrow the list are worse than
	// useless. Reason codes the company has never produced are left out
	// entirely — COMPANY_TOPUP, for one, never reaches an employee's account.
	const reasonOptions = [...new Set(all.map((entry) => entry.reason_code))]
		.map((code) => ({ code, label: REASON_LABELS[code] ?? code }))
		.sort((a, b) => a.label.localeCompare(b.label));

	const groups = byTransfer ? groupByTransfer(activity) : [];

	const hasFilters = name || type || reason || from || to;

	// Toggling the view keeps the filters: they describe what is being looked
	// at, not how it is arranged.
	const viewLink = (target: "" | "transfers") => {
		const query = new URLSearchParams();
		if (name) query.set("name", name);
		if (type) query.set("type", type);
		if (reason) query.set("reason", reason);
		if (from) query.set("from", from);
		if (to) query.set("to", to);
		if (target) query.set("view", target);
		const search = query.toString();
		return search ? `/employees/activity?${search}` : "/employees/activity";
	};

	const tab = "rounded-md px-3 py-1.5 text-sm font-medium";
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
				<div className="space-y-1">
					<label htmlFor="reason" className="block text-sm font-medium text-gray-700">
						Reason
					</label>
					<select
						id="reason"
						name="reason"
						defaultValue={reason}
						disabled={reasonOptions.length === 0}
						className={`${field} bg-white disabled:bg-gray-50 disabled:text-gray-400`}
					>
						<option value="">All</option>
						{reasonOptions.map((option) => (
							<option key={option.code} value={option.code}>
								{option.label}
							</option>
						))}
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

			<div className="flex items-center gap-2">
				<Link
					href={viewLink("")}
					className={
						byTransfer ? `${tab} text-gray-500 hover:bg-gray-100` : `${tab} bg-wale-700 text-white`
					}
				>
					Movements
				</Link>
				<Link
					href={viewLink("transfers")}
					className={
						byTransfer ? `${tab} bg-wale-700 text-white` : `${tab} text-gray-500 hover:bg-gray-100`
					}
				>
					By transfer
				</Link>
			</div>

			{activity.length === 0 ? (
				<p className="text-sm text-gray-500">No points activity matches those filters.</p>
			) : byTransfer ? (
				<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
					<table className="w-full text-left text-sm">
						<thead className="bg-gray-50 text-gray-500">
							<tr>
								<th className="px-4 py-3 font-medium">Date</th>
								<th className="px-4 py-3 font-medium">Reason</th>
								<th className="px-4 py-3 font-medium">Employees</th>
								<th className="px-4 py-3 font-medium">Total</th>
								<th className="px-4 py-3 font-medium">Note</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{groups.map((group) => (
								<tr key={group.transferId} className="align-top hover:bg-gray-50">
									<td className="px-4 py-3 whitespace-nowrap text-gray-500">
										{new Date(group.created_at).toLocaleString()}
									</td>
									<td className="px-4 py-3 text-gray-700">
										{REASON_LABELS[group.reason_code] ?? group.reason_code}
									</td>
									<td className="px-4 py-3">
										{group.entries.length === 1 ? (
											<Link
												href={`/employees/${group.entries[0].employee_id}`}
												className="hover:text-wale-700 font-medium text-gray-900"
											>
												{group.entries[0].employee_name}
											</Link>
										) : (
											<details>
												<summary className="hover:text-wale-700 cursor-pointer font-medium text-gray-900">
													{group.entries.length} employees
												</summary>
												<ul className="mt-2 space-y-1">
													{group.entries.map((entry) => (
														<li key={entry.id} className="text-xs text-gray-600">
															<Link
																href={`/employees/${entry.employee_id}`}
																className="hover:text-wale-700"
															>
																{entry.employee_name}
															</Link>{" "}
															<span
																className={entry.amount > 0 ? "text-green-600" : "text-red-600"}
															>
																{entry.amount > 0 ? `+${entry.amount}` : entry.amount}
															</span>
														</li>
													))}
												</ul>
											</details>
										)}
									</td>
									<td
										className={`px-4 py-3 font-medium whitespace-nowrap ${group.total > 0 ? "text-green-600" : "text-red-600"}`}
									>
										{group.total > 0 ? `+${group.total}` : group.total}
									</td>
									<td className="px-4 py-3 text-gray-500">{group.reason_note ?? "—"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
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
								<tr
									key={`${entry.employee_id}-${entry.id}`}
									className="relative focus-within:bg-gray-50 hover:bg-gray-50"
								>
									<td className="px-4 py-3 whitespace-nowrap text-gray-500">
										{new Date(entry.created_at).toLocaleString()}
									</td>
									<td className="px-4 py-3">
										{/* The ::after overlay stretches this link across the whole row, so the
										    row is clickable while staying a real anchor: keyboard focus, middle
										    click and open-in-new-tab all keep working. */}
										<Link
											href={`/employees/${entry.employee_id}`}
											className="font-medium text-gray-900 after:absolute after:inset-0 after:content-['']"
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
