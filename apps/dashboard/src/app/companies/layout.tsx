import { DashboardChrome } from "@/components/DashboardChrome";
import { requireOperator } from "@/lib/auth";

/** Guards the whole section — see the note in app/employees/layout.tsx. */
export default async function CompaniesLayout({ children }: { children: React.ReactNode }) {
	await requireOperator();
	return <DashboardChrome>{children}</DashboardChrome>;
}
