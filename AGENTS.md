## Monorepo layout

This is an npm + Turborepo workspace with two apps:

- `apps/site` — the Astro marketing/landing site (deployed to GitHub Pages)
- `apps/dashboard` — the Next.js admin dashboard (users, points balances, points transaction history; Supabase-backed)

Run commands from the repo root; `turbo` fans them out to the relevant workspace(s). Use `--filter=site` or `--filter=dashboard` to scope to one app, e.g. `npm run build -- --filter=site`.

## apps/site (Astro)

When starting the dev server, use background mode from `apps/site`:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

### Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## apps/dashboard (Next.js)

Next.js 16 App Router + TypeScript + Tailwind, backed by Supabase (Postgres only). Run `npm run dev -- --filter=dashboard` from the root, or `npm run dev` from `apps/dashboard` directly.

Uses Next.js 16's `proxy.ts` file convention (renamed from `middleware.ts` — see `apps/dashboard/AGENTS.md`), so expect other breaking changes from prior Next.js knowledge too.

**Auth is a shared demo password, not Supabase Auth.** Login checks the submitted username/password against `DASHBOARD_USERNAME`/`DASHBOARD_PASSWORD` env vars and sets a signed session cookie (`src/lib/session.ts`, `jose`) — there's no per-user account system. All Supabase access goes through a service-role client (`src/lib/supabase/admin.ts`), server-only, since RLS has no anon/authenticated policies to check against. Swap this for real per-user auth before this becomes the production admin tool, not just a demo.

Requires a `.env.local` in `apps/dashboard` (see `.env.example`): a real Supabase project URL + `service_role` key, the demo username/password, and a `SESSION_SECRET` (`openssl rand -base64 32`). Schema lives in `apps/dashboard/supabase/schema.sql`.
