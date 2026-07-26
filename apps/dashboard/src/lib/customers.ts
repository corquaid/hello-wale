import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSession } from "@/lib/auth";

export interface CustomerBalance {
	customer_id: string;
	name: string;
	email: string;
	created_at: string;
	balance: number;
}

export interface PointsTransaction {
	id: string;
	customer_id: string;
	delta: number;
	reason: string;
	created_by: string | null;
	created_at: string;
}

export interface PointsTransactionWithCustomer extends PointsTransaction {
	customer_name: string;
}

export interface TransactionFilters {
	customerName?: string;
	type?: "credit" | "debit";
	from?: string;
	to?: string;
}

export interface DashboardStats {
	employeeCount: number;
	totalBalance: number;
	totalAwarded: number;
	totalRedeemed: number;
}

export interface DailyActivity {
	date: string;
	awarded: number;
	redeemed: number;
}

export const getCustomers = cache(async (): Promise<CustomerBalance[]> => {
	await requireSession();
	const supabase = createAdminClient();
	const { data, error } = await supabase
		.from("customer_balances")
		.select("*")
		.order("name", { ascending: true });

	if (error) throw error;
	return data;
});

export const getCustomer = cache(
	async (customerId: string): Promise<CustomerBalance | null> => {
		await requireSession();
		const supabase = createAdminClient();
		const { data, error } = await supabase
			.from("customer_balances")
			.select("*")
			.eq("customer_id", customerId)
			.maybeSingle();

		if (error) throw error;
		return data;
	},
);

export const getTransactions = cache(
	async (customerId: string): Promise<PointsTransaction[]> => {
		await requireSession();
		const supabase = createAdminClient();
		const { data, error } = await supabase
			.from("points_transactions")
			.select("id, customer_id, delta, reason, created_by, created_at")
			.eq("customer_id", customerId)
			.order("created_at", { ascending: false });

		if (error) throw error;
		return data;
	},
);

export const getAllTransactions = cache(
	async (filters: TransactionFilters = {}): Promise<PointsTransactionWithCustomer[]> => {
		await requireSession();
		const supabase = createAdminClient();

		// !inner turns the customers join into an INNER JOIN, which is what lets
		// PostgREST filter top-level rows by a joined-table column (customers.name)
		// below — a plain left join would only filter the embedded object, not
		// which transaction rows come back.
		let query = supabase
			.from("points_transactions")
			.select("id, customer_id, delta, reason, created_by, created_at, customers!inner(name)")
			.order("created_at", { ascending: false });

		if (filters.customerName) {
			query = query.ilike("customers.name", `%${filters.customerName}%`);
		}
		if (filters.type === "credit") {
			query = query.gt("delta", 0);
		} else if (filters.type === "debit") {
			query = query.lt("delta", 0);
		}
		if (filters.from) {
			query = query.gte("created_at", filters.from);
		}
		if (filters.to) {
			// Inclusive of the whole "to" day — compare against the start of the
			// next day rather than the literal date string (which means midnight).
			const nextDay = new Date(filters.to);
			nextDay.setDate(nextDay.getDate() + 1);
			query = query.lt("created_at", nextDay.toISOString().slice(0, 10));
		}

		const { data, error } = await query;
		if (error) throw error;

		return data.map(({ customers, ...tx }) => ({
			...tx,
			customer_name: (customers as unknown as { name: string }).name,
		}));
	},
);

export const getDashboardStats = cache(async (): Promise<DashboardStats> => {
	await requireSession();
	const supabase = createAdminClient();

	const [balances, deltas] = await Promise.all([
		supabase.from("customer_balances").select("balance"),
		supabase.from("points_transactions").select("delta"),
	]);

	if (balances.error) throw balances.error;
	if (deltas.error) throw deltas.error;

	let totalAwarded = 0;
	let totalRedeemed = 0;
	for (const { delta } of deltas.data) {
		if (delta > 0) totalAwarded += delta;
		else totalRedeemed += -delta;
	}

	return {
		employeeCount: balances.data.length,
		totalBalance: balances.data.reduce((sum, c) => sum + c.balance, 0),
		totalAwarded,
		totalRedeemed,
	};
});

export interface ActivityFilters {
	from?: string;
	to?: string;
}

// Small admin tool, modest transaction volume — aggregating in JS after one
// fetch is simpler than adding a Postgres RPC for GROUP BY day, and avoids a
// schema migration just for a chart.
export const getPointsActivityByDay = cache(
	async (filters: ActivityFilters = {}): Promise<DailyActivity[]> => {
		await requireSession();
		const supabase = createAdminClient();

		const to = filters.to ? new Date(`${filters.to}T00:00:00`) : new Date();
		const from = filters.from
			? new Date(`${filters.from}T00:00:00`)
			: (() => {
					const d = new Date(to);
					d.setDate(d.getDate() - 29); // default: rolling last 30 days
					return d;
				})();

		const fromDate = from.toISOString().slice(0, 10);
		const toExclusive = new Date(to);
		toExclusive.setDate(toExclusive.getDate() + 1);
		const toExclusiveDate = toExclusive.toISOString().slice(0, 10);

		const { data, error } = await supabase
			.from("points_transactions")
			.select("delta, created_at")
			.gte("created_at", fromDate)
			.lt("created_at", toExclusiveDate)
			.order("created_at", { ascending: true });

		if (error) throw error;

		const byDay = new Map<string, { awarded: number; redeemed: number }>();
		for (const { delta, created_at } of data) {
			const day = created_at.slice(0, 10);
			const bucket = byDay.get(day) ?? { awarded: 0, redeemed: 0 };
			if (delta > 0) bucket.awarded += delta;
			else bucket.redeemed += -delta;
			byDay.set(day, bucket);
		}

		// Fill every day in the range, including zero-activity ones, so the
		// chart reflects true gaps instead of compressing them away.
		const result: DailyActivity[] = [];
		const cursor = new Date(from);
		while (cursor <= to) {
			const day = cursor.toISOString().slice(0, 10);
			const bucket = byDay.get(day) ?? { awarded: 0, redeemed: 0 };
			result.push({ date: day, ...bucket });
			cursor.setDate(cursor.getDate() + 1);
		}

		return result;
	},
);
