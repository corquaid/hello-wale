import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { signOut } from "@/app/login/actions";
import { getUser } from "@/lib/auth";

/**
 * The nav is role-aware because the API is: the employee and points screens
 * sit behind /company/*, which a platform operator cannot read at all.
 * Offering them a link that can only redirect would be worse than not
 * offering it.
 */
export async function DashboardChrome({ children }: { children: React.ReactNode }) {
	const user = await getUser();

	const links =
		user?.role === "company_administrator"
			? [
					{ href: "/", label: "Home" },
					{ href: "/employees", label: "Employees" },
					{ href: "/employees/activity", label: "Activity" },
				]
			: user?.role === "platform_operator"
				? [
						{ href: "/", label: "Home" },
						{ href: "/companies", label: "Companies" },
					]
				: [{ href: "/", label: "Home" }];

	return (
		<div className="bg-wale-50 min-h-screen">
			<header className="border-b border-gray-200 bg-white px-6 py-4">
				<div className="mx-auto flex max-w-4xl items-center justify-between">
					<div className="flex items-center gap-8">
						<Link href="/" className="flex items-center">
							<Image src={logo} alt="HelloWale" className="h-5 w-auto" priority />
						</Link>
						<nav className="flex items-center gap-6">
							{links.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="hover:text-wale-700 text-sm text-gray-600"
								>
									{link.label}
								</Link>
							))}
						</nav>
					</div>
					<form action={signOut}>
						<button type="submit" className="hover:text-wale-700 text-sm text-gray-500">
							Sign out
						</button>
					</form>
				</div>
			</header>
			<main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
		</div>
	);
}
