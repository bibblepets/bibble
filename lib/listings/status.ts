export const listingStatuses = [
	"draft",
	"pending_review",
	"changes_requested",
	"published",
	"reserved",
	"sold",
	"rejected",
	"suspended",
	"archived",
] as const
export type ListingStatus = (typeof listingStatuses)[number]

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger"

export const statusDisplay: Record<ListingStatus, { label: string; tone: StatusTone }> = {
	draft: { label: "Draft", tone: "neutral" },
	pending_review: { label: "In review", tone: "info" },
	changes_requested: { label: "Changes requested", tone: "warning" },
	published: { label: "Live", tone: "success" },
	reserved: { label: "Reserved", tone: "info" },
	sold: { label: "Sold", tone: "neutral" },
	rejected: { label: "Rejected", tone: "danger" },
	suspended: { label: "Suspended", tone: "danger" },
	archived: { label: "Archived", tone: "neutral" },
}

/** Statuses buyers can see (from a verified seller). */
export const publicStatuses: readonly ListingStatus[] = ["published", "reserved", "sold"]

/** Statuses in which the seller can edit the listing. */
export const editableStatuses: readonly ListingStatus[] = ["draft", "changes_requested"]

export function isEditable(status: ListingStatus): boolean {
	return editableStatuses.includes(status)
}

/** Groups for the seller's listings table. */
export const listingFilters = {
	active: { label: "Active", statuses: ["published", "reserved"] },
	review: { label: "In review", statuses: ["pending_review", "changes_requested"] },
	drafts: { label: "Drafts", statuses: ["draft"] },
	sold: { label: "Sold", statuses: ["sold"] },
	closed: { label: "Archived", statuses: ["archived", "rejected", "suspended"] },
} as const satisfies Record<string, { label: string; statuses: readonly ListingStatus[] }>

export type ListingFilter = keyof typeof listingFilters

/** "$3,800" from cents. Whole dollars when there are no cents. */
export function formatPrice(cents: number): string {
	return new Intl.NumberFormat("en-SG", {
		style: "currency",
		currency: "SGD",
		currencyDisplay: "narrowSymbol",
		minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
	}).format(cents / 100)
}
