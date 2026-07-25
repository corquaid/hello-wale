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
