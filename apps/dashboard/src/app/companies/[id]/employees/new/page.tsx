import { notFound } from "next/navigation";
import { getCompany } from "@/lib/operator";
import { NewCompanyEmployeeForm } from "./NewCompanyEmployeeForm";

export default async function NewCompanyEmployeePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const companyId = Number(id);
	if (!Number.isInteger(companyId) || companyId <= 0) notFound();

	const company = await getCompany(companyId);
	if (!company) notFound();

	return (
		<div className="max-w-lg space-y-6">
			<h1 className="font-display text-2xl font-semibold text-gray-900">
				Add employee to {company.name}
			</h1>
			<NewCompanyEmployeeForm companyId={companyId} />
		</div>
	);
}
