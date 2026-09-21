"use client";

import { EmployeeDetailsDialog, type EmployeeDetails } from "@/components/EmployeeDetailsDialog";
import { updateEmployee } from "../actions";

/** Binds the company-space action to the shared dialog. */
export function EditEmployeeDetails({
	employeeId,
	employee,
}: {
	employeeId: number;
	employee: EmployeeDetails;
}) {
	return (
		<EmployeeDetailsDialog action={updateEmployee.bind(null, employeeId)} employee={employee} />
	);
}
