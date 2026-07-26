"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipContentProps } from "recharts";
import type { DailyActivity } from "@/lib/customers";

function formatDate(date: string) {
	return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Recharts' contentStyle/itemStyle props only accept inline style objects, not
// classNames — rendering the tooltip ourselves is what lets it use real
// Tailwind classes instead.
function ChartTooltip({ active, payload, label }: TooltipContentProps) {
	if (!active || !payload?.length) return null;
	return (
		<div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] shadow-sm">
			<p className="font-medium text-gray-900">{formatDate(String(label))}</p>
			{payload.map((entry, index) => (
				<p key={index} className="text-black">
					{entry.name} : {entry.value}
				</p>
			))}
		</div>
	);
}

export function PointsActivityChart({ data }: { data: DailyActivity[] }) {
	return (
		<ResponsiveContainer width="100%" height={280}>
			<BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
				{/* Bar/grid/axis colors are SVG fill/stroke props, not classNames Recharts
				    will apply — pointing them at the Tailwind theme's own CSS variables
				    keeps every color traceable to one definition (globals.css) instead
				    of duplicating hex values here. */}
				<CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" vertical={false} />
				<XAxis
					dataKey="date"
					tickFormatter={formatDate}
					tick={{ fontSize: 12, fill: "var(--color-gray-500)" }}
					axisLine={{ stroke: "var(--color-gray-200)" }}
					tickLine={false}
					interval="preserveStartEnd"
				/>
				<YAxis
					tick={{ fontSize: 12, fill: "var(--color-gray-500)" }}
					axisLine={false}
					tickLine={false}
					width={40}
				/>
				<Tooltip content={ChartTooltip} />
				<Legend
					wrapperStyle={{ fontSize: 13 }}
					formatter={(value) => <span className="text-black">{value}</span>}
				/>
				<Bar dataKey="awarded" name="Awarded" fill="var(--color-wale-700)" radius={[3, 3, 0, 0]} />
				<Bar dataKey="redeemed" name="Redeemed" fill="var(--color-wale-gold)" radius={[3, 3, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}
