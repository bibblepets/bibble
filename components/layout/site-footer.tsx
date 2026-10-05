import Link from "next/link"
import { navLinks } from "./nav-links"

export function SiteFooter() {
	return (
		// Extra bottom padding on mobile keeps the content clear of the fixed tab bar.
		<footer className="bg-muted/50 border-t pb-20 md:pb-0">
			<div className="text-muted-foreground mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
				<p>© {new Date().getFullYear()} Bibble. Made in Singapore.</p>
				<nav aria-label="Footer" className="flex gap-6">
					<Link href={navLinks.becomeSeller} className="hover:text-foreground hover:underline">
						Sell on Bibble
					</Link>
				</nav>
			</div>
		</footer>
	)
}
