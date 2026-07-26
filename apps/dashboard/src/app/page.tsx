import Link from "next/link";
import { DashboardChrome } from "@/components/DashboardChrome";
import { PointsActivityChart } from "@/components/PointsActivityChart";
import { getDashboardStats, getPointsActivityByDay } from "@/lib/customers";

export default async function HomePage({
	searchParams,
}: {
	searchParams: Promise<{ from?: string; to?: string }>;
}) {
	const { from = "", to = "" } = await searchParams;

	const [stats, activity] = await Promise.all([
		getDashboardStats(),
		getPointsActivityByDay({ from: from || undefined, to: to || undefined }),
	]);

	const statCards = [
		{ label: "Employees", value: stats.employeeCount.toLocaleString() },
		{ label: "Points available", value: stats.totalBalance.toLocaleString() },
		{ label: "Awarded (all time)", value: `+${stats.totalAwarded.toLocaleString()}` },
		{ label: "Redeemed (all time)", value: `-${stats.totalRedeemed.toLocaleString()}` },
	];

	return (
		<DashboardChrome>
			<div className="space-y-8">
				<h1 className="font-display text-2xl font-semibold text-gray-900">Dashboard</h1>

				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{statCards.map((card) => (
						<div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4">
							<p className="text-sm text-gray-500">{card.label}</p>
							<p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
						</div>
					))}
				</div>

				<form className="flex flex-wrap items-end gap-3">
					<div className="space-y-1">
						<label htmlFor="from" className="block text-xs font-medium text-gray-700">
							From
						</label>
						<input
							id="from"
							name="from"
							type="date"
							defaultValue={from}
							className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-wale-700 focus:outline-none"
						/>
					</div>
					<div className="space-y-1">
						<label htmlFor="to" className="block text-xs font-medium text-gray-700">
							To
						</label>
						<input
							id="to"
							name="to"
							type="date"
							defaultValue={to}
							className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-wale-700 focus:outline-none"
						/>
					</div>
					<button
						type="submit"
						className="rounded-md bg-wale-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-wale-800"
					>
						Filter
					</button>
					{(from || to) && (
						<Link href="/" className="px-2 py-1.5 text-sm font-medium text-gray-500 hover:text-wale-700">
							Reset
						</Link>
					)}
				</form>

				<div className="rounded-lg border border-gray-200 bg-white p-6">
					<h2 className="mb-4 font-display text-lg font-medium text-gray-900">Points activity</h2>
					<PointsActivityChart data={activity} />
				</div>
			</div>
		</DashboardChrome>
	);
}
