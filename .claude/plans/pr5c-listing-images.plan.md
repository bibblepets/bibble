# Plan: PR 5c – Listing photos (up to 5)

**Depends on**: #14 (listings schema), #15 (listing editor). Stacked on #15.
**Complexity**: Medium

## Decisions (agreed 2026-10-05)

| Topic    | Decision                                                                                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Limit    | Up to **5 photos** per listing; the first is the cover                                                                                                                                    |
| Storage  | **Public bucket** `listing-images` with random object names, served from the Storage CDN. Writes only by seller members, and only while the listing is editable.                          |
| Required | **At least 1 photo to submit** (`missing_photos`, checked by `submit_listing_for_review`)                                                                                                 |
| Privacy  | Photos are resized (max 2000px) and re-encoded to WebP **in the browser before upload**, which strips EXIF data, including GPS coordinates that would reveal the private premises address |
| Review   | Photos are part of the listing: editable only in draft or changes requested, and reviewed by admins in PR 6                                                                               |

## Schema (new migration)

- **`listing_images`** (id, listing_id, storage_path, position 0–4, width, height, created_at). `unique (listing_id, position)` is deferrable, so reordering can swap positions, and positions 0–4 cap a listing at 5 photos.
- **Functions** (security definer, member and editable checks):
  - `add_listing_image` puts the photo at the next position and raises `too_many_images` past 5.
  - `remove_listing_image` deletes the photo and closes the gap in positions.
  - `reorder_listing_images` takes the photo ids in their new order.
- **Access:** reading follows the listing (public when the listing is, otherwise members and admins). There are no direct writes.
- **Bucket** `listing-images`: public, WebP/JPEG/PNG, 5 MB. Members can insert and delete in `<listing_id>/` only while the listing is a draft or has changes requested.
- **`submit_listing_for_review`** is redefined with the `missing_photos` check.

## App

- **`lib/listings/images.ts`:** browser resize and re-encode, plus a pure `fitWithin()` size helper.
- **Actions:** `addListingImage` (checks the object exists via `info()`, then calls the function), `removeListingImage` (removes the row, then the Storage object), `moveListingImage`.
- **Editor:** a new **Photos** section first: a grid of up to 5 thumbnails with "Cover" on the first, move earlier/later, make cover, remove, and an add button (several files at once). Read-only outside drafts.
- **Listings page:** shows the cover thumbnail when there is one.
- **`next.config.ts`:** `images.remotePatterns` for the Supabase Storage host. Local Supabase on 127.0.0.1 needs `dangerouslyAllowLocalIP`, enabled only for local hosts.
- **Rules:** `submitIssues()` gains the photos rule.

## Tests

- **pgTAP:** add up to 5, refuse a 6th, remove closes the gaps, reorder, editing locked once submitted, visibility (anon sees a published listing's photos, not a draft's), the Storage policies, and `missing_photos` on submit. Existing submit tests add a photo.
- **Unit:** `fitWithin`, the rules, actions, and the Photos section (with image processing mocked).
- **E2E:** the pet shop journey adds two photos, makes the second the cover and removes one. Submitting without photos is blocked.
