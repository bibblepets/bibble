import { Logo } from "@/components/brand/logo"
import { Suspense } from "react"
import { SellerLink, SellerLinkSlot } from "./seller-link"
import { UserMenuFallback } from "./user-menu"
import { UserMenuSlot } from "./user-menu-slot"

export function SiteHeader() {
	return (
		<header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-20 lg:px-10">
				<Logo />
				<nav aria-label="Account" className="flex items-center gap-2">
					<Suspense fallback={<SellerLink hasSeller={false} />}>
						<SellerLinkSlot />
					</Suspense>
					<Suspense fallback={<UserMenuFallback />}>
						<UserMenuSlot />
					</Suspense>
				</nav>
			</div>
		</header>
	)
}
