# Bibble v1 roadmap

First shippable version: accounts, verified sellers, admin-reviewed dog-for-sale listings, an Airbnb-style marketplace, and favourites.

## Product decisions (agreed 2026-10-02)

| Topic               | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accounts            | Airbnb model: one account type. Anyone can buy; selling is opt-in ("Become a seller").                                                                                                                                                                                                                                                                                                                                                                                  |
| Seller accounts     | `sellers.entity_type` is `business` or `individual`. Animal sale and adoption categories require a **verified registered business** (to stop illegal breeding). Future services (e.g. dog walking) may allow individuals. Exactly **one seller account per user** in v1.                                                                                                                                                                                                |
| Seller verification | v1 seller types: `pet_shop` and `breeder`; the species a seller may sell come from their licence (`seller_species`, dogs only in v1); `animal_shelter` comes with adoption. Onboarding is an Airbnb-style step wizard. AVS licence and ACRA BizFile uploads are required. UEN, legal name, type and licence number are locked after verification. Admins verify the UEN and NParks/AVS licence. Unverified sellers can create drafts but cannot submit them for review. |
| Listing review      | Every animal listing is reviewed by an admin before it goes live. Admins can approve, request changes, reject, or flag (suspend) a live listing. Editing animal details or price on a live listing sends it back to review. Changing availability (reserved/sold) does not. The review checklist and UX stay minimal for now.                                                                                                                                           |
| Admins              | `/admin` in the same app. Admins are granted via SQL only (`platform_admins` table).                                                                                                                                                                                                                                                                                                                                                                                    |
| Auth                | Email + password with email confirmation. Production uses Supabase's built-in email for now.                                                                                                                                                                                                                                                                                                                                                                            |
| Buyers              | Favourites only. Payments, messaging and kennel-visit scheduling are separate tickets.                                                                                                                                                                                                                                                                                                                                                                                  |
| Listings            | One dog per listing. Leave room for litters later (a nullable `litter_id`). No images in v1; cards show a gradient placeholder with initials.                                                                                                                                                                                                                                                                                                                           |
| Pricing             | Fixed price in SGD, stored in cents. Deposits, negotiation etc. are out of scope.                                                                                                                                                                                                                                                                                                                                                                                       |
| Location            | Listings show area + region (e.g. "Tampines, East"). The full kennel address lives in the seller's private details, visible only to seller members and admins.                                                                                                                                                                                                                                                                                                          |
| Availability        | Reserved and sold listings stay visible, with a badge.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Market              | Singapore: SGD, metric units, en-SG formatting, ACRA UEN, NParks/AVS licensing.                                                                                                                                                                                                                                                                                                                                                                                         |
| Search              | Out of scope for v1.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Categories          | Cats, Adoption, Accessories and Services are shown as "coming soon".                                                                                                                                                                                                                                                                                                                                                                                                    |
| Brand               | Logo PNGs (no SVG). Brand blue `#0EA9EE` for accents; a darker `~#0077B6` for buttons and links, because the brand blue on white is only about 2.7:1 contrast.                                                                                                                                                                                                                                                                                                          |

### Compliance decisions (from [research-sg-pet-sale-rules.md](research-sg-pet-sale-rules.md), agreed 2026-10-02)

- **Licence on every listing:** the seller's AVS licence number appears publicly on every listing, because the law requires it in adverts.
- **Seller types:** `pet_shop` or `breeder` (generic). The species their AVS licence covers are recorded per seller and checked by admins. `animal_shelter` is added with adoption. Licence-number formats are checked.
- **Health records:** dog listings carry structured records: microchip number (visible to admins only), vaccinations, deworming dates and where the dog came from. Yes/no checkboxes aren't enough.
- **Age and breed rules:** puppies must be at least 9 weeks old by the earliest handover date. Specified-dog **Part 1** breeds are blocked. **Part 2** breeds are labelled.
- **Private documents for review:** the seller's licence and ACRA profile (PR 3) and the dog's vaccination card (PR 5) are uploaded to a **private** Supabase Storage bucket that only admins and seller members can read. Public listing photos stay out of scope.
- **Legal questions** listed in the research file must be answered by AVS or a lawyer before public launch.

## Data model (target)

```
platform_admins (user_id)
sellers (id, entity_type, seller_type, name, legal_name, slug, uen, licence_type, licence_no,
         licence_expiry, verification_status, area, region, ...)
seller_private_details (seller_id, address, postal_code, phone, email)  -- members + admins only
seller_members (seller_id, user_id, role)                              -- unique(user_id) in v1

categories (id, slug, name, icon, sort_order, status, vertical, listing_type, species_id,
            requires_registered_business, requires_review)
species (id, slug, name)                                            -- created in PR 3a
seller_species (seller_id, species_id)                              -- what the licence covers
breeds (id, species_id, slug, name, hdb_approved, specified_dog_part)

listings (id, category_id, vertical, seller_id, title, description, price_cents, currency,
          status, area, region, published_at, ...)          -- unique(id, vertical)
pet_listing_details (listing_id, vertical = 'animal', breed_id, is_mixed_breed, sex, date_of_birth,
                     ready_date, weight_kg, height_cm, colour, microchip_no, source,
                     sterilised, attributes jsonb)                   -- fk (listing_id, vertical)
pet_health_records (id, listing_id, kind: vaccination | deworming, given_on, product, vet, clinic)
seller_documents / listing_documents (id, owner_id, kind, storage_path, ...)  -- private bucket; members + admins
listing_reviews (id, listing_id, reviewer_id, decision, notes, created_at)
favourites (user_id, listing_id, created_at)
```

- **Category vs listing:** the category is the single source of truth for vertical, species and listing type. Listings reference it via `category_id`, and a trigger checks that the breed's species matches the category's species.
- **Status flow:** `draft → pending_review → published ⇄ reserved → sold`, with `changes_requested`, `rejected`, `suspended` and `archived` branches. Sellers can't write `status` directly; changes go through security-definer functions that check category policy and seller verification.

## PRs

| #   | PR                                                   | Depends on | Plan                                                                 |
| --- | ---------------------------------------------------- | ---------- | -------------------------------------------------------------------- |
| 1   | Brand and app shell                                  | –          | [pr1-brand-shell.plan.md](pr1-brand-shell.plan.md) (merged, #6)      |
| 2   | Authentication                                       | 1          | [pr2-auth.plan.md](pr2-auth.plan.md) (merged, #7)                    |
| 3a  | Seller schema, Storage and pgTAP in CI               | 2          | [pr3-sellers.plan.md](pr3-sellers.plan.md) (merged, #9)              |
| 3b  | Seller onboarding wizard and dashboard               | 3a         | [pr3-sellers.plan.md](pr3-sellers.plan.md) (merged, #10)             |
| 4   | Admin console and seller verification                | 3          | [pr4-admin-sellers.plan.md](pr4-admin-sellers.plan.md) (merged, #12) |
| 5   | Listings model and seller CRUD                       | 3          | [pr5-listings.plan.md](pr5-listings.plan.md) (5a in review)          |
| 6   | Listing review workflow                              | 4, 5       | pending                                                              |
| 7   | Public marketplace (category bar, grid, detail page) | 5          | pending                                                              |
| 8   | Favourites, plus the full-journey e2e test           | 7          | pending                                                              |
