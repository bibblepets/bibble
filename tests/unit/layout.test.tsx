import MarketplaceLayout from "@/app/(marketplace)/layout"
import { MobileTabBar } from "@/components/layout/mobile-tab-bar"
import { MobileTabBarSlot } from "@/components/layout/mobile-tab-bar-slot"
import { SiteHeader } from "@/components/layout/site-header"
import { UserMenu } from "@/components/layout/user-menu"
import { UserMenuSlot } from "@/components/layout/user-menu-slot"
import { PetPlaceholder } from "@/components/listings/pet-placeholder"
import type { CurrentUser } from "@/lib/auth/session"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

const pathname = vi.hoisted(() => ({ current: "/" }))
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }))

const session = vi.hoisted(() => ({ user: null as CurrentUser | null }))
vi.mock("@/lib/auth/session", () => ({ getCurrentUser: async () => session.user }))

const logOut = vi.hoisted(() => vi.fn())
vi.mock("@/lib/auth/actions", () => ({ logOut }))

const alice: CurrentUser = { id: "user-1", email: "alice@bibble.test", displayName: "Alice Tan" }

describe("SiteHeader", () => {
	it("links the logo home and offers selling", () => {
		render(<SiteHeader />)

		expect(screen.getByRole("link", { name: "Bibble home" })).toHaveAttribute("href", "/")
		expect(screen.getByRole("link", { name: "Become a seller" })).toHaveAttribute("href", "/seller/onboarding")
	})

	it("opens the user menu with signed-out actions", async () => {
		const user = userEvent.setup()
		render(<UserMenu user={null} />)

		await user.click(screen.getByRole("button", { name: "Open menu" }))
		const menu = await screen.findByRole("menu")

		expect(within(menu).getByRole("menuitem", { name: "Sign up" })).toHaveAttribute("href", "/signup")
		expect(within(menu).getByRole("menuitem", { name: "Log in" })).toHaveAttribute("href", "/login")
		expect(within(menu).getByRole("menuitem", { name: "Become a seller" })).toHaveAttribute(
			"href",
			"/seller/onboarding"
		)
	})
})

describe("UserMenu when signed in", () => {
	it("shows who is signed in and logs out", async () => {
		const user = userEvent.setup()
		render(<UserMenu user={alice} />)

		expect(screen.getByRole("button", { name: "Open menu" })).toHaveTextContent("AT")
		await user.click(screen.getByRole("button", { name: "Open menu" }))
		const menu = await screen.findByRole("menu")

		expect(menu).toHaveTextContent("Alice Tan")
		expect(menu).toHaveTextContent("alice@bibble.test")
		expect(within(menu).getByRole("menuitem", { name: "Favourites" })).toHaveAttribute("href", "/favourites")
		expect(within(menu).queryByRole("menuitem", { name: "Log in" })).toBeNull()

		await user.click(within(menu).getByRole("menuitem", { name: "Log out" }))
		expect(logOut).toHaveBeenCalledOnce()
	})

	it("falls back to the email when there is no display name", async () => {
		const user = userEvent.setup()
		render(<UserMenu user={{ ...alice, displayName: null }} />)

		expect(screen.getByRole("button", { name: "Open menu" })).toHaveTextContent("A")
		await user.click(screen.getByRole("button", { name: "Open menu" }))
		expect(await screen.findByRole("menu")).toHaveTextContent("alice@bibble.test")
	})
})

// Async Server Components can't render in jsdom, so the slots are awaited by hand.
describe("session slots", () => {
	it("pass the current user through", async () => {
		session.user = alice
		render(await UserMenuSlot())
		expect(screen.getByRole("button", { name: "Open menu" })).toHaveTextContent("AT")
		render(await MobileTabBarSlot())
		expect(screen.queryByRole("link", { name: "Log in" })).toBeNull()

		session.user = null
	})
})

describe("MobileTabBar", () => {
	it("marks the current tab", () => {
		pathname.current = "/favourites"
		render(<MobileTabBar signedIn={false} />)

		const nav = screen.getByRole("navigation", { name: "Primary" })
		expect(within(nav).getByRole("link", { name: "Favourites" })).toHaveAttribute("aria-current", "page")
		expect(within(nav).getByRole("link", { name: "Explore" })).not.toHaveAttribute("aria-current")
		expect(within(nav).getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login")
	})
})

describe("MarketplaceLayout", () => {
	it("wraps the page with a skip link, header and footer", () => {
		render(
			<MarketplaceLayout params={Promise.resolve({})}>
				<p>Page body</p>
			</MarketplaceLayout>
		)

		expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main")
		expect(screen.getByRole("banner")).toBeInTheDocument()
		expect(screen.getByRole("contentinfo")).toHaveTextContent(`© ${new Date().getFullYear()} Bibble`)
		expect(screen.getByText("Page body").closest("#main")).not.toBeNull()
	})
})

describe("PetPlaceholder", () => {
	it("shows initials on a gradient and hides itself from assistive tech", () => {
		render(<PetPlaceholder label="Golden Retriever" seed="listing-1" />)

		const tile = screen.getByTestId("pet-placeholder")
		expect(tile).toHaveAttribute("aria-hidden", "true")
		expect(tile).toHaveTextContent("GR")
		expect(tile.style.backgroundImage).toContain("linear-gradient")
	})
})
