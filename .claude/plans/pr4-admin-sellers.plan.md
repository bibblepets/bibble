# Plan: PR 4 – Admin console and seller verification

**Source**: [v1-roadmap.md](v1-roadmap.md), [research-sg-pet-sale-rules.md](research-sg-pet-sale-rules.md), [pr3-sellers.plan.md](pr3-sellers.plan.md)
**Depends on**: #10 (seller onboarding); branch from it, or from `main` once it's merged
**Complexity**: Medium/Large

## Summary

Platform admins get an `/admin` area to work through the seller verification queue:

- See each pending seller's full details, including private ones.
- Open their uploaded licence and ACRA BizFile.
- Tick through a verification checklist.
- **Approve**, **reject** (with a reason the seller sees) or later **suspend** and **reinstate**.

Every decision is recorded in an audit trail. Sellers see the outcome, and any message, on their dashboard and in the wizard. The listing review queue joins this console in PR 6.

> **As built:**
>
> - **Opening documents:** a route handler (`/admin/documents/[id]`) checks admin access and redirects to the 60-second signed URL. That avoids popup blockers and keeps the link a plain `<a target="_blank">`.
> - **Checklist storage:** the ticked keys are stored as `text[]`, not jsonb. `seller_reviews.created_at` defaults to `clock_timestamp()`, so decisions in one transaction still order correctly.
> - **Unique field ids:** `FieldShell` ids now come from `useId()`. The decision panel and correction form both have an `internalNote` field, and name-based ids pointed one form's label at the other's textarea.
> - **Admin layout:** shows its chrome only to admins. Everyone else gets the bare page, which redirects or 404s.

## Decisions (agreed 2026-10-02)

| Topic             | Decision                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin corrections | **In scope.** A small form on the seller detail page for the locked fields (type, legal name, UEN, licence number, licensed species). It needs an internal note and is recorded as `details_corrected`. |
| Checklist         | **Required.** Approve stays disabled until all checks are ticked, and the database function refuses an incomplete checklist. The ticks are stored with the decision.                                    |
| Seller emails     | **Not yet.** Sellers see the outcome on the dashboard. Decision emails come with the email provider and custom SMTP needed before launch.                                                               |

## Patterns to mirror

| Category                | Source                                                  | Pattern                                                                                                                       |
| ----------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Migration and functions | `supabase/migrations/20261001171518_create_sellers.sql` | Security definer functions that check permissions themselves, raise snake_case codes, `set search_path = ''`, explicit grants |
| Error codes → copy      | `lib/sellers/errors.ts`                                 | Map raised codes to user-facing messages                                                                                      |
| Page guards             | `lib/sellers/wizard.ts`, `requireSeller`                | `require*()` helpers that redirect or 404                                                                                     |
| Actions                 | `lib/sellers/actions.ts`                                | zod → `ActionState` → `revalidatePath` + `redirect`                                                                           |
| Forms                   | `components/forms/*`                                    | `Field`, `TextareaField`, `FormAlert`, `SubmitButton`                                                                         |
| Read-only details       | `components/seller/seller-summary.tsx`                  | Reuse for the admin detail page                                                                                               |
| pgTAP                   | `supabase/tests/database/sellers.test.sql`              | Act as owner, stranger, anon and admin with `set local role` and JWT claims                                                   |

## Data model (new migration, since #9 is deployed)

```
seller_reviews (
  id, seller_id → sellers, reviewer_id → auth.users,
  decision        'approved' | 'rejected' | 'suspended' | 'reinstated' | 'details_corrected',
  message         text   -- shown to the seller; required for rejected and suspended
  internal_note   text   -- admins only
  checklist       jsonb  -- which checks were ticked when approving
  created_at
)
```

- **Admin-only table.** Sellers never read `seller_reviews` directly, because RLS can't hide one column (`internal_note`) from them. Instead `get_seller_feedback(seller_id)` (security definer, members and admins only) returns the latest decision's `decision`, `message` and `created_at`.
- **`review_seller(p_seller_id, p_decision, p_message, p_internal_note, p_checklist)`** (security definer, admins only) is the single place statuses change:

  | Decision     | From        | To          | Also                                                                                 |
  | ------------ | ----------- | ----------- | ------------------------------------------------------------------------------------ |
  | `approved`   | `pending`   | `verified`  | Sets `verified_at`. Needs every checklist item ticked.                               |
  | `rejected`   | `pending`   | `rejected`  | Message required. The seller can fix things and resubmit (existing flow).            |
  | `suspended`  | `verified`  | `suspended` | Message required. `seller_can_list` is already false, so PR 6/7 hide their listings. |
  | `reinstated` | `suspended` | `verified`  | Optional message                                                                     |

  Any other transition raises `invalid_transition`. A non-admin caller raises `not_an_admin`. The status change and the audit row are written in one transaction.

- **`admin_correct_seller(...)`**: an admin changes locked fields (type, legal name, UEN, licence number, licensed species), recorded as `details_corrected` with an internal note. The existing lock trigger already exempts admins.
- **Checklist items** are defined in code (`lib/admin/checklist.ts`) and stored by key, so the wording can change without a migration:
  1. Licence number is in the current AVS registry and not revoked.
  2. Registry name and address match ACRA BizFile and the details given.
  3. Licence covers the species and seller type (shop vs breeder).
  4. Licence expiry date matches the uploaded licence.
  5. UEN and registered name match the BizFile.
  6. Documents are legible, current and unaltered.

## Routes and UI

Admin pages use a separate `(admin)` route group with a plain, dense layout: a header reading "Bibble Admin", a sidebar with **Sellers** (Listings arrives in PR 6), and a link back to the site.

| Route                           | Behaviour                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/admin`                        | Redirects to `/admin/sellers`                                                                                                                                                                                                                                                                                                                                                                                  |
| `/admin/sellers?status=pending` | Tabs with counts: **Pending** (default, oldest submission first, with time waiting), Verified, Rejected, Suspended, Incomplete. Table: trading name, type, UEN, licence number, area, submitted. Row links to the detail page.                                                                                                                                                                                 |
| `/admin/sellers/[id]`           | Left column: the full `SellerSummary` (including private address and contact), the owner's account email, and both documents with **Open** (a 60-second signed URL in a new tab). Quick links to the AVS pet shop or breeder registry for the licence check. Right column (sticky): the **decision panel** for the current status, and the **review history** (decision, admin, time, message, internal note). |
| Seller side                     | Dashboard banner and wizard review step show the latest message for rejected or suspended sellers: "Reason: …"                                                                                                                                                                                                                                                                                                 |
| Header                          | Admins get an **Admin** item in the user menu                                                                                                                                                                                                                                                                                                                                                                  |

**Access:**

- Every admin page and action calls `requireAdmin()` (`lib/admin/session.ts`), which runs `requireUser` and then `rpc('is_platform_admin')`.
- Signed-out users go to log in; signed-in non-admins get **404**, so the console isn't advertised.
- The database functions check admin status again, so the UI isn't the only guard.

## Files

| File                                                                                    | Action | Why                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `supabase/migrations/<ts>_seller_reviews.sql`                                           | CREATE | `seller_reviews`, RLS (admin select only), `review_seller`, `get_seller_feedback`, `admin_correct_seller`, grants                                                                                |
| `supabase/tests/database/seller_reviews.test.sql`                                       | CREATE | pgTAP: every transition, invalid transitions, non-admin refusal, required messages and checklist, audit rows, feedback visibility (owner yes, stranger no, no internal notes), admin corrections |
| `supabase/seed.sql`                                                                     | UPDATE | A **pending** seller (eve, with documents) so the queue isn't empty locally, plus a seeded document object                                                                                       |
| `types/database.ts`                                                                     | UPDATE | Regenerated                                                                                                                                                                                      |
| `lib/admin/session.ts`                                                                  | CREATE | `isPlatformAdmin()` (cached), `requireAdmin(returnTo)`                                                                                                                                           |
| `lib/admin/queries.ts`                                                                  | CREATE | `listSellersForReview(status)`, `countSellersByStatus()`, `getSellerForReview(id)` (seller, owner email via a definer function, documents, history), `signedDocumentUrl(path)`                   |
| `lib/admin/checklist.ts`                                                                | CREATE | Checklist keys and wording                                                                                                                                                                       |
| `lib/admin/actions.ts`                                                                  | CREATE | `reviewSeller`, `openSellerDocument`, `correctSellerDetails`                                                                                                                                     |
| `lib/admin/schema.ts`                                                                   | CREATE | zod: message required for reject and suspend, every checklist key required to approve                                                                                                            |
| `lib/sellers/queries.ts`                                                                | UPDATE | `getSellerFeedback()`                                                                                                                                                                            |
| `app/(admin)/admin/layout.tsx`, `page.tsx`, `sellers/page.tsx`, `sellers/[id]/page.tsx` | CREATE | Console                                                                                                                                                                                          |
| `components/admin/*`                                                                    | CREATE | `AdminShell`, `StatusTabs`, `SellersTable`, `DecisionPanel`, `ReviewHistory`, `DocumentLink`                                                                                                     |
| `components/seller/status-banner.tsx`, review step                                      | UPDATE | Show the feedback message                                                                                                                                                                        |
| `components/layout/user-menu*.tsx`                                                      | UPDATE | Admin link                                                                                                                                                                                       |
| `components/ui/{table,tabs,badge}.tsx`                                                  | CREATE | via `npx shadcn add`                                                                                                                                                                             |
| Tests                                                                                   | CREATE | Unit tests for schema, session, queries, actions, pages and components. E2E below.                                                                                                               |

## E2E

1. **Approve:** a new user onboards and submits (reusing the 3b helpers). carol opens `/admin/sellers`, finds them under Pending, opens the detail page, opens a document (signed URL returns 200), ticks the checklist and approves. The seller then sees "You're verified".
2. **Reject and resubmit:** carol rejects the seeded pending seller (eve) with a reason. eve sees "Reason: …" on the dashboard and in the wizard, fixes a detail and resubmits, which puts her back in the Pending queue.
3. **Suspend and reinstate:** carol suspends dave with a message; dave's banner shows it; carol reinstates.
4. **Access:** bob gets 404 on `/admin`; a signed-out visit goes to log in; approving with the checklist incomplete is refused.

## Validation

```bash
npm run db:reset && npm run db:lint && npm run db:test && npm run db:types
npm run format:check && npm run lint && npm run typecheck && npm run test:coverage && npm run build
npm run test:e2e
```

## Risks

| Risk                                        | Likelihood | Mitigation                                                                                                                     |
| ------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| A non-admin reaches admin data or functions | Low        | The database functions check `is_platform_admin()` themselves; pgTAP covers every function as a non-admin; pages return 404    |
| Internal notes leak to sellers              | Low        | Sellers have no select on `seller_reviews`; feedback goes through a function returning only the public fields (pgTAP asserted) |
| Signed document URLs get shared             | Low        | 60-second expiry, created only on click, and only after the admin check                                                        |
| Two admins review the same seller at once   | Low        | `review_seller` locks the row (`for update`) and checks the current status, so the second decision gets `invalid_transition`   |
| Owner email lives in `auth.users`           | –          | Read through an admin-only definer function, never exposed generally                                                           |
| Sellers aren't notified by email            | Certain    | Out of scope (see question 3); the dashboard shows the outcome                                                                 |

## Out of scope

- Listing review (PR 6)
- Email notifications (agreed: with the email provider before launch)
- Granting admin in the UI (SQL only, as agreed)
- Admin search and filters beyond the status tabs
