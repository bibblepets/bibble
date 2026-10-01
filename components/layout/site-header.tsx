import { Logo } from "@/components/brand/logo"
import Link from "next/link"
import { navLinks } from "./nav-links"
import { UserMenu } from "./user-menu"

export function SiteHeader() {
	return (
		<header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-20 lg:px-10">
				<Logo />
				<nav aria-label="Account" className="flex items-center gap-2">
					<Link
						href={navLinks.becomeSeller}
						className="hover:bg-muted hidden rounded-full px-4 py-2.5 text-sm font-medium transition-colors md:inline-block"
					>
						Become a seller
					</Link>
					<UserMenu />
				</nav>
			</div>
		</header>
	)
}
