import { DashboardChrome } from "@/components/DashboardChrome";
import { requireUser } from "@/lib/auth";

/**
 * Guards the section, like the others — but on being signed in rather than on
 * a role. The account screen shows the caller their own record, so both halves
 * of the API's split belong here.
 */
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
	await requireUser();
	return <DashboardChrome>{children}</DashboardChrome>;
}
