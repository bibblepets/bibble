import { formatDate } from "@/lib/dates"
import {
	documentFileError,
	documentStoragePath,
	formatBytes,
	isAllowedContentType,
	MAX_DOCUMENT_BYTES,
} from "@/lib/sellers/documents"
import { GENERIC_SELLER_ERROR, isDuplicateUen, sellerErrorMessage } from "@/lib/sellers/errors"
import { daysUntil, formatLocation, formatPhone, statusCopy } from "@/lib/sellers/status"
import { describe, expect, it } from "vitest"

describe("sellerErrorMessage", () => {
	it("maps codes raised by the database functions", () => {
		expect(sellerErrorMessage({ message: "missing_documents" })).toMatch(/AVS licence and your ACRA BizFile/)
		expect(sellerErrorMessage({ message: "seller_details_locked" })).toMatch(/can't be changed after submitting/)
	})

	it.each([null, undefined, {}, { message: "permission denied for table sellers" }])("falls back for %j", (error) => {
		expect(sellerErrorMessage(error)).toBe(GENERIC_SELLER_ERROR)
	})
})

describe("isDuplicateUen", () => {
	it("recognises the UEN unique constraint", () => {
		expect(
			isDuplicateUen({ code: "23505", message: 'duplicate key value violates unique constraint "sellers_uen_key"' })
		).toBe(true)
	})

	it.each([null, { code: "23505", message: "sellers_slug_key" }, { code: "23514", message: "sellers_uen_key" }])(
		"ignores %j",
		(error) => {
			expect(isDuplicateUen(error)).toBe(false)
		}
	)
})

describe("status helpers", () => {
	it("has copy for every status", () => {
		for (const status of ["incomplete", "pending", "verified", "rejected", "suspended"] as const) {
			expect(statusCopy(status).title).toBeTruthy()
		}
		expect(statusCopy("verified").tone).toBe("success")
		expect(statusCopy("suspended").tone).toBe("danger")
	})

	it("counts days between calendar dates", () => {
		expect(daysUntil("2026-10-31", "2026-10-01")).toBe(30)
		expect(daysUntil("2026-09-30", "2026-10-01")).toBe(-1)
	})

	it("formats the public location", () => {
		expect(formatLocation({ name: "Ang Mo Kio", region: "north_east" })).toBe("Ang Mo Kio, North-East")
		expect(formatLocation({ name: "Somewhere", region: "unknown" })).toBe("Somewhere, unknown")
		expect(formatLocation(null)).toBeNull()
	})

	it("formats Singapore phone numbers", () => {
		expect(formatPhone("+6591234567")).toBe("+65 9123 4567")
		expect(formatPhone("12345")).toBe("12345")
	})

	it("formats dates for display", () => {
		expect(formatDate("2027-10-01")).toBe("1 Oct 2027")
	})
})

describe("document helpers", () => {
	it.each([
		[{ type: "application/pdf", size: 1000 }, null],
		[{ type: "image/png", size: MAX_DOCUMENT_BYTES }, null],
		[{ type: "text/plain", size: 10 }, "Upload a PDF, JPG or PNG."],
		[{ type: "image/jpeg", size: 0 }, "That file is empty."],
		[{ type: "image/jpeg", size: MAX_DOCUMENT_BYTES + 1 }, "Files can be up to 10 MB."],
	])("checks %j", (file, error) => {
		expect(documentFileError(file)).toBe(error)
	})

	it("builds storage paths inside the seller's folder", () => {
		expect(isAllowedContentType("image/jpeg")).toBe(true)
		expect(documentStoragePath("seller-1", "image/jpeg", "abc")).toBe("seller-1/abc.jpg")
		expect(documentStoragePath("seller-1", "application/pdf", "abc")).toBe("seller-1/abc.pdf")
	})

	it("formats sizes", () => {
		expect(formatBytes(500)).toBe("500 B")
		expect(formatBytes(2048)).toBe("2 KB")
		expect(formatBytes(3_500_000)).toBe("3.3 MB")
	})
})
