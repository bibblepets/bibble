# Plan: PR 2 – Authentication

**Source**: [v1-roadmap.md](v1-roadmap.md)
**Depends on**: PR 1 (header and user menu)
**Complexity**: Medium

> **As built:** the Server Actions live in `lib/auth/actions.ts` (not `app/(auth)/actions.ts`) because the header's user menu also imports `logOut`. Sonner was dropped: confirmations get their own pages, and it would have pulled in `next-themes`. Email links always use the Site URL, so `next` is fixed per template (`/` and `/reset-password`). The mobile tab bar hides "Log in" when signed in.

## Summary

Email and password authentication with email confirmation: sign up, confirm, log in, log out, forgot password and reset password. Adds a server-only session helper (`getCurrentUser` / `requireUser`), which later PRs use for every protected page and action. The header shows who is signed in.

## Patterns to mirror

| Category         | Source                                         | Pattern                                                                                                       |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Supabase client  | `lib/supabase/server.ts`                       | `await createClient()` per request in Server Actions, Route Handlers and Server Components                    |
| Auth checks      | `CLAUDE.md`                                    | `getClaims()` on the server, never `getSession()`                                                             |
| Redirect targets | `lib/redirect.ts`                              | Every `?next=` goes through `safeRedirectUrl`                                                                 |
| Route handler    | `app/auth/callback/route.ts`                   | Thin handler; failures redirect to `/auth/error`                                                              |
| Forms            | Next docs `01-app/02-guides/authentication.md` | `<form action>` + Server Action + `useActionState`, with zod validation on the server                         |
| Auth in layouts  | Same doc, "Layouts and auth checks"            | Layouts only _read_ the user, for the header, inside `<Suspense>`. Access checks happen in pages and actions. |

## Design

- **Confirmation links use `token_hash`, not PKCE codes.** A new `app/auth/confirm/route.ts` calls `verifyOtp({ type, token_hash })`. This lets a user sign up on a laptop and confirm on their phone; the existing PKCE `code` flow only works in the same browser. `app/auth/callback` stays for future OAuth.
- **Email templates are committed.** `supabase/templates/confirmation.html` and `recovery.html` link to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=…&next=…`. They're wired up in `config.toml` and pushed to the hosted project with `supabase config push`.
- **Password reset:** the recovery link goes through `/auth/confirm?type=recovery&next=/reset-password`. Verifying signs the user in, and `/reset-password` then calls `updateUser({ password })`.
- **No account enumeration.** Sign-up with an email that already exists and forgot-password with an unknown email both show the same "check your inbox" screen. Supabase already hides whether an account exists for sign-up when confirmations are on.
- **One form-result type.** `lib/forms.ts` defines `ActionState = { fieldErrors?, formError?, values? }`, which every form in later PRs reuses. On an error, `values` gives the form back its fields except the password.
- **Password rules:** at least 8 characters with letters and digits (`password_requirements = "letters_digits"`). The same rule is in zod so errors show before the round trip.

## Files to change

| File                                                    | Action | Why                                                                                                                                                                                 |
| ------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supabase/config.toml`                                  | UPDATE | `enable_confirmations = true`, `minimum_password_length = 8`, `password_requirements = "letters_digits"`, `[auth.email.template.confirmation]` and `[auth.email.template.recovery]` |
| `supabase/templates/confirmation.html`, `recovery.html` | CREATE | Branded emails with `token_hash` links                                                                                                                                              |
| `app/auth/confirm/route.ts`                             | CREATE | `verifyOtp`, then redirect to the safe `next` or `/auth/error`                                                                                                                      |
| `lib/auth/otp.ts`                                       | CREATE | `parseConfirmParams(searchParams)`, which validates `type` and `token_hash` (unit-tested; the route itself is excluded from coverage)                                               |
| `lib/auth/schema.ts`                                    | CREATE | zod: `signUpSchema` (display name 1–80 characters, email, password), `logInSchema`, `forgotPasswordSchema`, `resetPasswordSchema` (passwords must match)                            |
| `lib/auth/errors.ts`                                    | CREATE | Supabase `AuthError.code` → friendly message (`invalid_credentials`, `email_not_confirmed`, `weak_password`, `over_email_send_rate_limit`, fallback)                                |
| `lib/auth/session.ts`                                   | CREATE | `import "server-only"`. `getCurrentUser = cache(...)` uses `getClaims()` and returns `{ id, email, displayName }` or null. `requireUser(next)` redirects to `/login?next=…`         |
| `lib/forms.ts`                                          | CREATE | `ActionState` type + `fieldErrorsFrom(zodError)`                                                                                                                                    |
| `app/(auth)/layout.tsx`                                 | CREATE | Simple header with the logo; content centred on a card, like Airbnb's login screen                                                                                                  |
| `app/(auth)/actions.ts`                                 | CREATE | `signUp`, `logIn`, `logOut`, `requestPasswordReset`, `resetPassword`                                                                                                                |
| `app/(auth)/login/page.tsx` + `login-form.tsx`          | CREATE | Login form; `?next=` is passed through; "Forgot password?" link                                                                                                                     |
| `app/(auth)/signup/page.tsx` + `signup-form.tsx`        | CREATE | Display name, email and password                                                                                                                                                    |
| `app/(auth)/check-email/page.tsx`                       | CREATE | "We've sent you a link" (shared by sign-up and forgot-password)                                                                                                                     |
| `app/(auth)/forgot-password/page.tsx` + form            | CREATE |                                                                                                                                                                                     |
| `app/(auth)/reset-password/page.tsx` + form             | CREATE | Calls `requireUser`; signed in through the recovery link                                                                                                                            |
| `components/layout/user-menu.tsx`                       | UPDATE | Takes `user` as a prop. Signed in: initials avatar, name, "Become a seller" and "Log out" (a form that posts to `logOut`)                                                           |
| `components/layout/site-header.tsx`                     | UPDATE | `<Suspense>` around a small async component that calls `getCurrentUser()` and renders `UserMenu`                                                                                    |
| `components/ui/{label,sonner}.tsx`                      | CREATE | via `npx shadcn add`                                                                                                                                                                |
| `package.json`                                          | UPDATE | Add `server-only`                                                                                                                                                                   |
| `README.md`                                             | UPDATE | Hosted Supabase auth settings to mirror (confirmations, templates, Site URL, redirect URLs) and the email limit below                                                               |
| `tests/unit/auth-*.test.ts`                             | CREATE | Schemas, error mapping, OTP params, session helper (with `createClient` mocked)                                                                                                     |
| `tests/e2e/auth.spec.ts`                                | CREATE | Full flows, reading emails from the local Mailpit                                                                                                                                   |

## Tasks

1. **Schemas and helpers first (TDD).** Write `lib/auth/schema.ts`, `errors.ts`, `otp.ts` and `lib/forms.ts`, with tests, before any UI.
   - Validate: `npm run test`.
2. **Session helper.** Write `lib/auth/session.ts` and unit-test it with a mocked `createClient` (no claims → null; claims → user DTO; `requireUser` redirects with an encoded `next`).
3. **Supabase config and templates.** Update `config.toml`, add the templates, then run `npm run db:reset`. Sign up by hand and check that the email appears in Mailpit (`http://127.0.0.1:54324`) with a `/auth/confirm` link.
4. **Confirm route.** Write `app/auth/confirm/route.ts`. Check by hand that an expired or reused link goes to `/auth/error`.
5. **Actions and pages.** Build the `(auth)` route group with `useActionState` forms (pending state disables the submit button; errors are linked to fields with `aria-describedby`). `logIn` redirects with `safeRedirectUrl(next)`. `logOut` redirects to `/`.
6. **Header.** Show the signed-in state, with the user read inside `<Suspense>` so the page shell isn't held back.
7. **E2E tests**, each using a fresh `e2e+<uuid>@bibble.test` address:
   - Sign up, see check-email, confirm through the Mailpit link, land signed in with the name in the menu.
   - Log out, log back in, and a wrong password shows an error.
   - Logging in before confirming shows the "confirm your email" message.
   - Forgot password, follow the Mailpit link, set a new password, and the new password works.
   - A `?next=` pointing at another site is ignored.
8. **Docs.** README section on hosted auth settings.

## Validation

```bash
npm run format:check && npm run lint && npm run typecheck && npm run test:coverage && npm run build
npm run db:reset && npm run test:e2e
```

## Risks

| Risk                                                                                                                                                                     | Likelihood          | Mitigation                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supabase's built-in email only sends to members of the project's team and has a very low hourly limit**, so real users won't receive confirmation emails in production | Certain once public | Fine for internal testing. **Custom SMTP must be set up before public launch**; it's a dashboard setting with no code change. Recorded in the README. |
| Hosted templates and settings drift from `config.toml`                                                                                                                   | Med                 | Apply with `supabase config push`; checklist in the README                                                                                            |
| E2E tests depend on Mailpit's API format                                                                                                                                 | Low                 | Keep the Mailpit helper in one file under `tests/e2e/helpers/`                                                                                        |
| Seed users (alice, bob) are already confirmed                                                                                                                            | –                   | No change needed; they're inserted with `email_confirmed_at`                                                                                          |
| Header reading cookies makes every marketplace page dynamic                                                                                                              | Low                 | Expected for a signed-in app; `<Suspense>` keeps the first byte fast                                                                                  |

## Acceptance

- [ ] A user can sign up, confirm, log in, log out and reset their password, locally and with links that work across devices
- [ ] No page or message reveals whether an email is registered
- [ ] `requireUser()` is the single way to protect pages and actions in later PRs
- [ ] All validation commands pass, including the new e2e tests
