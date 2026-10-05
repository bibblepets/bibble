import { AnimalForm } from "@/components/listings/editor/animal-form"
import { EditorSection } from "@/components/listings/editor/editor-section"
import { HealthSection } from "@/components/listings/editor/health-section"
import { ListingActions } from "@/components/listings/editor/listing-actions"
import { ListingDocuments } from "@/components/listings/editor/listing-documents"
import { ListingInfoForm } from "@/components/listings/editor/listing-info-form"
import { SourceForm } from "@/components/listings/editor/source-form"
import { todayInSingapore } from "@/lib/dates"
import { listBreeds } from "@/lib/listings/queries"
import { incompleteSections, sellerCanList, submitIssues, type EditorSection as Section } from "@/lib/listings/rules"
import { requireOwnListing } from "@/lib/listings/session"
import { isEditable } from "@/lib/listings/status"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Edit listing" }

const sections: { id: Section; title: string }[] = [
	{ id: "animal", title: "About the puppy" },
	{ id: "listing", title: "Title, price and description" },
	{ id: "health", title: "Health" },
	{ id: "source", title: "Where the puppy comes from" },
	{ id: "documents", title: "Documents" },
]

export default async function ListingEditorPage({ params }: PageProps<"/seller/listings/[id]">) {
	const { id } = await params
	const { seller, listing } = await requireOwnListing(id)
	const breeds = await listBreeds()
	const today = todayInSingapore()

	const editable = isEditable(listing.status)
	const issues = submitIssues(listing, { sellerType: seller.sellerType, canList: sellerCanList(seller, today) }, today)
	const incomplete = incompleteSections(issues)

	return (
		<main className="mx-auto grid w-full max-w-6xl flex-1 content-start gap-6 px-4 py-10 sm:px-6">
			<div>
				<Link href="/seller/listings" className="text-sm font-semibold underline underline-offset-4">
					All listings
				</Link>
				<h1 className="mt-3 text-3xl font-semibold tracking-tight">{listing.title ?? "New listing"}</h1>
			</div>

			<div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
				<div className="grid gap-6">
					{!editable && (
						<p role="status" className="bg-muted rounded-xl p-4 text-sm">
							{listing.status === "published" || listing.status === "reserved"
								? "This listing is live, so it can't be edited. Choose Revise listing to make changes."
								: "This listing can't be edited right now."}
						</p>
					)}
					{sections.map(({ id: sectionId, title }) => (
						<EditorSection
							key={sectionId}
							id={sectionId}
							title={title}
							complete={!incomplete.has(sectionId)}
							description={
								sectionId === "documents"
									? "Only you and Bibble's verification team can see these."
									: sectionId === "source"
										? "AVS rules: breeders sell only animals they bred; pet shops buy from licensed breeders or import with a permit."
										: undefined
							}
						>
							{sectionId === "animal" && <AnimalForm listing={listing} breeds={breeds} editable={editable} />}
							{sectionId === "listing" && <ListingInfoForm listing={listing} editable={editable} />}
							{sectionId === "health" && <HealthSection listing={listing} editable={editable} />}
							{sectionId === "source" && (
								<SourceForm listing={listing} sellerType={seller.sellerType} editable={editable} />
							)}
							{sectionId === "documents" && <ListingDocuments listing={listing} editable={editable} />}
						</EditorSection>
					))}
				</div>
				<div className="lg:sticky lg:top-24">
					<ListingActions
						listingId={listing.id}
						status={listing.status}
						issues={issues}
						canDelete={listing.status === "draft" && listing.submittedAt === null}
					/>
				</div>
			</div>
		</main>
	)
}
