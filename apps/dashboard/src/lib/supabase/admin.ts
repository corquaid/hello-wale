import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — bypasses RLS entirely. Safe to use because:
 * 1. It's only ever imported from server-only code (Server Components,
 *    Server Actions) — the service role key is never bundled to the browser.
 * 2. Access to the app itself is gated by the shared-password session cookie
 *    (see proxy.ts + lib/session.ts), which is the actual access control now
 *    that this dashboard doesn't use per-user Supabase Auth accounts.
 *
 * `customers` and `points_transactions` have RLS enabled with no anon/
 * authenticated policies, so this service-role client is the only way in —
 * even someone with the (non-public) Supabase project URL and the public
 * anon key cannot read or write this data directly.
 */
export function createAdminClient() {
	return createSupabaseClient(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{ auth: { persistSession: false } },
	);
}
