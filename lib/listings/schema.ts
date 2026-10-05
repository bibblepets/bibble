import { todayInSingapore } from "@/lib/dates"
import type { SellerType } from "@/lib/sellers/schema"
import { z } from "zod"

const optionalText = (max: number, message: string) =>
	z
		.string()
		.trim()
		.max(max, message)
		.transform((value) => value || null)

/** An optional number from a form field: "" → null. */
const optionalMeasure = (max: number, label: string) =>
	z
		.string()
		.trim()
		.transform((value) => (value === "" ? null : Number(value)))
		.pipe(
			z
				.number(`Enter the ${label} as a number.`)
				.positive(`Enter the ${label} as a number.`)
				.max(max, `That ${label} looks too large.`)
				.multipleOf(0.1, "Use at most one decimal place.")
				.nullable()
		)

const isoDate = (message: string) => z.iso.date(message)

/** The "About the animal" section. */
export function animalSchema(today: string = todayInSingapore()) {
	return z
		.object({
			breedId: z.coerce.number("Choose a breed.").int("Choose a breed.").positive("Choose a breed."),
			crossBreedId: z
				.string()
				.transform((value) => (value === "" ? null : Number(value)))
				.pipe(z.number().int().positive().nullable()),
			sex: z.enum(["male", "female"], "Choose the sex."),
			colour: z.string().trim().min(1, "Enter the colour.").max(40, "Use 40 characters or fewer."),
			dateOfBirth: isoDate("Enter the date of birth.").refine((date) => date <= today, "This date is in the future."),
			readyDate: isoDate("Enter the date the puppy can go home."),
			weightKg: optionalMeasure(150, "weight"),
			heightCm: optionalMeasure(120, "height"),
			sterilised: z.literal("on").optional().transform(Boolean),
		})
		.refine((animal) => animal.crossBreedId !== animal.breedId, {
			path: ["crossBreedId"],
			message: "Choose a different breed for a cross, or leave it empty.",
		})
		.refine((animal) => animal.readyDate >= animal.dateOfBirth, {
			path: ["readyDate"],
			message: "The ready date can't be before the date of birth.",
		})
}

/** "3,500" or "3500.50" dollars → cents. */
const price = z
	.string()
	.trim()
	.transform((value) => value.replace(/[$,\s]/g, ""))
	.pipe(z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a price in dollars, e.g. 3500."))
	.transform((value) => Math.round(Number(value) * 100))
	.pipe(z.number().min(100, "Enter a price of at least $1.").max(100_000_000, "That price looks too high."))

/** The "Title, price and description" section. */
export const listingSchema = z.object({
	title: z.string().trim().min(5, "Use at least 5 characters.").max(80, "Use 80 characters or fewer."),
	priceCents: price,
	description: optionalText(2000, "Use 2,000 characters or fewer."),
})

export const microchipSchema = z.object({
	microchipNo: z
		.string()
		.transform((value) => value.replace(/\s/g, ""))
		.pipe(z.string().regex(/^\d{15}$/, "Enter the 15-digit microchip number.")),
})

export function healthRecordSchema(today: string = todayInSingapore()) {
	return z.object({
		kind: z.enum(["vaccination", "deworming"], "Choose vaccination or deworming."),
		givenOn: isoDate("Enter the date it was given.").refine((date) => date <= today, "This date is in the future."),
		product: z.string().trim().min(1, "Enter the vaccine or dewormer.").max(80, "Use 80 characters or fewer."),
		clinic: optionalText(120, "Use 120 characters or fewer."),
	})
}

const licenceNo = z
	.string()
	.trim()
	.toUpperCase()
	.regex(/^[0-9A-Z]{5,12}$/, "Enter the breeder's AVS licence number, e.g. BR25008.")

/** Where the animal comes from. Breeders only sell animals they bred; pet shops buy from breeders or import. */
export function sourceSchema(sellerType: SellerType, today: string = todayInSingapore()) {
	if (sellerType === "breeder") {
		return z.object({ source: z.literal("bred_on_premises", "Breeders can only sell animals they bred.") })
	}
	return z.discriminatedUnion(
		"source",
		[
			z.object({ source: z.literal("licensed_breeder"), sourceLicenceNo: licenceNo }),
			z.object({
				source: z.literal("imported"),
				importPermitNo: z
					.string()
					.trim()
					.min(1, "Enter the import permit number.")
					.max(40, "Use 40 characters or fewer."),
				arrivalDate: isoDate("Enter the arrival date.").refine((date) => date <= today, "This date is in the future."),
			}),
		],
		"Choose where the animal comes from."
	)
}
