# Plan: PR 3 – Seller accounts and onboarding (3a + 3b)

**Source**: [v1-roadmap.md](v1-roadmap.md), [research-sg-pet-sale-rules.md](research-sg-pet-sale-rules.md)
**Depends on**: PR 2 (`requireUser`, form helpers)
**Complexity**: Large, so split into two PRs:

- **3a – Seller schema, Storage and pgTAP** (Medium): migration, seed data, database tests in CI, generated types, `lib/sellers` data layer. No UI.
- **3b – Onboarding wizard and seller dashboard** (Medium/Large): the step-by-step "Become a seller" flow, document upload, dashboard, profile edit, header switch.

## Decisions (agreed 2026-10-02)

| Topic              | Decision                                                                                                                                                                                                                                                                |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seller types in v1 | **`pet_shop`** and **`breeder`**. The type is generic; what a seller may sell is the species their AVS licence covers, recorded in `seller_species` (only dogs in v1). `animal_shelter` is added with adoption by widening a `check` constraint (backwards-compatible). |
| Required documents | **AVS licence and ACRA BizFile**, both required before submitting for verification.                                                                                                                                                                                     |
| Onboarding UX      | **Airbnb-style step wizard** with a progress bar and Back/Next footer. Every step saves, so sellers can leave and resume.                                                                                                                                               |
| Verified details   | **Locked** after verification: `seller_type`, `legal_name`, `uen` and `licence_no` can only be changed by an admin. Display name, bio, location, contact details and licence expiry stay editable.                                                                      |

## Patterns to mirror

| Category            | Source                                                 | Pattern                                                                                                                                                       |
| ------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Migration           | `supabase/migrations/20261001141710_init_profiles.sql` | Comment on each table; RLS on; `(select auth.uid())`; functions `set search_path = ''`; reuse `public.set_updated_at()`; revoke execute on internal functions |
| Server Actions      | `lib/auth/actions.ts`                                  | zod `safeParse` → `ActionState` (`fieldErrors`/`formError`/`values`) → `redirect` on success                                                                  |
| Session             | `lib/auth/session.ts`                                  | `cache()`-memoised getter + `require*()` that redirects                                                                                                       |
| Forms               | `components/forms/*`, `app/(auth)/*/…-form.tsx`        | `useActionState`, `Field`, `FormAlert`, `SubmitButton`                                                                                                        |
| Header session data | `components/layout/user-menu-slot.tsx`                 | Async slot inside `<Suspense>`                                                                                                                                |
| Tests               | `tests/unit/auth-*.test.ts`, `tests/e2e/auth.spec.ts`  | Mocked Supabase in unit tests; real sign-up through Mailpit in e2e                                                                                            |
| pgTAP               | none in repo                                           | **New pattern:** `supabase/tests/database/*.test.sql`, run by `supabase test db`                                                                              |

## PR 3a – Seller schema, Storage and pgTAP

### Data model

```
planning_areas (id, slug, name, region)            -- URA's 55 planning areas; reference data, in the migration
platform_admins (user_id)                          -- granted via SQL only; admin UI is PR 4

sellers
  id, slug (unique, for a public URL later)
  entity_type     'business' | 'individual'        -- only 'business' can be created in v1
  seller_type     'pet_shop' | 'breeder'          -- 'animal_shelter' added with adoption
  display_name    trading name shown on listings
  legal_name      as registered with ACRA
  uen             unique
  licence_no, licence_expires_on                   -- AVS; shown publicly on listings (legal requirement)
  about           public bio, max 1,000 characters
  planning_area_id → planning_areas                -- public location ("Tampines, East")
  verification_status 'incomplete' | 'pending' | 'verified' | 'rejected' | 'suspended'
  submitted_at, verified_at, created_at, updated_at
  check: status = 'incomplete' OR all required fields are present

seller_private_details (seller_id PK)              -- members + admins only
  address_line1, address_line2, postal_code (6 digits), contact_phone (+65), contact_email

species (id, slug, name)                         -- moved here from PR 5; seeded with 'dog' (and 'cat', not yet listable)
seller_species (seller_id, species_id)           -- species the licence covers; members + admins write while unverified

seller_members (seller_id, user_id, role 'owner' | 'staff')
  unique(user_id)                                  -- one seller per user in v1; dropping it later is safe

seller_documents (id, seller_id, kind 'avs_licence' | 'acra_bizfile', storage_path, file_name,
                  content_type, size_bytes, uploaded_by, created_at)
```

### Design decisions

- **Seller status flow:** `incomplete` (wizard in progress) → `pending` (submitted) → `verified` / `rejected`, with `suspended` for later takedowns. A rejected seller fixes the problem and resubmits, going back to `pending`.
- **Saving as you go:** the seller row is created at wizard step 1 with just `seller_type`. A check constraint requires the business fields only once the status moves past `incomplete`, so partial saves are allowed and a submitted seller can't be missing anything.
- **"Can this seller list?"** is one database function, `seller_can_list(seller_id, species_id)`: status is `verified`, `licence_expires_on >= current_date`, **and** the species is in `seller_species`. An expired licence blocks new listings without a scheduled job, and a dog breeder can't list cats.
- **Seller type vs species:** `seller_type` says what kind of business it is; `seller_species` says what its licence covers. AVS licenses breeding per species and lists each pet shop's approved animal groups, so admins verify `seller_species` against the licence. Breeder-specific rules (only animals they bred) are enforced on listings in PR 5.
- **Writes go through database functions:**
  - `create_seller(seller_type)` inserts the seller, the owner membership and an empty private-details row in one transaction. It refuses a second seller for the same user.
  - `submit_seller_for_verification(seller_id)` checks the required fields and both documents, then sets `pending` and `submitted_at`.
  - Clients have no insert grant on `sellers`.
  - Column grants limit updates to the editable fields. `verification_status`, `verified_at`, `slug` and `entity_type` can't be written by sellers.
- **Locked fields:** a trigger blocks changes to `seller_type`, `legal_name`, `uen` and `licence_no`, and to `seller_species` rows, once a seller is verified or suspended, unless an admin makes them.
- **Who sees what:**
  - Sellers are publicly readable only when verified. Members and admins can always read their own.
  - Private details and documents: members and admins only.
- **Format checks for UEN and licence numbers live in zod, not the database.** The licence formats are inferred from AVS registries rather than published, so a wrong guess should be a code fix, not a migration.
- **Storage:**
  - A private `seller-documents` bucket, created in the migration so it exists in production (`on conflict do nothing`). Files are PDF, JPEG or PNG, up to 10 MB, stored at `{seller_id}/{uuid}.{ext}`.
  - Storage policies: members can insert and read files in their own seller's folder; admins can read everything; nobody can update or delete in v1, so the audit trail stays intact.
  - Uploads go **straight from the browser to Storage**, checked by Storage RLS, to avoid the 1 MB Server Action body limit. A Server Action then checks the object exists and records it in `seller_documents`. The latest row per kind counts.
- **Separate document tables per owner** (`seller_documents` now, `listing_documents` in PR 5) instead of the roadmap's single polymorphic `documents` table.
- **Seed data:**
  - `carol@bibble.test` becomes a platform admin.
  - alice owns "Pawsome Kennels", a verified breeder licensed for dogs, with a licence valid for one year.
  - dave (new) owns "Happy Paws Pet Shop", a verified pet shop licensed for dogs.
  - bob has no seller.

### Files

| File                                                                  | Action | Why                                                                                                                                                                                             |
| --------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supabase/migrations/<ts>_create_sellers.sql`                         | CREATE | Everything above                                                                                                                                                                                |
| `supabase/seed.sql`                                                   | UPDATE | Seed users and sellers above                                                                                                                                                                    |
| `supabase/tests/database/sellers.test.sql`, `seller_storage.test.sql` | CREATE | pgTAP                                                                                                                                                                                           |
| `.github/workflows/ci.yml`, `package.json`                            | UPDATE | `db:test` script; CI step after "Lint database schema"                                                                                                                                          |
| `types/database.ts`                                                   | UPDATE | `npm run db:types`                                                                                                                                                                              |
| `lib/sellers/schema.ts`                                               | CREATE | zod per wizard step: UEN, licence number per seller type (`AS…` for pet shops, `BR…` for breeders), at least one species, licence expiry in the future, SG postal code, SG phone, planning area |
| `lib/sellers/queries.ts`                                              | CREATE | `getCurrentSeller = cache(…)` (seller + private details + latest documents), `requireSeller()`, `listPlanningAreas()`                                                                           |
| `lib/sellers/progress.ts`                                             | CREATE | Pure: which wizard steps are complete, the next step to resume at, and dashboard status copy                                                                                                    |
| `tests/unit/sellers-*.test.ts`                                        | CREATE | Schema, progress, queries                                                                                                                                                                       |
| `README.md`                                                           | UPDATE | `db:test`; how to make someone an admin                                                                                                                                                         |

### pgTAP coverage

- **Visibility:** anonymous users and other users can't see an `incomplete` or `pending` seller; everyone can see a verified seller's public columns.
- **Private data:** a member can read their own private details and documents; another user can't.
- **Writes:**
  - direct insert into `sellers` fails
  - `create_seller` refuses a second seller for the same user
  - a seller can't update `verification_status` or `slug` (checked with `has_column_privilege` and real updates)
- **Locking and submission:**
  - locked fields can't change after verification
  - `submit_seller_for_verification` fails with a field or document missing, and succeeds when everything is present
- **`seller_can_list`:** false when pending, verified with an expired licence, suspended, or for a species the seller isn't licensed for.
- **Storage:** a user can't upload into or read another seller's folder; an admin can read any seller's files; updates and deletes are refused.

## PR 3b – Onboarding wizard and seller dashboard

### Wizard

Full-screen, Airbnb-style. A minimal header has the logo and **"Save & exit"**. Each step has a heading and a short explanation. A sticky footer has a progress bar, a **Back** link and a **Next** button that saves the step through a Server Action.

| Step  | Route                          | Content                                                                                                                                                                                              |
| ----- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Intro | `/seller/onboarding`           | "Sell on Bibble": three stages (your business → your documents → review), and why verification matters. **Get started** (or **Continue** if a seller exists, resuming at the first incomplete step). |
| 1     | `/seller/onboarding/type`      | Pet shop or breeder, as large selectable cards explaining the licence each needs, plus "Which animals does your licence cover?" (Dogs; Cats shown as coming soon). Creates the seller.               |
| 2     | `/seller/onboarding/business`  | Trading name, legal name (ACRA), UEN, AVS licence number and expiry. The licence number hint and format depend on the type.                                                                          |
| 3     | `/seller/onboarding/location`  | Address, postal code, planning area (with a live preview: "Buyers will see: Tampines, East"), contact phone and email (email prefilled from the account), optional bio.                              |
| 4     | `/seller/onboarding/documents` | Two upload tiles (AVS licence, ACRA BizFile), with type and size checked before upload, a progress bar, and re-upload.                                                                               |
| 5     | `/seller/onboarding/review`    | Summary with an **Edit** link per section, then **Submit for verification**.                                                                                                                         |

- **Guards:** every step calls `requireUser`. Steps 2–5 need a seller in status `incomplete` or `rejected`, and otherwise go to `/seller`. Opening a later step with earlier steps unfinished goes to the first unfinished step (from `lib/sellers/progress.ts`).
- **After a rejection:** the wizard reopens with the admin's reason (from PR 4) shown at the top of the review step.

### Dashboard and profile

| Route                | Behaviour                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/seller`            | `requireSeller` (no seller → `/seller/onboarding`). A status banner: incomplete ("Finish setting up", linked to the wizard), pending ("We're reviewing your details, usually within 2 working days"), rejected (reason, linked to the wizard), verified, suspended. Business summary, documents list, and licence-expiry warning within 30 days. Listings arrive in PR 5. |
| `/seller/profile`    | Edits the always-editable fields. Locked fields are shown read-only with "Contact support to change".                                                                                                                                                                                                                                                                     |
| Header and user menu | "Become a seller" becomes **"Switch to selling"** → `/seller` once the user has a seller.                                                                                                                                                                                                                                                                                 |

### Files

| File                                                                          | Action | Why                                                                                                                           |
| ----------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `lib/sellers/actions.ts`                                                      | CREATE | `startSeller`, `saveBusinessStep`, `saveLocationStep`, `recordSellerDocument`, `submitForVerification`, `updateSellerProfile` |
| `app/seller/onboarding/layout.tsx` + step folders                             | CREATE | Wizard shell and steps                                                                                                        |
| `components/seller/wizard-footer.tsx`, `wizard-header.tsx`                    | CREATE | Progress bar, Back/Next, Save & exit                                                                                          |
| `components/seller/seller-type-cards.tsx`                                     | CREATE | Radio-group cards                                                                                                             |
| `components/seller/document-upload.tsx`                                       | CREATE | Client: browser-client Storage upload, then a Server Action                                                                   |
| `app/seller/layout.tsx`, `app/seller/page.tsx`, `app/seller/profile/page.tsx` | CREATE | Dashboard and profile                                                                                                         |
| `components/seller/status-banner.tsx`                                         | CREATE | Copy from `lib/sellers/progress.ts`                                                                                           |
| `components/layout/*`                                                         | UPDATE | "Switch to selling"                                                                                                           |
| `components/ui/{radio-group,select,textarea,badge,progress}.tsx`              | CREATE | via `npx shadcn add`                                                                                                          |
| `tests/unit/sellers-*.test.tsx`                                               | CREATE | Actions, pages, components                                                                                                    |
| `tests/e2e/seller-onboarding.spec.ts` + `tests/e2e/fixtures/*.pdf`            | CREATE | Journeys below                                                                                                                |

### E2E

1. **Full onboarding:** a new user signs up through Mailpit → Become a seller → intro → type → business → location → **Save & exit** → returning to `/seller/onboarding` resumes at the documents step → uploads two fixture PDFs → review → submit → the dashboard shows "We're reviewing".
2. **Validation:** an invalid UEN, a licence number in the wrong format for the type, and an expired licence date are each flagged on the field.
3. **Guards:** a signed-out visit to `/seller` goes to `/login?next=%2Fseller`. A pending seller opening `/seller/onboarding/business` is sent to `/seller`.
4. **Verified seller:** alice sees the verified banner, "Switch to selling", and locked fields on `/seller/profile`.
5. **Mobile:** the wizard footer stays usable at 390px.

## Validation

```bash
npm run db:reset && npm run db:lint && npm run db:test && npm run db:types
npm run format:check && npm run lint && npm run typecheck && npm run test:coverage && npm run build
npm run test:e2e
```

## Risks

| Risk                                                                | Likelihood | Mitigation                                                                                            |
| ------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| RLS or Storage policy mistakes expose licences or addresses         | Med        | pgTAP tests for every policy, including Storage. Private details are in their own table.              |
| Supabase's default table privileges undo the column grants          | Med        | Explicitly `revoke insert, update` then `grant update (…)`; pgTAP asserts with `has_column_privilege` |
| The "only required after submit" check lets bad data through        | Low        | Same check in the constraint and in `submit_seller_for_verification`; pgTAP covers both               |
| A guessed licence format rejects a real seller                      | Med        | zod only (easy to change); the error message suggests contacting support                              |
| An upload succeeds but recording it fails, leaving an orphaned file | Low        | Harmless (private, no row); a re-upload records a new one. Clean-up can come later.                   |
| Wizard state drifts from the database                               | Low        | Progress is always worked out from the database (`progress.ts`), never stored in the client           |

## Acceptance

- [ ] 3a: schema, Storage and pgTAP merged; CI runs `db:test`; types regenerated
- [ ] 3b: a signed-in user can complete the wizard across sessions, upload both documents privately and submit; the dashboard reflects every status
- [ ] Unverified sellers are invisible to the public; verified ones expose only public fields
- [ ] Verified sellers can't change locked fields
- [ ] All validation commands pass
