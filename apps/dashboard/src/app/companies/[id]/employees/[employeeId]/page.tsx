import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany, getCompanyEmployee, OPERATOR_CANNOT } from "@/lib/operator";
import { DeactivateButton } from "./DeactivateButton";

export default async function OperatorEmployeePage({
	params,
}: {
	params: Promise<{ id: string; employeeId: string }>;
}) {
	const { id, employeeId } = await params;
	const companyId = Number(id);
	const empId = Number(employeeId);
	if (!Number.isInteger(companyId) || !Number.isInteger(empId)) notFound();

	const [company, employee] = await Promise.all([
		getCompany(companyId),
		getCompanyEmployee(companyId, empId),
	]);
	if (!company || !employee) notFound();

	const isActive = employee.status === "active";

	return (
		<div className="space-y-8">
			<div className="flex items-start justify-between">
				<div>
					<Link href={`/companies/${companyId}`} className="text-sm text-gray-500 hover:underline">
						← {company.name}
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
					<DeactivateButton
						companyId={companyId}
						employeeId={employee.id}
						name={`${employee.first_name} ${employee.last_name}`}
						balance={employee.points_balance}
						idempotencyKey={crypto.randomUUID()}
					/>
				)}
			</div>

			<div className="rounded-lg border border-gray-200 bg-white p-6">
				<p className="text-sm text-gray-500">Points balance</p>
				<p className="text-3xl font-semibold text-gray-900">
					{employee.points_balance.toLocaleString()}
				</p>
			</div>

			{/*
			 * There is no operator route for an employee's point history, so this
			 * says why rather than rendering an empty table. The equivalent
			 * company-administrator screen shows the full ledger.
			 */}
			<div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
				<h2 className="font-display mb-1 text-lg font-medium text-gray-900">History</h2>
				<p className="text-sm text-gray-500">{OPERATOR_CANNOT}</p>
			</div>
		</div>
	);
}
