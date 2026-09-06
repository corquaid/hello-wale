import Link from "next/link";
import { notFound } from "next/navigation";
import { changedFields, getAuditLogs, getCompany } from "@/lib/operator";

function renderValue(value: unknown): string {
	if (value === null || value === undefined) return "—";
	if (typeof value === "object") return JSON.stringify(value);
	return String(value);
}

/** "App\\Models\\Employee" reads better as just "Employee". */
function shortType(type: string): string {
	return type.split("\\").pop() ?? type;
}

export default async function AuditLogsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const companyId = Number(id);
	if (!Number.isInteger(companyId) || companyId <= 0) notFound();

	const company = await getCompany(companyId);
	if (!company) notFound();

	const entries = await getAuditLogs(companyId);

	return (
		<div className="space-y-6">
			<div>
				<Link href={`/companies/${companyId}`} className="text-sm text-gray-500 hover:underline">
					← {company.name}
				</Link>
				<h1 className="font-display mt-1 text-2xl font-semibold text-gray-900">Audit log</h1>
				<p className="text-sm text-gray-500">
					What changed in this company&rsquo;s settings, newest first, with the values on either
					side of each change.
				</p>
			</div>

			{entries.length === 0 ? (
				<p className="text-sm text-gray-500">Nothing recorded yet.</p>
			) : (
				<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
					<table className="w-full text-left text-sm">
						<thead className="bg-gray-50 text-gray-500">
							<tr>
								<th className="px-4 py-3 font-medium">When</th>
								<th className="px-4 py-3 font-medium">Action</th>
								<th className="px-4 py-3 font-medium">Record</th>
								<th className="px-4 py-3 font-medium">Changes</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{entries.map((entry) => {
								const changes = changedFields(entry);
								return (
									<tr key={entry.id} className="align-top">
										<td className="px-4 py-3 whitespace-nowrap text-gray-500">
											{new Date(entry.created_at).toLocaleString()}
										</td>
										<td className="px-4 py-3 text-gray-700 capitalize">{entry.action}</td>
										<td className="px-4 py-3 whitespace-nowrap text-gray-900">
											{shortType(entry.auditable_type)} #{entry.auditable_id}
										</td>
										<td className="px-4 py-3 text-gray-600">
											{changes.length === 0 ? (
												"—"
											) : (
												<ul className="space-y-0.5">
													{changes.map(([field, before, after]) => (
														<li key={field}>
															<span className="text-gray-500">{field}:</span>{" "}
															{entry.before === null ? (
																<span>{renderValue(after)}</span>
															) : (
																<>
																	<span className="text-red-600">{renderValue(before)}</span> →{" "}
																	<span className="text-green-700">{renderValue(after)}</span>
																</>
															)}
														</li>
													))}
												</ul>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
