# HelloWale

Monorepo for the HelloWale platform.

- [`apps/site`](apps/site) — Astro marketing/landing site, deployed to GitHub Pages
- [`apps/dashboard`](apps/dashboard) — Next.js admin dashboard (users, points balances, points history), backed by Supabase

## Development

```sh
npm install
npm run dev            # runs dev for every app via Turborepo
npm run dev -- --filter=site
npm run dev -- --filter=dashboard
```

See [`AGENTS.md`](AGENTS.md) for per-app development notes.
