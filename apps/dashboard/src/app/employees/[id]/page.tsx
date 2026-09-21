import Link from "next/link";
import { notFound } from "next/navigation";
import {
	getCompanyReport,
	getEmployee,
	getEmployeePointHistory,
	REASON_LABELS,
} from "@/lib/company";
import { AdjustPointsForm, type CorrectableTransfer } from "./AdjustPointsForm";
import { DeactivateEmployeeButton } from "./DeactivateEmployeeButton";
import { ReverseTransferButton } from "./ReverseTransferButton";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const employeeId = Number(id);

	if (!Number.isInteger(employeeId) || employeeId <= 0) notFound();

	const employee = await getEmployee(employeeId);
	if (!employee) notFound();

	const [history, report] = await Promise.all([
		getEmployeePointHistory(employeeId),
		getCompanyReport(),
	]);
	const isActive = employee.status === "active";

	// Minted here rather than in the client components so the value is stable
	// across hydration. See AdjustPointsForm for why the key matters.
	const adjustKey = crypto.randomUUID();
	const deactivateKey = crypto.randomUUID();

	// What can be undone whole. Reversing a reversal would be undoing an undo,
	// and a deactivation's return belongs to a record that is already closed —
	// the API would refuse both, so neither is offered.
	const REVERSIBLE = new Set(["GRANT", "BULK_GRANT", "CORRECTION"]);

	// What a take-back can be booked against. One transfer touches this account
	// once, but dedupe anyway: the picker must not offer the same one twice.
	const correctableTransfers: CorrectableTransfer[] = [
		...new Map(
			history.map((entry) => [
				entry.transfer_id,
				{
					transferId: entry.transfer_id,
					label: [
						new Date(entry.created_at).toLocaleDateString(),
						entry.amount > 0 ? `+${entry.amount}` : `${entry.amount}`,
						REASON_LABELS[entry.reason_code] ?? entry.reason_code,
					].join(" · "),
				},
			]),
		).values(),
	];

	return (
		<div className="space-y-8">
			<div className="flex items-start justify-between">
				<div>
					<Link href="/employees" className="text-sm text-gray-500 hover:underline">
						← Employees
					</Link>
					<h1 className="font-display mt-1 text-2xl font-semibold text-gray-900">
						{employee.first_name} {employee.last_name}
					</h1>
					<p className="text-sm text-gray-500">{employee.email}</p>
					{!isActive && (
						<p className="mt-1 text-sm text-gray-400">
							Inactive
							{employee.deactivated_at
								? ` since ${new Date(employee.deactivated_at).toLocaleDateString()}`
								: ""}
						</p>
					)}
				</div>
				{isActive && (
					<DeactivateEmployeeButton
						employeeId={employee.id}
						name={`${employee.first_name} ${employee.last_name}`}
						balance={employee.points_balance}
						idempotencyKey={deactivateKey}
					/>
				)}
			</div>

			<div className="rounded-lg border border-gray-200 bg-white p-6">
				<p className="text-sm text-gray-500">Points balance</p>
				<p className="text-3xl font-semibold text-gray-900">
					{employee.points_balance.toLocaleString()}
				</p>
			</div>

			<div>
				<h2 className="font-display mb-3 text-lg font-medium text-gray-900">
					Adjust Points Balance
				</h2>
				<AdjustPointsForm
					employeeId={employee.id}
					transfers={correctableTransfers}
					poolBalance={report.pool_balance}
					initialIdempotencyKey={adjustKey}
					disabled={!isActive}
				/>
			</div>

			<div>
				<h2 className="font-display mb-3 text-lg font-medium text-gray-900">History</h2>
				{history.length === 0 ? (
					<p className="text-sm text-gray-500">No points activity yet.</p>
				) : (
					<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
						<table className="w-full text-left text-sm">
							<thead className="bg-gray-50 text-gray-500">
								<tr>
									<th className="px-4 py-3 font-medium">Date</th>
									<th className="px-4 py-3 font-medium">Change</th>
									<th className="px-4 py-3 font-medium">Balance after</th>
									<th className="px-4 py-3 font-medium">Reason</th>
									<th className="px-4 py-3 font-medium">Note</th>
									<th className="px-4 py-3 font-medium">
										<span className="sr-only">Actions</span>
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{history.map((entry) => (
									<tr key={entry.id}>
										<td className="px-4 py-3 whitespace-nowrap text-gray-500">
											{new Date(entry.created_at).toLocaleString()}
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
										<td className="px-4 py-3 text-right whitespace-nowrap">
											{isActive && REVERSIBLE.has(entry.reason_code) && (
												<ReverseTransferButton
													transferId={entry.transfer_id}
													employeeId={employee.id}
													amount={entry.amount}
													reasonLabel={REASON_LABELS[entry.reason_code] ?? entry.reason_code}
													isGroupGrant={entry.reason_code === "BULK_GRANT"}
													idempotencyKey={crypto.randomUUID()}
												/>
											)}
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
