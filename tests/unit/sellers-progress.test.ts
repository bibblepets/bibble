import {
	canOpenStep,
	completedSteps,
	isEditableInWizard,
	remainingStepCount,
	resumeStep,
	type SellerProgressInput,
} from "@/lib/sellers/progress"
import { describe, expect, it } from "vitest"

const started: SellerProgressInput = {
	status: "incomplete",
	sellerType: "breeder",
	speciesCount: 1,
	displayName: null,
	legalName: null,
	uen: null,
	licenceNo: null,
	licenceExpiresOn: null,
	planningAreaId: null,
	addressLine1: null,
	postalCode: null,
	contactPhone: null,
	contactEmail: "a@b.test",
	documentKinds: [],
}
const withBusiness = {
	...started,
	displayName: "Pawsome",
	legalName: "Pawsome Pte. Ltd.",
	uen: "202301234K",
	licenceNo: "BR25008",
	licenceExpiresOn: "2027-01-01",
}
const withLocation = {
	...withBusiness,
	planningAreaId: 1,
	addressLine1: "1 Road",
	postalCode: "123456",
	contactPhone: "+6591234567",
}
const complete: SellerProgressInput = { ...withLocation, documentKinds: ["avs_licence", "acra_bizfile"] }

describe("wizard progress", () => {
	it("starts at the type step without a seller", () => {
		expect([...completedSteps(null)]).toEqual([])
		expect(resumeStep(null)).toBe("type")
		expect(canOpenStep(null, "type")).toBe(true)
		expect(canOpenStep(null, "business")).toBe(false)
	})

	it.each([
		[started, "business", ["type"]],
		[withBusiness, "location", ["type", "business"]],
		[withLocation, "documents", ["type", "business", "location"]],
		[{ ...withLocation, documentKinds: ["avs_licence"] as const }, "documents", ["type", "business", "location"]],
		[complete, "review", ["type", "business", "location", "documents", "review"]],
	])("resumes where the seller left off (%#)", (seller, step, done) => {
		expect(resumeStep(seller)).toBe(step)
		expect([...completedSteps(seller)]).toEqual(done)
	})

	it("treats a seller with no species as not past the first step", () => {
		expect(resumeStep({ ...complete, speciesCount: 0 })).toBe("type")
	})

	it("only opens a step once the earlier ones are done", () => {
		expect(canOpenStep(withBusiness, "location")).toBe(true)
		expect(canOpenStep(withBusiness, "documents")).toBe(false)
		expect(canOpenStep(complete, "review")).toBe(true)
	})

	it("counts the steps left before submitting", () => {
		expect(remainingStepCount(started)).toBe(3)
		expect(remainingStepCount(withLocation)).toBe(1)
		expect(remainingStepCount(complete)).toBe(0)
	})

	it.each([
		["incomplete", true],
		["rejected", true],
		["pending", false],
		["verified", false],
		["suspended", false],
	] as const)("wizard editing for %s is %s", (status, editable) => {
		expect(isEditableInWizard(status)).toBe(editable)
	})
})
