import { NewEmployeeForm } from "./NewEmployeeForm";

export default function NewEmployeePage() {
	return (
		<div className="max-w-lg space-y-6">
			<h1 className="font-display text-2xl font-semibold text-gray-900">Add employee</h1>
			<NewEmployeeForm />
		</div>
	);
}
