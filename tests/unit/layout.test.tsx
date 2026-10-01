import MarketplaceLayout from "@/app/(marketplace)/layout"
import { MobileTabBar } from "@/components/layout/mobile-tab-bar"
import { SiteHeader } from "@/components/layout/site-header"
import { PetPlaceholder } from "@/components/listings/pet-placeholder"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

const pathname = vi.hoisted(() => ({ current: "/" }))
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }))

describe("SiteHeader", () => {
	it("links the logo home and offers selling", () => {
		render(<SiteHeader />)

		expect(screen.getByRole("link", { name: "Bibble home" })).toHaveAttribute("href", "/")
		expect(screen.getByRole("link", { name: "Become a seller" })).toHaveAttribute("href", "/seller/onboarding")
	})

	it("opens the user menu with signed-out actions", async () => {
		const user = userEvent.setup()
		render(<SiteHeader />)

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

describe("MobileTabBar", () => {
	it("marks the current tab", () => {
		pathname.current = "/favourites"
		render(<MobileTabBar />)

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
