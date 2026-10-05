import { buttonVariants } from "@/components/ui/button"
import type { SellerListingRow } from "@/lib/listings/queries"
import { listingFilters } from "@/lib/listings/status"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { CreateListingButton } from "./create-listing-button"

const shown = ["active", "review", "drafts"] as const

/** The seller dashboard's listings card. */
export function ListingsSummary({ listings, canList }: { listings: SellerListingRow[]; canList: boolean }) {
	return (
		<section aria-labelledby="listings-title" className="rounded-2xl border p-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h2 id="listings-title" className="text-xl font-semibold">
						Listings
					</h2>
					<p className="text-muted-foreground mt-1 text-sm">
						{canList
							? "Every listing is checked by Bibble before it goes live."
							: "You can prepare drafts now, and submit them once your business is verified."}
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					{listings.length > 0 && (
						<Link href="/seller/listings" className={cn(buttonVariants({ variant: "outline" }), "h-10 px-4")}>
							Manage listings
						</Link>
					)}
					<CreateListingButton />
				</div>
			</div>
			{listings.length > 0 && (
				<dl className="mt-6 grid grid-cols-3 gap-4">
					{shown.map((key) => (
						<div key={key}>
							<dt className="text-muted-foreground text-sm">{listingFilters[key].label}</dt>
							<dd className="text-2xl font-semibold tabular-nums">
								<Link href={`/seller/listings?show=${key}`} className="hover:underline">
									{
										listings.filter((l) => (listingFilters[key].statuses as readonly string[]).includes(l.status))
											.length
									}
								</Link>
							</dd>
						</div>
					))}
				</dl>
			)}
		</section>
	)
}
