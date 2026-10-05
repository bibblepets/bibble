import { initialsFor, placeholderFor } from "@/lib/placeholder"
import { describe, expect, it } from "vitest"

describe("initialsFor", () => {
	it("takes the first letter of the first two words", () => {
		expect(initialsFor("Golden Retriever")).toBe("GR")
		expect(initialsFor("Cavalier King Charles Spaniel")).toBe("CK")
	})

	it("uses a single initial for one word", () => {
		expect(initialsFor("poodle")).toBe("P")
	})

	it("ignores surrounding and repeated whitespace", () => {
		expect(initialsFor("  shiba \t inu ")).toBe("SI")
	})

	it("falls back to a question mark when there are no words", () => {
		expect(initialsFor("")).toBe("?")
		expect(initialsFor("   ")).toBe("?")
	})

	it("skips punctuation and symbols", () => {
		expect(initialsFor("Poodle (Toy)")).toBe("PT")
		expect(initialsFor("🐶 Buddy")).toBe("B")
		expect(initialsFor("— & —")).toBe("?")
	})

	it("keeps letters outside the Basic Multilingual Plane intact", () => {
		expect(initialsFor("𝒜lpha bravo")).toBe("𝒜B")
	})
})

describe("placeholderFor", () => {
	it("is deterministic for the same seed", () => {
		expect(placeholderFor("Golden Retriever", "listing-1")).toEqual(placeholderFor("Golden Retriever", "listing-1"))
	})

	it("seeds from the label by default", () => {
		expect(placeholderFor("Beagle")).toEqual(placeholderFor("Beagle", "Beagle"))
	})

	it("spreads different seeds across several gradients", () => {
		const gradients = new Set(Array.from({ length: 50 }, (_, i) => placeholderFor("Beagle", `listing-${i}`).from))
		expect(gradients.size).toBeGreaterThan(3)
	})

	it("returns hex colours and initials", () => {
		const placeholder = placeholderFor("Shih Tzu")
		expect(placeholder.initials).toBe("ST")
		expect(placeholder.from).toMatch(/^#[0-9A-F]{6}$/)
		expect(placeholder.to).toMatch(/^#[0-9A-F]{6}$/)
	})
})
