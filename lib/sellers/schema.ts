import { todayInSingapore } from "@/lib/dates"
import { z } from "zod"

export const sellerTypes = ["pet_shop", "breeder"] as const
export type SellerType = (typeof sellerTypes)[number]

/**
 * AVS licence number formats, inferred from the public AVS registries (Sep 2026) rather than a published spec.
 * Pet shop: "AS" + 2-digit year + month letter + 4–5 digits (AS19J00045). Breeder: "BR" + 5 digits (BR25008).
 */
const licencePatterns: Record<SellerType, { pattern: RegExp; example: string }> = {
	pet_shop: { pattern: /^AS\d{2}[A-HJ-M]\d{4,5}$/, example: "AS24A00123" },
	breeder: { pattern: /^BR\d{5}$/, example: "BR25008" },
}

export function licenceExample(sellerType: SellerType): string {
	return licencePatterns[sellerType].example
}

/** ACRA UEN formats: businesses (8 digits + letter), local companies (year + 5 digits + letter), other entities. */
const uenPattern = /^(\d{8}[A-Z]|(18|19|20)\d{7}[A-Z]|[RST]\d{2}[A-Z][A-Z0-9]\d{4}[A-Z])$/

const upperTrimmed = z.string().trim().toUpperCase()
const optionalText = (max: number, message: string) =>
	z
		.string()
		.trim()
		.max(max, message)
		.transform((value) => value || null)

export const typeStepSchema = z.object({
	sellerType: z.enum(sellerTypes, "Choose the kind of business you run."),
	species: z.array(z.string()).min(1, "Choose at least one kind of animal your licence covers."),
})

export function businessStepSchema(sellerType: SellerType, today: string = todayInSingapore()) {
	const licence = licencePatterns[sellerType]
	return z.object({
		displayName: z.string().trim().min(1, "Enter the name buyers will see.").max(80, "Use 80 characters or fewer."),
		legalName: z
			.string()
			.trim()
			.min(1, "Enter the name registered with ACRA.")
			.max(160, "Use 160 characters or fewer."),
		uen: upperTrimmed.pipe(z.string().regex(uenPattern, "Enter a valid UEN, e.g. 202301234K.")),
		licenceNo: upperTrimmed.pipe(
			z
				.string()
				.regex(
					licence.pattern,
					`Enter your AVS licence number, e.g. ${licence.example}. If yours looks different, contact us.`
				)
		),
		licenceExpiresOn: z.iso
			.date("Enter the licence expiry date.")
			.refine((date) => date >= today, "This licence has expired. Renew it with AVS before applying."),
	})
}

/** Accepts local formats like "9123 4567" or "+65 9123-4567" and normalises to +6591234567. */
const sgPhone = z
	.string()
	.transform((value) => value.replace(/[\s-]/g, ""))
	.transform((value) => (/^\d{8}$/.test(value) ? `+65${value}` : value))
	.pipe(z.string().regex(/^\+65[3689]\d{7}$/, "Enter a Singapore phone number, e.g. 9123 4567."))

export const locationStepSchema = z.object({
	addressLine1: z.string().trim().min(1, "Enter your premises address.").max(120, "Use 120 characters or fewer."),
	addressLine2: optionalText(120, "Use 120 characters or fewer."),
	postalCode: z
		.string()
		.trim()
		.regex(/^\d{6}$/, "Enter a 6-digit postal code."),
	areaId: z.coerce
		.number("Choose the area your premises are in.")
		.int("Choose the area your premises are in.")
		.positive("Choose the area your premises are in."),
	contactPhone: sgPhone,
	contactEmail: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
	about: optionalText(1000, "Use 1,000 characters or fewer."),
})

export type TypeStep = z.infer<typeof typeStepSchema>
export type BusinessStep = z.infer<ReturnType<typeof businessStepSchema>>
export type LocationStep = z.infer<typeof locationStepSchema>
