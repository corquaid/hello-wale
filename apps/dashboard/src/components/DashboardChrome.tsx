import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { signOut } from "@/app/customers/actions";

export function DashboardChrome({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-wale-50 min-h-screen">
			<header className="border-b border-gray-200 bg-white px-6 py-4">
				<div className="mx-auto flex max-w-4xl items-center justify-between">
					<div className="flex items-center gap-8">
						<Link href="/" className="flex items-center">
							<Image src={logo} alt="HelloWale" className="h-5 w-auto" priority />
						</Link>
						<nav className="flex items-center gap-6">
							<Link href="/" className="hover:text-wale-700 text-sm text-gray-600">
								Home
							</Link>
							<Link href="/customers" className="hover:text-wale-700 text-sm text-gray-600">
								Customers
							</Link>
							<Link
								href="/customers/transactions"
								className="hover:text-wale-700 text-sm text-gray-600"
							>
								Transactions
							</Link>
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
