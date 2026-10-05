# Plan: PR 5 – Listings model and seller CRUD (5a + 5b)

**Source**: [v1-roadmap.md](v1-roadmap.md), [research-sg-pet-sale-rules.md](research-sg-pet-sale-rules.md)
**Depends on**: PR 3 (sellers, `seller_can_list`), PR 4 (admin patterns). Admin listing review is PR 6; the public marketplace is PR 7.
**Complexity**: Large, so split like PR 3:

- **5a – Listings schema, Storage and pgTAP** (Medium/Large): categories, breeds, listings, pet details, health records, private details, documents, status functions, AVS rule checks, seed data with published listings for PR 7, `lib/listings` data layer.
- **5b – Seller listing management UI** (Large): the listings dashboard, a sectioned listing editor, health records, documents, submit, revise and availability actions.

## Summary

Verified sellers can create a dog-for-sale listing, fill in the animal's details, health records, source and vaccination card, and submit it for admin review. Unverified sellers can prepare drafts but not submit. After approval (PR 6), sellers mark listings reserved or sold, or revise them, which takes them off the marketplace until re-approved.

The schema keeps the agreed extensible shape:

- **`listings`:** the shared core for every vertical.
- **One details table per vertical:** `pet_listing_details` for animals.
- **`categories`:** carries the rules (vertical, species, sale or adoption, whether review is needed).
- **AVS rules:** checked by the database when a listing is submitted.

> **As built (5a):**
>
> - **Thresholds:** the AVS thresholds are `constant` declarations at the top of `submit_listing_for_review`, not a separate function. `lib/listings/rules.ts` mirrors them, and a unit test reads the migration to keep the two in sync.
> - **Category slug:** dogs for sale is `dogs`.
> - **Status changes:** `create_listing` sets the breeder source to `bred_on_premises` and leaves pet shops to choose. Categories with `requires_review = false` publish directly on submit (none yet).
> - **Public queries (PR 7) must not embed `pet_listing_private`.** Anonymous users have no grant on it, so PostgREST fails the whole query.
> - **Breeds:** 106 seeded, 21 of them AVS specified dogs (10 Part 1, 11 Part 2). Dogue de Bordeaux and American Bully are left out until AVS's classification is confirmed.

## Decisions (agreed 2026-10-05)

| Topic        | Decision                                                                                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AVS rules    | **Block on submit.** The database refuses submissions that break the rules, with a clear message per rule. Admins in PR 6 are the second check. Thresholds live in one SQL function.                                      |
| Live edits   | **Revise takes the listing offline.** Any change to a published or reserved listing goes through `revise_listing` (back to draft, off the marketplace) and needs re-approval. Availability changes (reserved/sold) don't. |
| HDB-approved | **Left unknown.** `breeds.hdb_approved` exists but stays null, and nothing is shown to buyers until the official HDB list is loaded.                                                                                      |

## Patterns to mirror

| Category       | Source                                                                                         | Pattern                                                                                                                                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Migration      | `supabase/migrations/20261001171518_create_sellers.sql`                                        | Reference data in the migration; RLS on; `revoke all` then explicit grants; column grants; security definer functions that raise snake_case codes; lock triggers apply only to the `authenticated` role |
| Status changes | `supabase/migrations/20261001180410_seller_reviews.sql` (`review_seller`)                      | One function per transition, `for update` row lock, `invalid_transition`                                                                                                                                |
| Storage        | `seller-documents` bucket and policies                                                         | Private bucket, `<owner_id>/` folders, append-only, browser upload then server-side record using `info()`                                                                                               |
| pgTAP          | `supabase/tests/database/*.test.sql`                                                           | Act as owner, stranger, anon and admin; scope assertions to test-created rows                                                                                                                           |
| Data layer     | `lib/sellers/{schema,queries,actions,errors,progress}.ts`                                      | zod per form section, `cache()` queries mapped to camelCase types, actions returning `ActionState`, error-code → message map                                                                            |
| UI             | `components/seller/*`, `components/forms/*`, `app/(marketplace)/seller`                        | `FieldShell` fields, `useActionState`, `SubmitButton`, `DocumentUpload`                                                                                                                                 |
| Tests          | `tests/unit/sellers-*.test.ts`, `tests/unit/fixtures/seller.ts`, `tests/e2e/helpers/seller.ts` | Fake Supabase builder, fixtures, e2e helpers that onboard and approve sellers                                                                                                                           |

## PR 5a – Schema

### Tables

```
categories (id, slug, name, icon, sort_order,
            status 'active' | 'coming_soon' | 'hidden',
            vertical 'animal' | 'service' | 'product',
            listing_type 'sale' | 'adoption' | null, species_id → species | null,
            requires_review bool)
  seed: dogs (active · animal · sale · dog), cats (coming_soon · cat), adoption (coming_soon),
        accessories (coming_soon · product), services (coming_soon · service)

breeds (id, species_id, slug, name,
        hdb_approved bool null,            -- null until the official HDB list is loaded (agreed)
        specified_part smallint null)      -- AVS specified dogs: 1 = cannot be sold, 2 = conditions apply
  seed: ~100 common dog breeds + "Singapore Special" (local mixed breed); Part 1 and Part 2 breeds flagged

listings (id, seller_id, category_id, vertical,
          title 5–80, description ≤ 2000, price_cents > 0, currency 'SGD',
          status, submitted_at, published_at, status_changed_at, created_at, updated_at)
  unique (id, vertical)                    -- target of the details table's composite FK
  status: draft · pending_review · changes_requested · published · reserved · sold · rejected · suspended · archived

pet_listing_details (listing_id PK, vertical = 'animal', FK (listing_id, vertical) → listings,
                     breed_id, cross_breed_id null, sex, date_of_birth, ready_date,
                     colour, weight_kg null, height_cm null, sterilised)        -- public with the listing

pet_listing_private (listing_id PK → listings,                                -- members + admins only
                     microchip_no (15 digits),
                     source 'bred_on_premises' | 'licensed_breeder' | 'imported',
                     source_licence_no null, import_permit_no null, arrival_date null)

pet_health_records (id, listing_id, kind 'vaccination' | 'deworming', given_on, product, clinic)   -- public with the listing

listing_documents (id, listing_id, kind 'vaccination_card' | 'import_permit', storage_path, file_name,
                   content_type, size_bytes, uploaded_by, created_at)          -- members + admins; append-only
+ private bucket `listing-documents`, folders `<listing_id>/`
```

### Design decisions

- **Location comes from the seller.** Listings show the seller's area ("Tampines, East"), since animals are at the licensed premises, so there's no area column on listings.
- **Species comes from the category.** A trigger checks that the breed and cross breed belong to the category's species. `vertical` is copied from the category on insert and checked, so the composite FK guarantees pet details attach only to animal listings.
- **Crosses:** `breed_id` plus an optional `cross_breed_id` covers purebreds, crosses (Cavapoo = Cavalier King Charles Spaniel × Poodle) and local mixed breeds ("Singapore Special"). A listing is Part 1 if **either** breed is, which covers "and their crosses".
- **Private vs public details.** The microchip number and source paperwork go in `pet_listing_private`, because RLS can't hide individual columns. Breed, age, sex, health records and so on are public once the listing is visible.
- **Who sees what:**
  - Everyone sees listings that are `published`, `reserved` or `sold` **and** whose seller is verified. A suspended seller's listings disappear automatically.
  - Members and admins see all of their listings.
- **Writes:**
  - `create_listing(seller_id, category_slug)` makes a draft with its details rows. Members can create drafts even before verification.
  - Members edit through column grants, but only while the status is `draft` or `changes_requested` (lock trigger).
  - Status changes only through functions:

  | Function                    | Transition                                                                       | Checks                                                                 |
  | --------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
  | `submit_listing_for_review` | draft / changes_requested → pending_review                                       | `seller_can_list(seller, category species)` plus every AVS check below |
  | `revise_listing`            | published / reserved → draft                                                     | Takes the listing off the marketplace until re-approved (agreed)       |
  | `set_listing_availability`  | published ⇄ reserved, published / reserved → sold                                | Member, seller still verified                                          |
  | `archive_listing`           | any except pending_review → archived                                             | Member                                                                 |
  | delete (RLS)                | draft that was never submitted                                                   | Member                                                                 |
  | `review_listing`            | pending_review → published / changes_requested / rejected; published → suspended | **PR 6**                                                               |

- **AVS checks in `submit_listing_for_review`** (block on submit, agreed). Each raises a code that the UI maps to a message:

  | Code                                                                   | Rule                                                                                                                                                                                                    |
  | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `missing_details`                                                      | Title, price, breed, sex, date of birth, ready date, colour, microchip and source present                                                                                                               |
  | `restricted_breed`                                                     | Neither breed is Specified Dog Part 1                                                                                                                                                                   |
  | `too_young_at_handover`                                                | `ready_date ≥ date_of_birth + 63 days` (9 weeks). Listing before 9 weeks is fine; handover isn't.                                                                                                       |
  | `invalid_dates`                                                        | Date of birth not in the future; ready date not before date of birth                                                                                                                                    |
  | `vaccinations_incomplete`                                              | At least 2 vaccinations, the latest at least 7 days before the ready date                                                                                                                               |
  | `deworming_incomplete`                                                 | At least 2 dewormings                                                                                                                                                                                   |
  | `invalid_source`                                                       | Breeders: `bred_on_premises` only. Pet shops: `licensed_breeder` (with the breeder's licence number) or `imported` (with permit number and arrival date, and ready date at least 3 days after arrival). |
  | `missing_vaccination_card` (and `missing_import_permit` when imported) | The documents are uploaded                                                                                                                                                                              |
  | `seller_cannot_list`                                                   | Seller is verified, licence in date, and licensed for the species                                                                                                                                       |

- **The minimum age and the 7-day and 3-day gaps are constants in one SQL function**, so they're easy to update when AVS confirms the rules.

### Files

| File                                                                    | Action | Why                                                                                                                                             |
| ----------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `supabase/migrations/<ts>_create_listings.sql`                          | CREATE | Everything above                                                                                                                                |
| `supabase/seed.sql`                                                     | UPDATE | alice (breeder): 3 dogs (2 published, 1 reserved). dave (pet shop): 3 dogs (published, sold, draft). Health records included, so PR 7 has data. |
| `supabase/tests/database/listings.test.sql`, `listing_storage.test.sql` | CREATE | pgTAP (below)                                                                                                                                   |
| `types/database.ts`                                                     | UPDATE | Regenerated                                                                                                                                     |
| `lib/listings/schema.ts`                                                | CREATE | zod per editor section, mirroring the SQL rules for early feedback                                                                              |
| `lib/listings/rules.ts`                                                 | CREATE | Pure: age in weeks, earliest legal ready date, a "what's missing to submit" checklist, Part 1/2 helpers                                         |
| `lib/listings/queries.ts`                                               | CREATE | `listSellerListings`, `getListingForEdit`, `listBreeds`, `listCategories`                                                                       |
| `lib/listings/errors.ts`, `status.ts`                                   | CREATE | Error codes → messages; status labels and badges                                                                                                |
| `tests/unit/listings-*.test.ts`                                         | CREATE | Unit tests                                                                                                                                      |

### pgTAP coverage

- **Visibility:**
  - Anonymous users see only published, reserved and sold listings of verified sellers. Drafts and pending listings are hidden from strangers.
  - Suspending the seller hides their listings.
  - Private details and documents are members and admins only.
- **Writes:**
  - Members create drafts; strangers can't.
  - Nobody can write `status` directly.
  - Edits are refused while pending or published.
  - Only never-submitted drafts can be deleted.
- **Submit:** each failure code in the table above, plus a successful submit for a pet shop (licensed-breeder source) and a breeder (bred on premises).
- **Transitions:** availability changes, revise (published → draft), archive, and the invalid ones.
- **Integrity:** the breed's species must match the category; pet details can't attach to a non-animal listing; prices must be positive.
- **Storage:** the listing-documents policies, mirroring `seller_storage.test.sql`.

## PR 5b – Seller listing management

| Route                   | Behaviour                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/seller`               | Adds a **Listings** summary: counts by status and "Create listing". Shows a note when the seller can't submit yet (not verified, licence expired).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `/seller/listings`      | Table of the seller's listings: placeholder art (`PetPlaceholder`), title, breed, age, price, status badge, last updated. Filters: Active (published, reserved), In review, Drafts, Sold, Archived.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `/seller/listings/new`  | Calls `create_listing` and redirects to the editor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `/seller/listings/[id]` | **Listing editor**, Airbnb-style. A left section nav with completion ticks; each section is its own form with Save: **Basics** (title, breed and optional cross, sex, colour, date of birth, ready date with a live "earliest legal handover" hint, weight, height, sterilised), **Price and description**, **Health** (microchip, plus vaccination and deworming lists with add and remove), **Source** (fields depend on seller type), **Documents** (vaccination card; import permit when imported). A sticky side panel shows status, a submit checklist from `rules.ts`, and the action for the current status: **Submit for review**, **Revise** (with a warning that the listing goes offline), **Mark reserved / sold / available**, **Archive**, **Delete draft**. Read-only while pending review. |

**Files:** `lib/listings/actions.ts`; `app/(marketplace)/seller/listings/{page,new/route,[id]/page}.tsx`; `components/listings/editor/*` (section forms, `HealthRecordsEditor`, `ListingActions`, `SubmitChecklist`); `components/listings/status-badge.tsx`; `components/seller/document-upload.tsx`, generalised to take a bucket, owner id and record action. Plus unit tests and `tests/e2e/listings.spec.ts`.

**E2E:**

1. **Pet shop listing:** a seller is onboarded and approved (helpers plus carol) → creates a listing → the submit checklist shows what's missing → fills every section, adds two vaccinations and two dewormings, uploads the vaccination card → submits → sees "In review" and the editor goes read-only.
2. **Validation:** a ready date under 9 weeks, a Part 1 breed (e.g. Akita) and a single vaccination are each refused with clear messages.
3. **Unverified seller:** a pending seller can save a draft but Submit is disabled, with the reason shown.
4. **Availability:** using a seeded published listing (alice): mark reserved, then sold. Revise shows the warning, and the listing returns to draft.
5. **Access:** another seller can't open someone else's listing editor (404).

## Validation

```bash
npm run db:reset && npm run db:lint && npm run db:test && npm run db:types
npm run format:check && npm run lint && npm run typecheck && npm run test:coverage && npm run build
npm run test:e2e
```

## Risks

| Risk                                                                                       | Likelihood | Mitigation                                                                                                                                       |
| ------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| AVS rules encoded wrongly (9 weeks, 7-day rest, dewormings) or applied at the wrong moment | Med        | Constants in one function; applied to the handover date; listed as open questions in the research file; admin review in PR 6 is the second check |
| Specified-dog or HDB breed data is inaccurate                                              | Med        | Part 1/2 from the AVS page; HDB left unknown until the official list is loaded; breeds are reference data, easy to amend                         |
| The microchip number leaks publicly                                                        | Low        | Separate private table; pgTAP checks anon and stranger access                                                                                    |
| Large migration and PR                                                                     | High       | Split into 5a and 5b like PR 3; 5a has no UI                                                                                                     |
| Seed listings drift from the real rules                                                    | Low        | Seed data satisfies the same checks; one pgTAP test runs submit-equivalent checks on the seed                                                    |

## Out of scope

- Admin listing review (PR 6)
- The public marketplace and listing pages (PR 7)
- Public photos
- Litters
- Cats, adoption, services and products (the schema is ready; categories are coming soon)
