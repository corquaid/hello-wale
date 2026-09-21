import Link from "next/link";
import { getCompanyReport, getEmployees } from "@/lib/company";
import { BulkGrantForm, type Recipient } from "./BulkGrantForm";

/**
 * A group grant is one indivisible operation: the pool is debited once for the
 * whole sum, and either everybody receives points or nobody does. That is the
 * reason this screen exists rather than asking somebody to grant twenty times
 * in a row from the individual pages.
 */
export default async function BulkGrantPage() {
	const [employees, report] = await Promise.all([
		getEmployees({ status: "active" }),
		getCompanyReport(),
	]);

	const recipients: Recipient[] = employees.map((employee) => ({
		id: employee.id,
		name: `${employee.first_name} ${employee.last_name}`,
		email: employee.email,
		balance: employee.points_balance,
	}));

	return (
		<div className="space-y-6">
			<div>
				<Link href="/employees" className="text-sm text-gray-500 hover:underline">
					← Employees
				</Link>
				<h1 className="font-display mt-1 text-2xl font-semibold text-gray-900">Grant points</h1>
				<p className="text-sm text-gray-500">
					One operation for everybody named below — if any allocation is refused, none of them
					happen. Inactive employees cannot receive points, so they are not listed.
				</p>
			</div>

			{recipients.length === 0 ? (
				<p className="text-sm text-gray-500">
					No active employees to grant to.{" "}
					<Link href="/employees/new" className="text-wale-700 hover:underline">
						Add one first
					</Link>
					.
				</p>
			) : (
				<BulkGrantForm
					recipients={recipients}
					poolBalance={report.pool_balance}
					initialIdempotencyKey={crypto.randomUUID()}
				/>
			)}
		</div>
	);
}
