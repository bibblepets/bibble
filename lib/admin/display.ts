import type { SellerStatus } from "@/lib/sellers/progress"
import type { SellerType } from "@/lib/sellers/schema"

export const statusLabels: Record<SellerStatus, string> = {
	pending: "Pending",
	verified: "Verified",
	rejected: "Rejected",
	suspended: "Suspended",
	incomplete: "Incomplete",
}

/** Queue tab order: work first, then outcomes, then sellers still filling in the wizard. */
export const queueStatuses: SellerStatus[] = ["pending", "verified", "rejected", "suspended", "incomplete"]

export const decisionLabels: Record<string, string> = {
	approved: "Approved",
	rejected: "Rejected",
	suspended: "Suspended",
	reinstated: "Reinstated",
	details_corrected: "Details corrected",
}

/** Public AVS registries to check a licence number against. */
export const avsRegistryUrls: Record<SellerType, string> = {
	pet_shop: "https://avs.nparks.gov.sg/outreach/resources/public-registry-of-avs-licensed-pet-shops/",
	breeder: "https://avs.nparks.gov.sg/outreach/resources/public-registry-of-avs-licensed-pet-breeders/",
}

export const uenSearchUrl = "https://www.uen.gov.sg/"

/** "3 days", "5 hours" or "a few minutes" between two instants. */
export function timeSince(iso: string, now: Date = new Date()): string {
	const minutes = Math.max(0, Math.floor((now.getTime() - Date.parse(iso)) / 60_000))
	if (minutes < 60) return "a few minutes"
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`
	const days = Math.floor(hours / 24)
	return `${days} day${days === 1 ? "" : "s"}`
}

/** A timestamp for audit trails, e.g. "2 Oct 2026, 9:15 am", in Singapore time. */
export function formatDateTime(iso: string): string {
	return new Intl.DateTimeFormat("en-SG", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
		timeZone: "Asia/Singapore",
	}).format(new Date(iso))
}
