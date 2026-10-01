import type { CurrentSeller } from "@/lib/sellers/queries"

/** A fully filled-in seller. Override fields to model earlier wizard states or other statuses. */
export function makeSeller(overrides: Partial<CurrentSeller> = {}): CurrentSeller {
	return {
		id: "11111111-2222-3333-4444-555555555555",
		role: "owner",
		slug: null,
		status: "incomplete",
		sellerType: "pet_shop",
		displayName: "Happy Paws",
		legalName: "Happy Paws Trading",
		uen: "53123456A",
		licenceNo: "AS24A00123",
		licenceExpiresOn: "2027-10-01",
		about: "Neighbourhood pet shop.",
		areaId: 28,
		area: { name: "Tampines", region: "east" },
		addressLine1: "201 Tampines Street 21",
		addressLine2: "#01-1101",
		postalCode: "521201",
		contactPhone: "+6567891234",
		contactEmail: "dave@bibble.test",
		species: [{ slug: "dog", name: "Dogs" }],
		speciesCount: 1,
		documents: {
			avs_licence: { id: "d1", kind: "avs_licence", fileName: "licence.pdf", sizeBytes: 2048, createdAt: "2026-10-01" },
			acra_bizfile: {
				id: "d2",
				kind: "acra_bizfile",
				fileName: "bizfile.pdf",
				sizeBytes: 3_500_000,
				createdAt: "2026-10-01",
			},
		},
		documentKinds: ["avs_licence", "acra_bizfile"],
		submittedAt: null,
		verifiedAt: null,
		...overrides,
	}
}

/** A seller who has only finished the type step. */
export function makeNewSeller(overrides: Partial<CurrentSeller> = {}): CurrentSeller {
	return makeSeller({
		displayName: null,
		legalName: null,
		uen: null,
		licenceNo: null,
		licenceExpiresOn: null,
		about: null,
		areaId: null,
		area: null,
		addressLine1: null,
		addressLine2: null,
		postalCode: null,
		contactPhone: null,
		documents: {},
		documentKinds: [],
		...overrides,
	})
}
