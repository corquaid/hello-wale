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

Next.js 16 App Router + TypeScript + Tailwind, backed by the **hello-wale-backend** API (Laravel). Run `npm run dev -- --filter=dashboard` from the root, or `npm run dev` from `apps/dashboard` directly. The backend must be running — `docker compose up` in `hello-wale-backend`; its OpenAPI document is at http://localhost:8080/docs.

Uses Next.js 16's `proxy.ts` file convention (renamed from `middleware.ts` — see `apps/dashboard/AGENTS.md`), so expect other breaking changes from prior Next.js knowledge too.

### Talking to the API

Everything goes through `src/lib/api/client.ts`. Three things about that API drive the design:

- **Cookie sessions, not tokens.** Bearer tokens are only issued on the server (`php artisan token:issue`) and no route hands one out, so a login form must use the cookie flow. The browser never calls the API directly — every call is server-side (Server Components and Server Actions), and the upstream cookies are held in this app's own _encrypted_ cookie (`src/lib/session.ts`). That cookie carries a live credential, which is why it is encrypted rather than merely signed.
- **The origin matters.** Sanctum only grants a session to requests whose Origin is in its stateful list, and refuses sign-in otherwise with `SESSION_UNAVAILABLE`. `API_ORIGIN` must appear in the backend's `SANCTUM_STATEFUL_DOMAINS` and `FRONTEND_URL`.
- **Writes need CSRF, and point movements need idempotency.** `/sanctum/csrf-cookie` first, then `X-XSRF-TOKEN` on every write. Every endpoint that moves points, plus both deactivates, requires an `Idempotency-Key` that covers the request body — see the comments in `src/app/employees/actions.ts` for how keys are minted and rotated.

Match on the `code` field of an error, never the message: the API documents messages as free to change. `src/lib/api/errors.ts` has the codes.

### Two route spaces

The API splits into `/operator/*` (platform operators) and `/company/*` (company administrators), and the wrong one refuses everything. `GET /auth/me` says which the caller is. Guards live in `src/lib/auth.ts` (`requireOperator`, `requireCompanyAdministrator`); reads live in `src/lib/operator.ts` and `src/lib/company.ts`.

Both sides have screens. Company administrators get employees, grants and the activity feed; operators get companies, per-company reports, employees, settings, pool top-ups, audit logs and invitations.

The operator space is **not** a superset. It has no route for an employee's point history, nor for granting, correcting or reversing points — an operator funds a company's pool, but only the company hands points to its own people. `OPERATOR_CANNOT` in `src/lib/operator.ts` is the wording the UI uses to say so rather than showing an empty panel.

Guard sections in `layout.tsx`, not only in the data layer: a page that renders without fetching (a blank "add" form) would otherwise be reachable by the wrong role.

Known gap: the API exposes point history per employee only, so the company-wide activity feed and the dashboard chart fan out across the employee list (`getCompanyActivity`). That wants a `/company/points` endpoint upstream.

Requires a `.env.local` in `apps/dashboard` (see `.env.example`): `API_URL`, `API_ORIGIN`, and a `SESSION_SECRET` (`openssl rand -base64 32`). Demo credentials come from the backend's seeder — `operator@platform.test` and `demo@company-a.test`, password `password`.
