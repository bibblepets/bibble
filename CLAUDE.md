@AGENTS.md

# Bibble

Pet marketplace (pets for sale/adoption, accessories, services). Next.js 16 App Router + Supabase + Vercel. See README.md for setup, scripts and CI/CD.

## Conventions

- **No `src/`**: routes in `app/`, shared code in `lib/`, UI in `components/`. Import with the `@/` alias.
- **Formatting:** Prettier with tabs, no semicolons, 120 columns. Run `npm run format`; don't hand-format.
- **UI:** use shadcn/ui primitives (`npx shadcn add <name>`) and Tailwind. Treat `components/ui/` as vendored and keep edits minimal.
- **Env vars:** add new ones to the schema in `lib/env.ts` and to `.env.example`. Don't read `process.env` elsewhere.
- **Next.js 16:** middleware is now `proxy.ts`. `cookies()`/`headers()`/`params` are async.

## Supabase

- Pick the client for the context:
  - Client Components → `@/lib/supabase/client`
  - Server Components, Server Actions, Route Handlers → `@/lib/supabase/server`
  - Proxy only → `@/lib/supabase/proxy`
- Use `supabase.auth.getClaims()` (or `getUser()`) for auth checks on the server, never `getSession()`.
- Schema changes go through migrations (`npm run db:migration <name>`), never through Studio on a hosted project.
- **Every table has RLS enabled with explicit policies.** Write `(select auth.uid())` in policies. Functions use `set search_path = ''`.
- After a schema change, run `npm run db:reset && npm run db:types` and commit `types/database.ts`. CI checks for drift.
- Migrations deploy to production on merge to `main` before the app deploys, so they must be backwards-compatible.

## Before committing

`npm run format:check && npm run lint && npm run typecheck && npm run test:coverage && npm run build`
(e2e: `npm run db:start && npm run build && npm run test:e2e`)
