import { formatDate } from "@/lib/dates"
import { documentLabels, formatBytes } from "@/lib/sellers/documents"
import { documentKinds } from "@/lib/sellers/progress"
import type { CurrentSeller } from "@/lib/sellers/queries"
import { formatLocation, formatPhone, sellerTypeLabels } from "@/lib/sellers/status"
import Link from "next/link"
import type { ReactNode } from "react"

type Row = { label: string; value: ReactNode }

function Section({ title, editHref, rows }: { title: string; editHref?: string; rows: Row[] }) {
	return (
		<section className="border-b py-6 first:pt-0 last:border-b-0">
			<div className="flex items-baseline justify-between gap-4">
				<h2 className="text-lg font-semibold">{title}</h2>
				{editHref && (
					<Link
						href={editHref}
						aria-label={`Edit ${title.toLowerCase()}`}
						className="text-sm font-semibold underline underline-offset-4"
					>
						Edit
					</Link>
				)}
			</div>
			<dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[12rem_1fr]">
				{rows.map(({ label, value }) => (
					<div key={label} className="contents">
						<dt className="text-muted-foreground">{label}</dt>
						<dd className="break-words">{value ?? <span className="text-muted-foreground">Not provided</span>}</dd>
					</div>
				))}
			</dl>
		</section>
	)
}

/** Read-only view of a seller's details. Pass `editLinks` in the wizard to jump back to each step. */
export function SellerSummary({ seller, editLinks = false }: { seller: CurrentSeller; editLinks?: boolean }) {
	const edit = (step: string) => (editLinks ? `/seller/onboarding/${step}` : undefined)

	return (
		<div>
			<Section
				title="Business type"
				editHref={edit("type")}
				rows={[
					{ label: "Type", value: sellerTypeLabels[seller.sellerType] },
					{ label: "Licensed for", value: seller.species.map((s) => s.name).join(", ") || null },
				]}
			/>
			<Section
				title="Business details"
				editHref={edit("business")}
				rows={[
					{ label: "Trading name", value: seller.displayName },
					{ label: "Registered name", value: seller.legalName },
					{ label: "UEN", value: seller.uen },
					{ label: "AVS licence", value: seller.licenceNo },
					{ label: "Licence expires", value: seller.licenceExpiresOn && formatDate(seller.licenceExpiresOn) },
				]}
			/>
			<Section
				title="Premises and contact"
				editHref={edit("location")}
				rows={[
					{
						label: "Address",
						value: seller.addressLine1
							? [seller.addressLine1, seller.addressLine2, `Singapore ${seller.postalCode}`].filter(Boolean).join(", ")
							: null,
					},
					{ label: "Shown to buyers as", value: formatLocation(seller.area) },
					{ label: "Phone", value: seller.contactPhone && formatPhone(seller.contactPhone) },
					{ label: "Email", value: seller.contactEmail },
					{ label: "About", value: seller.about },
				]}
			/>
			<Section
				title="Documents"
				editHref={edit("documents")}
				rows={documentKinds.map((kind) => {
					const doc = seller.documents[kind]
					return {
						label: documentLabels[kind].title,
						value: doc ? `${doc.fileName} (${formatBytes(doc.sizeBytes)})` : null,
					}
				})}
			/>
		</div>
	)
}
