import { approvalChecklist, checklistKeys } from "@/lib/admin/checklist"
import { decisionLabels, formatDateTime, statusLabels, timeSince } from "@/lib/admin/display"
import { adminErrorMessage, GENERIC_ADMIN_ERROR } from "@/lib/admin/errors"
import { correctionSchema, reviewSchema } from "@/lib/admin/schema"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("approval checklist", () => {
	it("matches the keys the database requires", () => {
		const dir = path.join(process.cwd(), "supabase/migrations")
		const migration = readdirSync(dir).find((file) => file.endsWith("_seller_reviews.sql"))!
		const sql = readFileSync(path.join(dir, migration), "utf8")
		const body = /seller_approval_checklist\(\)[\s\S]*?array\[([\s\S]*?)\]/.exec(sql)![1]
		const sqlKeys = [...body.matchAll(/'([a-z_]+)'/g)].map((match) => match[1])

		expect(sqlKeys).toEqual([...checklistKeys])
		expect(approvalChecklist.every((item) => item.label.length > 10)).toBe(true)
	})
})

describe("reviewSchema", () => {
	const all = [...checklistKeys]

	it("approves with the full checklist", () => {
		expect(reviewSchema.parse({ decision: "approved", message: " ", internalNote: "", checklist: all })).toEqual({
			decision: "approved",
			message: null,
			internalNote: null,
			checklist: all,
		})
	})

	it("refuses an incomplete checklist", () => {
		const result = reviewSchema.safeParse({
			decision: "approved",
			message: "",
			internalNote: "",
			checklist: all.slice(1),
		})
		expect(result.error?.issues[0]).toMatchObject({
			path: ["checklist"],
			message: "Tick every check before approving.",
		})
	})

	it.each(["rejected", "suspended"])("needs a message to mark a seller %s", (decision) => {
		const result = reviewSchema.safeParse({ decision, message: "  ", internalNote: "", checklist: [] })
		expect(result.error?.issues[0]).toMatchObject({ path: ["message"] })
	})

	it("reinstates without a message", () => {
		expect(
			reviewSchema.safeParse({ decision: "reinstated", message: "", internalNote: "", checklist: [] }).success
		).toBe(true)
	})

	it("refuses unknown decisions and long text", () => {
		expect(reviewSchema.safeParse({ decision: "deleted", message: "", internalNote: "", checklist: [] }).success).toBe(
			false
		)
		expect(
			reviewSchema.safeParse({ decision: "rejected", message: "x".repeat(1001), internalNote: "", checklist: [] }).error
				?.issues[0].message
		).toBe("Use 1,000 characters or fewer.")
	})
})

describe("correctionSchema", () => {
	const correction = {
		sellerType: "pet_shop",
		legalName: " Happy Paws Trading ",
		uen: "53123456a",
		licenceNo: "as24a01000",
		species: ["dog"],
		internalNote: "Renewed licence",
	}

	it("normalises identifiers", () => {
		expect(correctionSchema.parse(correction)).toMatchObject({
			legalName: "Happy Paws Trading",
			uen: "53123456A",
			licenceNo: "AS24A01000",
		})
	})

	it.each([
		[{ internalNote: " " }, "Explain the correction for the audit trail."],
		[{ uen: "12" }, "Enter a 9 or 10 character UEN."],
		[{ licenceNo: "AS-1" }, "Enter the licence number (letters and digits only)."],
		[{ species: [] }, "Choose at least one species."],
		[{ sellerType: "vet" }, "Choose a seller type."],
		[{ legalName: "" }, "Enter the registered name."],
	])("rejects %j", (override, message) => {
		expect(correctionSchema.safeParse({ ...correction, ...override }).error?.issues[0].message).toBe(message)
	})
})

describe("adminErrorMessage", () => {
	it("maps codes from the admin functions", () => {
		expect(adminErrorMessage({ message: "invalid_transition" })).toMatch(/status has changed/)
		expect(adminErrorMessage({ message: "licence_expired" })).toMatch(/expired/)
	})

	it.each([null, {}, { message: "boom" }])("falls back for %j", (error) => {
		expect(adminErrorMessage(error)).toBe(GENERIC_ADMIN_ERROR)
	})
})

describe("display helpers", () => {
	const now = new Date("2026-10-02T12:00:00Z")

	it.each([
		["2026-10-02T11:50:00Z", "a few minutes"],
		["2026-10-02T13:00:00Z", "a few minutes"],
		["2026-10-02T11:00:00Z", "1 hour"],
		["2026-10-02T07:00:00Z", "5 hours"],
		["2026-10-01T12:00:00Z", "1 day"],
		["2026-09-28T12:00:00Z", "4 days"],
	])("time since %s is %s", (iso, expected) => {
		expect(timeSince(iso, now)).toBe(expected)
	})

	it("defaults to now", () => {
		expect(timeSince(new Date().toISOString())).toBe("a few minutes")
	})

	it("formats audit timestamps in Singapore time", () => {
		expect(formatDateTime("2026-10-01T17:15:00Z")).toMatch(/2 Oct 2026, 1:15\s?am/)
	})

	it("labels statuses and decisions", () => {
		expect(statusLabels.pending).toBe("Pending")
		expect(decisionLabels.details_corrected).toBe("Details corrected")
	})
})
