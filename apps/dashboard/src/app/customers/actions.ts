"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSession } from "@/lib/auth";
import { deleteSession } from "@/lib/session";

export type ActionState = { error: string } | undefined;

export async function createCustomer(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireSession();

	const name = formData.get("name");
	const email = formData.get("email");

	if (typeof name !== "string" || !name.trim()) {
		return { error: "Name is required." };
	}
	if (typeof email !== "string" || !email.trim()) {
		return { error: "Email is required." };
	}

	const supabase = createAdminClient();
	const { data, error } = await supabase
		.from("customers")
		.insert({ name: name.trim(), email: email.trim() })
		.select("id")
		.single();

	if (error) {
		return {
			error: error.code === "23505" ? "A customer with that email already exists." : error.message,
		};
	}

	revalidatePath("/customers");
	redirect(`/customers/${data.id}`);
}

export async function deleteCustomer(customerId: string) {
	await requireSession();

	const supabase = createAdminClient();
	const { error } = await supabase.from("customers").delete().eq("id", customerId);
	if (error) throw error;

	revalidatePath("/customers");
	redirect("/customers");
}

export async function assignPoints(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const session = await requireSession();

	const customerId = formData.get("customerId");
	const deltaRaw = formData.get("delta");
	const reason = formData.get("reason");

	if (typeof customerId !== "string" || !customerId) {
		return { error: "Missing customer." };
	}
	const delta = Number(deltaRaw);
	if (!Number.isInteger(delta) || delta === 0) {
		return { error: "Points must be a non-zero whole number (use a minus sign to deduct)." };
	}
	if (typeof reason !== "string" || !reason.trim()) {
		return { error: "A reason is required for every points change." };
	}

	const supabase = createAdminClient();
	const { error } = await supabase.from("points_transactions").insert({
		customer_id: customerId,
		delta,
		reason: reason.trim(),
		created_by: session.username,
	});

	if (error) {
		return { error: error.message };
	}

	revalidatePath(`/customers/${customerId}`);
	revalidatePath("/customers");
}

export async function signOut() {
	await deleteSession();
	redirect("/login");
}
