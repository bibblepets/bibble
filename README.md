# Bibble

The all-in-one pet marketplace: browse pets for sale or adoption, plus accessories and services.

## Stack

- **App:** [Next.js 16](https://nextjs.org) (App Router, Turbopack, React Compiler), TypeScript, Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com)
- **Backend:** [Supabase](https://supabase.com) (Postgres, Auth, Storage) via `@supabase/ssr`
- **Hosting:** [Vercel](https://vercel.com), deployed by GitHub Actions
- **Testing:** Vitest + Testing Library (unit), Playwright (e2e)

## Prerequisites

- Node.js 24 (`nvm use` reads `.nvmrc`)
- Docker Desktop, running (the local Supabase stack runs in containers)

The Supabase CLI is a dev dependency, so you don't need a global install.

## Quickstart

```bash
npm install
npm run db:start               # start local Supabase; applies migrations and seed.sql
cp .env.example .env.local     # local Supabase defaults; no edits needed
npm run dev                    # http://localhost:3000
```

| Service              | URL                                                     |
| -------------------- | ------------------------------------------------------- |
| App                  | http://localhost:3000                                   |
| Health check         | http://localhost:3000/api/health                        |
| Supabase Studio      | http://127.0.0.1:54323                                  |
| Mailpit (auth email) | http://127.0.0.1:54324                                  |
| Postgres             | postgresql://postgres:postgres@127.0.0.1:54322/postgres |

Seeded dev users: `alice@bibble.test` and `bob@bibble.test`, both with password `password123`.

## Scripts

| Script                    | Description                                         |
| ------------------------- | --------------------------------------------------- |
| `dev` / `build` / `start` | Next.js dev server / production build / serve build |
| `lint` / `lint:fix`       | ESLint                                              |
| `format` / `format:check` | Prettier                                            |
| `typecheck`               | Route type generation + `tsc --noEmit`              |
| `test` / `test:watch`     | Vitest unit tests                                   |
| `test:coverage`           | Unit tests with coverage (80% threshold)            |
| `test:e2e`                | Playwright; needs `db:start` and `build` first      |
| `db:start` / `db:stop`    | Start / stop local Supabase                         |
| `db:status`               | Print local URLs and keys                           |
| `db:reset`                | Recreate the local DB from migrations + seed        |
| `db:migration <name>`     | Create a new migration file                         |
| `db:types`                | Regenerate `types/database.ts` from the local DB    |
| `db:lint`                 | Lint the database schema                            |

A Husky pre-commit hook runs ESLint and Prettier on staged files.

## Project structure

```
app/              Routes (App Router): pages, layouts, route handlers
components/ui/    shadcn/ui primitives (add more with `npx shadcn add <name>`)
lib/env.ts        Zod-validated environment variables
lib/supabase/     Supabase clients: browser, server, and proxy (session refresh)
proxy.ts          Next.js proxy (formerly middleware): refreshes auth sessions
types/database.ts Generated Supabase types; never edit by hand
supabase/         config.toml, migrations/, seed.sql
tests/            unit/ (Vitest) and e2e/ (Playwright)
```

## Database changes

1. `npm run db:migration add_pets`: creates `supabase/migrations/<timestamp>_add_pets.sql`.
2. Write the SQL. **Every table needs RLS enabled and explicit policies.**
3. `npm run db:reset` applies it locally. `npm run db:types` regenerates types.
4. Commit the migration together with `types/database.ts`. CI fails if the types are stale.

Migrations go to production automatically when you merge to `main`. Keep them backwards-compatible, because the previous deployment keeps serving traffic until the new one is live.

## Authentication

Email and password sign-up, with email confirmation required before logging in.

- **Locally**, confirmation and password-reset emails go to Mailpit (http://127.0.0.1:54324). The e2e tests read them from there too. Seeded users are already confirmed.
- **Email links** use `token_hash` and are verified by `app/auth/confirm`, so a link works even when opened on a different device. The templates live in `supabase/templates/` and are wired up in `supabase/config.toml`.
- **Protecting pages and Server Actions:** call `requireUser(returnTo)` from `lib/auth/session.ts` in each one. Layouts don't re-run on navigation, so they must not be the only check.

**Hosted project settings.** `supabase/config.toml` only configures the local stack. Push the auth settings to the hosted project with `npx supabase config push --project-ref <ref>`, or set them in the dashboard to match:

- **Authentication → Sign In / Providers → Email:**
  - confirm email: on
  - minimum password length: 8
  - password requirements: letters and digits
- **Authentication → Emails → Templates:** use the HTML from `supabase/templates/` for "Confirm signup" and "Reset password", with the same subjects as in `config.toml`.
- **Authentication → URL Configuration:** see step 5 of [One-time setup](#one-time-setup). Email links use the **Site URL**, so a confirmation email sent from a preview deploy links to production.

> **Before public launch, set up custom SMTP** (Authentication → Emails → SMTP Settings). Supabase's built-in email only delivers to members of your Supabase project's team, and only a few emails an hour. Real users won't receive confirmation emails until custom SMTP is set up.

## CI/CD

The `CI/CD` workflow (`.github/workflows/cicd.yml`) runs on every PR and every push to `main`:

1. **CI** (`ci.yml`): format, lint, typecheck, unit tests with coverage, and a build. In parallel it starts a fresh local Supabase, lints the schema, checks type drift and runs the e2e smoke tests.
2. **Preview** (PRs only, after CI passes): builds and deploys to Vercel, then comments the URL on the PR.
3. **Production** (pushes to `main`, after CI passes): `supabase db push` to the hosted project, then a Vercel production deploy.

`vercel.json` disables Vercel's own Git deployments, so every deploy goes through this pipeline.

### One-time setup

1. **Supabase:** create a project at supabase.com. Note the project ref and the database password.
2. **Vercel:** create a project from this repo with framework Next.js and Node 24. Run `npx vercel link` locally to get the org and project IDs from `.vercel/project.json`.
3. **Vercel env vars** (Project → Settings → Environment Variables, for Preview and Production):
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://<project-ref>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: from Supabase → Project Settings → API Keys
4. **GitHub secrets** (Settings → Secrets and variables → Actions):

   | Secret                  | Where to find it                                    |
   | ----------------------- | --------------------------------------------------- |
   | `VERCEL_TOKEN`          | Vercel → Account Settings → Tokens                  |
   | `VERCEL_ORG_ID`         | `.vercel/project.json` → `orgId`                    |
   | `VERCEL_PROJECT_ID`     | `.vercel/project.json` → `projectId`                |
   | `SUPABASE_ACCESS_TOKEN` | Supabase → Account → Access Tokens                  |
   | `SUPABASE_PROJECT_ID`   | Supabase project ref (in the dashboard URL)         |
   | `SUPABASE_DB_PASSWORD`  | The database password set when creating the project |

5. **Supabase Auth URLs:** set Site URL to the production domain, and add `https://*.vercel.app/**` to the redirect URLs for previews.
6. (Recommended) Add required reviewers to the `production` GitHub environment, and protect `main` so the `CI/CD` checks must pass.

> Previews currently share the production Supabase project and never run migrations, so a PR that changes the schema is previewed against the old schema. Verify schema changes locally and in CI (which applies every migration to a fresh database). Before real user data exists, add a separate staging project for previews.
