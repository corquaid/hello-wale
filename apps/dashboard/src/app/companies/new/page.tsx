import { NewCompanyForm } from "./NewCompanyForm";

export default function NewCompanyPage() {
	return (
		<div className="max-w-lg space-y-6">
			<h1 className="font-display text-2xl font-semibold text-gray-900">Add company</h1>
			<p className="text-sm text-gray-500">
				Creates the company together with the point accounts it works through.
			</p>
			<NewCompanyForm />
		</div>
	);
}
