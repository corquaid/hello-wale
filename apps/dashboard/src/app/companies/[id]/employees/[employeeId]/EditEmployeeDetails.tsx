"use client";

import { EmployeeDetailsDialog, type EmployeeDetails } from "@/components/EmployeeDetailsDialog";
import { updateCompanyEmployee } from "../../../actions";

/** Binds the operator-space action to the shared dialog. */
export function EditEmployeeDetails({
	companyId,
	employeeId,
	employee,
}: {
	companyId: number;
	employeeId: number;
	employee: EmployeeDetails;
}) {
	return (
		<EmployeeDetailsDialog
			action={updateCompanyEmployee.bind(null, companyId, employeeId)}
			employee={employee}
		/>
	);
}
