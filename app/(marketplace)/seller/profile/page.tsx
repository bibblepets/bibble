import { listAreas, requireSeller } from "@/lib/sellers/queries"
import { sellerTypeLabels } from "@/lib/sellers/status"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ProfileForm } from "./profile-form"

export const metadata: Metadata = { title: "Edit seller details" }

export default async function SellerProfilePage() {
	const seller = await requireSeller("/seller/profile")
	if (seller.status === "incomplete") {
		redirect("/seller/onboarding")
	}
	const areas = await listAreas()

	const locked = [
		{ label: "Business type", value: sellerTypeLabels[seller.sellerType] },
		{ label: "Licensed for", value: seller.species.map((s) => s.name).join(", ") },
		{ label: "Registered name", value: seller.legalName },
		{ label: "UEN", value: seller.uen },
		{ label: "AVS licence", value: seller.licenceNo },
	]

	return (
		<main className="mx-auto grid w-full max-w-2xl flex-1 gap-8 px-4 py-10 sm:px-6">
			<div>
				<Link href="/seller" className="text-sm font-semibold underline underline-offset-4">
					Back to seller account
				</Link>
				<h1 className="mt-4 text-3xl font-semibold tracking-tight">Edit seller details</h1>
			</div>

			<section aria-labelledby="locked-title" className="bg-muted/50 rounded-2xl border p-5">
				<h2 id="locked-title" className="font-semibold">
					Verified details
				</h2>
				<p className="text-muted-foreground mt-1 text-sm">
					These are checked against your AVS licence and ACRA registration. Contact us to change them.
				</p>
				<dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-[10rem_1fr]">
					{locked.map(({ label, value }) => (
						<div key={label} className="contents">
							<dt className="text-muted-foreground">{label}</dt>
							<dd>{value}</dd>
						</div>
					))}
				</dl>
			</section>

			<ProfileForm seller={seller} areas={areas} />
		</main>
	)
}
