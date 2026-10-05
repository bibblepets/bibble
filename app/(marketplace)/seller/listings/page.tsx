import { CreateListingButton } from "@/components/listings/create-listing-button"
import { PetPlaceholder } from "@/components/listings/pet-placeholder"
import { StatusBadge } from "@/components/listings/status-badge"
import { todayInSingapore } from "@/lib/dates"
import { listSellerListings } from "@/lib/listings/queries"
import { formatAge } from "@/lib/listings/rules"
import { formatPrice, listingFilters, type ListingFilter } from "@/lib/listings/status"
import { requireSeller } from "@/lib/sellers/queries"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = { title: "Your listings" }

const filters = Object.entries(listingFilters) as [ListingFilter, (typeof listingFilters)[ListingFilter]][]

export default async function SellerListingsPage({ searchParams }: PageProps<"/seller/listings">) {
	const seller = await requireSeller("/seller/listings")
	const { show } = await searchParams
	const filter = filters.find(([key]) => key === show)
	const all = await listSellerListings(seller.id)
	const rows = filter ? all.filter((row) => (filter[1].statuses as readonly string[]).includes(row.status)) : all
	const today = todayInSingapore()

	return (
		<main className="mx-auto grid w-full max-w-5xl flex-1 content-start gap-6 px-4 py-10 sm:px-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<Link href="/seller" className="text-sm font-semibold underline underline-offset-4">
						Seller account
					</Link>
					<h1 className="mt-3 text-3xl font-semibold tracking-tight">Your listings</h1>
				</div>
				<CreateListingButton />
			</div>

			<nav aria-label="Listing filters" className="flex gap-2 overflow-x-auto">
				{[["all", { label: "All" }] as const, ...filters].map(([key, { label }]) => {
					const current = (filter?.[0] ?? "all") === key
					const count =
						key === "all"
							? all.length
							: all.filter((row) => (listingFilters[key].statuses as readonly string[]).includes(row.status)).length
					return (
						<Link
							key={key}
							href={key === "all" ? "/seller/listings" : `/seller/listings?show=${key}`}
							aria-current={current ? "page" : undefined}
							aria-label={`${label}, ${count}`}
							className={cn(
								"shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium",
								current ? "bg-foreground text-background border-foreground" : "hover:bg-muted"
							)}
						>
							{label} <span className="tabular-nums opacity-70">{count}</span>
						</Link>
					)
				})}
			</nav>

			{rows.length === 0 ? (
				<p className="text-muted-foreground py-16 text-center">
					{all.length === 0 ? "No listings yet. Create your first one to get started." : "No listings here."}
				</p>
			) : (
				<ul className="divide-y rounded-2xl border" aria-label="Listings">
					{rows.map((row) => {
						const breed = [row.breedName, row.crossBreedName].filter(Boolean).join(" × ")
						return (
							<li key={row.id}>
								<Link href={`/seller/listings/${row.id}`} className="hover:bg-muted/50 flex items-center gap-4 p-4">
									{row.coverUrl ? (
										<Image
											src={row.coverUrl}
											alt=""
											width={64}
											height={64}
											className="size-16 shrink-0 rounded-xl object-cover"
										/>
									) : (
										<PetPlaceholder
											label={breed || "New listing"}
											seed={row.id}
											className="size-16 shrink-0 [&_span]:text-lg"
										/>
									)}
									<div className="min-w-0 flex-1">
										<p className="truncate font-semibold">{row.title ?? "Untitled draft"}</p>
										<p className="text-muted-foreground truncate text-sm">
											{[breed || null, row.dateOfBirth && formatAge(row.dateOfBirth, today)]
												.filter(Boolean)
												.join(" · ") || "Details not added yet"}
										</p>
									</div>
									<div className="grid justify-items-end gap-1">
										<StatusBadge status={row.status} />
										<span className="text-sm tabular-nums">{row.priceCents ? formatPrice(row.priceCents) : "–"}</span>
									</div>
								</Link>
							</li>
						)
					})}
				</ul>
			)}
		</main>
	)
}
