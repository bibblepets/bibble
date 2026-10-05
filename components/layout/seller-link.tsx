import { getCurrentSeller } from "@/lib/sellers/queries"
import Link from "next/link"
import { navLinks } from "./nav-links"

const className = "hover:bg-muted hidden rounded-full px-4 py-2.5 text-sm font-medium transition-colors md:inline-block"

/** "Become a seller", or "Switch to selling" once the user has a seller account. */
export function SellerLink({ hasSeller }: { hasSeller: boolean }) {
	return hasSeller ? (
		<Link href={navLinks.sellerDashboard} className={className}>
			Switch to selling
		</Link>
	) : (
		<Link href={navLinks.becomeSeller} className={className}>
			Become a seller
		</Link>
	)
}

/** Reads the seller account for the header. Render inside `<Suspense>`. */
export async function SellerLinkSlot() {
	return <SellerLink hasSeller={(await getCurrentSeller()) !== null} />
}
