import Link from "next/link";
import { getEmployees } from "@/lib/company";

export default async function EmployeesPage() {
	const employees = await getEmployees();

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-display text-2xl font-semibold text-gray-900">Employees</h1>
				<Link
					href="/employees/new"
					className="bg-wale-700 hover:bg-wale-800 rounded-md px-3 py-2 text-sm font-medium text-white"
				>
					Add employee
				</Link>
			</div>

			{employees.length === 0 ? (
				<p className="text-sm text-gray-500">No employees yet.</p>
			) : (
				<div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
					<table className="w-full text-left text-sm">
						<thead className="bg-gray-50 text-gray-500">
							<tr>
								<th className="px-4 py-3 font-medium">Name</th>
								<th className="px-4 py-3 font-medium">Email</th>
								<th className="px-4 py-3 font-medium">Status</th>
								<th className="px-4 py-3 font-medium">Points balance</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{employees.map((employee) => (
								<tr key={employee.id} className="hover:bg-gray-50">
									<td className="px-4 py-3">
										<Link href={`/employees/${employee.id}`} className="font-medium text-gray-900">
											{employee.first_name} {employee.last_name}
										</Link>
									</td>
									<td className="px-4 py-3 text-gray-600">{employee.email}</td>
									<td className="px-4 py-3">
										{employee.status === "active" ? (
											<span className="text-gray-600">Active</span>
										) : (
											<span className="text-gray-400">Inactive</span>
										)}
									</td>
									<td className="px-4 py-3 text-gray-900">
										{employee.points_balance.toLocaleString()}
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
