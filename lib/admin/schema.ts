import { sellerTypes } from "@/lib/sellers/schema"
import { z } from "zod"
import { checklistKeys } from "./checklist"

const optionalText = (max: number, message: string) =>
	z
		.string()
		.trim()
		.max(max, message)
		.transform((value) => value || null)

export const reviewDecisions = ["approved", "rejected", "suspended", "reinstated"] as const
export type ReviewDecision = (typeof reviewDecisions)[number]

export const reviewSchema = z
	.object({
		decision: z.enum(reviewDecisions, "Choose a decision."),
		message: optionalText(1000, "Use 1,000 characters or fewer."),
		internalNote: optionalText(2000, "Use 2,000 characters or fewer."),
		checklist: z.array(z.string()),
	})
	.superRefine((review, ctx) => {
		if ((review.decision === "rejected" || review.decision === "suspended") && !review.message) {
			ctx.addIssue({ code: "custom", path: ["message"], message: "Tell the seller why. They'll see this message." })
		}
		if (review.decision === "approved" && !checklistKeys.every((key) => review.checklist.includes(key))) {
			ctx.addIssue({ code: "custom", path: ["checklist"], message: "Tick every check before approving." })
		}
	})

export type Review = z.infer<typeof reviewSchema>

/** Admin corrections to the details sellers can't change. Formats are checked loosely: admins are the authority. */
export const correctionSchema = z.object({
	sellerType: z.enum(sellerTypes, "Choose a seller type."),
	legalName: z.string().trim().min(1, "Enter the registered name.").max(160, "Use 160 characters or fewer."),
	uen: z
		.string()
		.trim()
		.toUpperCase()
		.regex(/^[0-9A-Z]{9,10}$/, "Enter a 9 or 10 character UEN."),
	licenceNo: z
		.string()
		.trim()
		.toUpperCase()
		.regex(/^[0-9A-Z]{5,12}$/, "Enter the licence number (letters and digits only)."),
	species: z.array(z.string()).min(1, "Choose at least one species."),
	internalNote: z.string().trim().min(1, "Explain the correction for the audit trail.").max(2000),
})
