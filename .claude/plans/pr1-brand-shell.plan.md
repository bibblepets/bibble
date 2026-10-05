# Plan: PR 1 – Brand and app shell

**Source**: [v1-roadmap.md](v1-roadmap.md)
**Complexity**: Small/Medium

## Summary

Add the Bibble logo and icons, build a colour palette from the logo blue, and wrap the marketplace in an Airbnb-style shell: sticky header, user menu, footer and mobile tab bar. Add the placeholder component that listing cards will use until images exist. No data or auth changes; the user menu only has signed-out items.

## Patterns to mirror

| Category        | Source                                    | Pattern                                                                                |
| --------------- | ----------------------------------------- | -------------------------------------------------------------------------------------- |
| Page layout     | `app/not-found.tsx:5`                     | `<main className="mx-auto flex w-full ... flex-1">`, Tailwind only                     |
| UI primitives   | `components/ui/*`, `components.json`      | shadcn `base-nova` style on `@base-ui/react`; add with `npx shadcn add` and don't edit |
| Logic placement | `lib/redirect.ts`, `vitest.config.mts:20` | Pure logic in `lib/` with unit tests; thin wiring is excluded from coverage            |
| Tests           | `tests/unit/pages.test.tsx`               | Testing Library, `getByRole` queries, one `describe` per page                          |
| E2E             | `tests/e2e/smoke.spec.ts`                 | Role-based locators against the production build                                       |

## Files to change

| File                                                           | Action           | Why                                                                                                                    |
| -------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `public/brand/logo.png`, `public/brand/logo-small.png`         | CREATE           | Copied from `~/Downloads` (820×196 and 231×196, transparent)                                                           |
| `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`        | CREATE / REPLACE | Square paw icon padded from `logo-small.png` (apple icon on a white background)                                        |
| `app/globals.css`                                              | UPDATE           | Brand colour tokens (see below)                                                                                        |
| `app/layout.tsx`                                               | UPDATE           | Add a "skip to content" link and `applicationName` metadata                                                            |
| `components/brand/logo.tsx`                                    | CREATE           | `next/image` wordmark (`md+`) / paw only (mobile), `alt="Bibble"`, links home                                          |
| `components/layout/site-header.tsx`                            | CREATE           | Sticky header, logo on the left, "Become a seller" link and `UserMenu` on the right                                    |
| `components/layout/user-menu.tsx`                              | CREATE           | Client component. Airbnb-style menu-icon-plus-avatar button opening a dropdown: Sign up, Log in, Become a seller       |
| `components/layout/site-footer.tsx`                            | CREATE           | Simple footer with © and placeholder links                                                                             |
| `components/layout/mobile-tab-bar.tsx`                         | CREATE           | Fixed bottom nav below `md`: Explore, Favourites, Log in                                                               |
| `components/listings/pet-placeholder.tsx`                      | CREATE           | Square gradient tile with initials                                                                                     |
| `lib/placeholder.ts`                                           | CREATE           | `placeholderFor(seed: string) → { initials, from, to }`, a deterministic hash into a palette of brand-family gradients |
| `app/(marketplace)/layout.tsx`                                 | CREATE           | Header + `{children}` + footer + tab bar                                                                               |
| `app/page.tsx` → `app/(marketplace)/page.tsx`                  | MOVE             | Home page gets the shell; its content changes in PR 7                                                                  |
| `components/ui/{dropdown-menu,avatar,separator}.tsx`           | CREATE           | via `npx shadcn add`                                                                                                   |
| `tests/unit/placeholder.test.ts`, `tests/unit/layout.test.tsx` | CREATE           | Unit tests                                                                                                             |
| `tests/unit/pages.test.tsx`                                    | UPDATE           | Import path of the moved home page                                                                                     |
| `tests/e2e/smoke.spec.ts`                                      | UPDATE           | Header, logo, and mobile tab bar at a phone viewport                                                                   |

## Palette

The brand blue `#0EA9EE` is about 2.7:1 against white, which fails WCAG AA for text and for white-on-blue buttons.

- **`--brand`** is `#0EA9EE`. Used for the logo, focus accents and placeholder gradients only.
- **`--primary`** is about `#0077B6` (about 4.9:1 against white). Used for buttons, links and the active state. **`--primary-foreground`** is white.
- **`--ring`** is the brand blue. **`--accent`** is a very light tint of it.
- Neutrals stay as shadcn's neutral greys. **`--radius`** goes up slightly for Airbnb's softer cards.
- Keep the `.dark` block but don't design for it. There's no theme toggle in v1.
- Final values are in OKLCH, and contrast is checked for each pair (primary on white; white on primary).

## Tasks

1. **Assets.** Copy the logos. Pad `logo-small.png` to a square with `sips` and export the icon, apple icon and favicon. Check that they look right in the browser tab.
   - Validate: `npm run build`, then check the `<link rel="icon">` tags in the page HTML.
2. **Tokens.** Update `:root` in `globals.css` and add `--color-brand` in `@theme`.
   - Validate: render the existing Button and Card and check them visually.
3. **Placeholder.** Write `lib/placeholder.ts` and its tests first: same seed gives the same output; initials for one word and for several words; empty input; unicode input. Then write `PetPlaceholder`.
   - Validate: `npm run test`.
4. **Shell components.** Logo, header, user menu (dropdown trigger has `aria-label="Open menu"`), footer, tab bar, and the `(marketplace)` route group. Move `page.tsx` into it.
   - Mirror: shadcn primitives with Tailwind classes, no custom CSS.
5. **Tests.** Unit: the header renders the logo link and menu items, and the tab bar's links. E2E: the header is visible on desktop, and the tab bar is visible at a 390px viewport.
   - Validate: the full pre-commit command from CLAUDE.md.

## Validation

```bash
npm run format:check && npm run lint && npm run typecheck && npm run test:coverage && npm run build
npm run db:start && npm run test:e2e
```

## Risks

| Risk                                                                              | Likelihood | Mitigation                                                                             |
| --------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------- |
| Raster logo looks soft on high-density screens                                    | Med        | Render the wordmark at ≤ 98px tall (half its pixel height); swap to SVG when available |
| `/login` and `/signup` menu links 404 until PR 2 merges                           | Certain    | PR 2 lands on `develop` before the next release to `main`                              |
| `not-found` and `error` pages sit outside `(marketplace)`, so they have no header | Low        | Acceptable for v1; revisit if it feels off                                             |
| Moving `page.tsx` breaks imports                                                  | Low        | Update the test import; typecheck catches the rest                                     |

## Acceptance

- [ ] The logo appears in the header and the paw icon appears in the browser tab
- [ ] Buttons and links meet WCAG AA contrast
- [ ] Header, menu, footer and mobile tab bar work from 390px to desktop width, including by keyboard
- [ ] `PetPlaceholder` is deterministic and unit-tested
- [ ] All validation commands pass
