import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { signOut } from "./actions";

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-wale-50">
			<header className="border-b border-gray-200 bg-white px-6 py-4">
				<div className="mx-auto flex max-w-4xl items-center justify-between">
					<Link href="/customers" className="flex items-center">
						<Image src={logo} alt="HelloWale" className="h-5 w-auto" priority />
					</Link>
					<form action={signOut}>
						<button type="submit" className="text-sm text-gray-500 hover:text-wale-700">
							Sign out
						</button>
					</form>
				</div>
			</header>
			<main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
		</div>
	);
}
