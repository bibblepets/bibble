import type { SellerStatus } from "./progress"

export type StatusCopy = { title: string; description: string; tone: "info" | "warning" | "success" | "danger" }

const copy: Record<SellerStatus, StatusCopy> = {
	incomplete: {
		title: "Finish setting up your business",
		description: "Complete your details and upload your documents so we can verify you.",
		tone: "info",
	},
	pending: {
		title: "We're reviewing your details",
		description: "We check every licence with AVS and ACRA records. This usually takes up to 2 working days.",
		tone: "info",
	},
	verified: {
		title: "You're verified",
		description: "Your business is verified. You'll be able to create listings here soon.",
		tone: "success",
	},
	rejected: {
		title: "Your application needs changes",
		description: "We couldn't verify your business with the details provided. Update them and submit again.",
		tone: "warning",
	},
	suspended: {
		title: "Your seller account is suspended",
		description: "Your listings are hidden. Contact us to resolve this.",
		tone: "danger",
	},
}

export function statusCopy(status: SellerStatus): StatusCopy {
	return copy[status]
}

const DAY_MS = 24 * 60 * 60 * 1000

/** Days until the licence expires (negative once expired), comparing calendar dates. */
export function daysUntil(date: string, today: string): number {
	return Math.round((Date.parse(date) - Date.parse(today)) / DAY_MS)
}

export const sellerTypeLabels = { pet_shop: "Pet shop", breeder: "Breeder" } as const

export const regionLabels: Record<string, string> = {
	central: "Central",
	east: "East",
	north: "North",
	north_east: "North-East",
	west: "West",
}

/** Public location, e.g. "Tampines, East". */
export function formatLocation(area: { name: string; region: string } | null): string | null {
	return area ? `${area.name}, ${regionLabels[area.region] ?? area.region}` : null
}

/** "+6591234567" → "+65 9123 4567". Anything unexpected is returned unchanged. */
export function formatPhone(phone: string): string {
	const match = /^\+65(\d{4})(\d{4})$/.exec(phone)
	return match ? `+65 ${match[1]} ${match[2]}` : phone
}
