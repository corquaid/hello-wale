-- HelloWale dashboard schema
-- Run this against a fresh Supabase project (SQL Editor, or `supabase db push`).
--
-- Naming note: the customer-facing "users" from the product spec are modeled
-- as `customers` here, to avoid clashing with Supabase's own `auth.users`
-- table (not used by this app — the dashboard login is a single shared
-- demo password, not per-user Supabase Auth accounts; see apps/dashboard/AGENTS.md).

create extension if not exists "pgcrypto";

create table if not exists customers (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	email text not null unique,
	created_at timestamptz not null default now()
);

-- Points ledger. The balance is derived by summing `delta`, never stored as
-- a mutable column — this avoids balance/ledger drift and gives the points
-- history view for free (every award/redemption is just a row here).
-- `created_by` is a free-text username (the shared demo login's username),
-- not a foreign key — there's no per-user accounts table to reference.
create table if not exists points_transactions (
	id uuid primary key default gen_random_uuid(),
	customer_id uuid not null references customers (id) on delete cascade,
	delta integer not null check (delta <> 0),
	reason text not null,
	created_by text,
	created_at timestamptz not null default now()
);

create index if not exists points_transactions_customer_id_idx
	on points_transactions (customer_id);

-- Current balance per customer, derived from the ledger.
-- security_invoker ensures the view enforces the querying role's RLS
-- policies (Postgres 15+ default is security_definer, which would bypass them).
create or replace view customer_balances
	with (security_invoker = true) as
select
	c.id as customer_id,
	c.name,
	c.email,
	c.created_at,
	coalesce(sum(pt.delta), 0)::integer as balance
from customers c
left join points_transactions pt on pt.customer_id = c.id
group by c.id, c.name, c.email, c.created_at;

-- RLS: enabled with NO policies for anon/authenticated — default-deny.
-- The dashboard only ever talks to this data through a service-role client
-- (server-only, bypasses RLS), gated by the shared-password session cookie
-- checked in proxy.ts + lib/auth.ts. This means the anon/public API key
-- alone cannot read or write this data at all, even though there's no
-- per-user Supabase Auth in front of it.
alter table customers enable row level security;
alter table points_transactions enable row level security;
