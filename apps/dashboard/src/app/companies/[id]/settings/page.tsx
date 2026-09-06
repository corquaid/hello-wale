import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompany } from "@/lib/operator";
import { CompanySettingsForm } from "./CompanySettingsForm";

export default async function CompanySettingsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const companyId = Number(id);
	if (!Number.isInteger(companyId) || companyId <= 0) notFound();

	const company = await getCompany(companyId);
	if (!company) notFound();

	return (
		<div className="max-w-lg space-y-6">
			<div>
				<Link href={`/companies/${companyId}`} className="text-sm text-gray-500 hover:underline">
					← {company.name}
				</Link>
				<h1 className="font-display mt-1 text-2xl font-semibold text-gray-900">Settings</h1>
			</div>
			<CompanySettingsForm company={company} />
		</div>
	);
}
