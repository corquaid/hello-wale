import { DashboardChrome } from "@/components/DashboardChrome";
import { requireCompanyAdministrator } from "@/lib/auth";

/**
 * Guards the whole section, not just the pages that fetch.
 *
 * Relying on the data layer's own guard leaves any page that renders without
 * fetching — a blank "add" form, say — reachable by the wrong role. The
 * Server Actions behind those forms guard independently, so nothing could be
 * written, but the screen should not render at all.
 */
export default async function EmployeesLayout({ children }: { children: React.ReactNode }) {
	await requireCompanyAdministrator();
	return <DashboardChrome>{children}</DashboardChrome>;
}
