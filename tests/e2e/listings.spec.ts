import { expect, test, type Page } from "@playwright/test"
import { logIn } from "./helpers/auth"
import { approveSeller, fixture, isoDate, onboardSeller } from "./helpers/seller"

function section(page: Page, name: string) {
	return page.getByRole("region", { name })
}

function statusPanel(page: Page) {
	return page.getByRole("region", { name: "Listing status" })
}

function checklist(page: Page) {
	return page.getByRole("list", { name: "Before you can submit" })
}

async function save(scope: ReturnType<typeof section>, button = "Save") {
	await scope.getByRole("button", { name: button }).click()
	await expect(scope.getByRole("status").filter({ hasText: "Saved" })).toBeVisible()
}

async function addRecord(page: Page, kind: "Vaccination" | "Deworming", daysAgo: number, product: string) {
	const health = section(page, "Health")
	const records = health.getByRole("list", { name: "Health records" }).getByRole("listitem")
	const before = await records.count()
	await health.getByLabel("Type").selectOption({ label: kind })
	await health.getByLabel("Date given").fill(isoDate(-daysAgo))
	await health.getByLabel("Vaccine or dewormer").fill(product)
	await health.getByRole("button", { name: "Add record" }).click()
	// Wait for the new row (products can repeat) and for the form to clear before the next record.
	await expect(records).toHaveCount(before + 1)
	await expect(health.getByLabel("Vaccine or dewormer")).toHaveValue("")
}

test("a verified pet shop creates a complete listing and submits it for review", async ({ browser, page, request }) => {
	test.slow()
	const { tradingName } = await onboardSeller(page, request, "Listing Pets")
	await approveSeller(browser, tradingName)

	await page.goto("/seller")
	await page.getByRole("button", { name: "Create listing" }).click()
	await expect(page.getByRole("heading", { level: 1, name: "New listing" })).toBeVisible()
	await expect(checklist(page)).toContainText("Add the microchip number.")
	await expect(statusPanel(page).getByRole("button", { name: "Submit for review" })).toBeDisabled()

	// About the puppy. Part 1 breeds can't be chosen.
	const animal = section(page, "About the puppy")
	await expect(animal.getByRole("option", { name: /Akita/ }).first()).toBeDisabled()
	await animal.getByLabel("Breed").selectOption({ label: "Golden Retriever" })
	await animal.getByLabel("Sex").selectOption({ label: "Female" })
	await animal.getByLabel("Colour").fill("Golden")
	await animal.getByLabel("Date of birth").fill(isoDate(-70))
	await expect(animal.getByText(/Puppies can go home at 9 weeks: .* at the earliest/)).toBeVisible()
	await animal.getByLabel("Ready to go home").fill(isoDate(0))
	await animal.getByLabel("Weight in kg (optional)").fill("6.5")
	await save(animal)

	const info = section(page, "Title, price and description")
	await info.getByLabel("Title").fill("Sweet Golden Retriever girl")
	await info.getByLabel("Price (SGD)").fill("3,600")
	await info.getByLabel("Description (optional)").fill("Gentle and playful, raised with children.")
	await save(info)

	const health = section(page, "Health")
	await health.getByLabel("Microchip number").fill("900 085 000 123 456")
	await save(health, "Save microchip")
	await addRecord(page, "Deworming", 56, "Drontal Puppy")
	await addRecord(page, "Deworming", 42, "Drontal Puppy")
	await addRecord(page, "Vaccination", 28, "Nobivac DHP")
	await addRecord(page, "Vaccination", 14, "Nobivac DHPPi")

	const source = section(page, "Where the puppy comes from")
	await source.getByLabel(/From a licensed breeder/).check()
	await source.getByLabel("Breeder's AVS licence number").fill("br25001")
	await save(source)

	const documents = section(page, "Documents")
	await documents.locator("input[type=file]").setInputFiles(fixture("avs-licence.pdf"))
	await expect(documents).toContainText("avs-licence.pdf")

	// Photos: required to submit, resized and stripped of metadata in the browser.
	await expect(checklist(page)).toContainText("Add at least one photo.")
	const photos = section(page, "Photos")
	await photos.locator("input[type=file]").setInputFiles([fixture("puppy-1.png"), fixture("puppy-2.jpg")])
	const photoList = photos.getByRole("list", { name: "Photos" }).getByRole("img")
	await expect(photoList).toHaveCount(2)
	const firstCover = (await photoList.first().getAttribute("src"))!
	await photos.getByRole("button", { name: "Make photo 2 the cover" }).click()
	await expect(photoList.first()).not.toHaveAttribute("src", firstCover)
	await photos.getByRole("button", { name: "Remove photo 2" }).click()
	await expect(photoList).toHaveCount(1)

	// The remaining photo is the JPEG that had EXIF; what's stored is a clean WebP.
	const coverSrc = new URL((await photoList.first().getAttribute("src"))!, page.url()).searchParams.get("url")!
	const stored = await page.request.get(coverSrc)
	expect(stored.headers()["content-type"]).toBe("image/webp")
	const bytes = await stored.body()
	expect(bytes.includes("Exif")).toBe(false)
	expect(bytes.includes("GPSTEST")).toBe(false)

	await expect(statusPanel(page)).toContainText("Ready to submit")
	await statusPanel(page).getByRole("button", { name: "Submit for review" }).click()
	await expect(statusPanel(page)).toContainText("In review")
	await expect(page.getByRole("button", { name: "Save" })).toHaveCount(0)
	await expect(animal.getByLabel("Colour")).toBeDisabled()

	await page.getByRole("link", { name: "All listings" }).click()
	await page.getByRole("link", { name: /In review, 1/ }).click()
	await expect(page.getByRole("list", { name: "Listings" })).toContainText("Sweet Golden Retriever girl")
})

test("an unverified seller can draft but not submit, and sees the AVS rules", async ({ page, request }) => {
	test.slow()
	await onboardSeller(page, request, "Draft Pets")

	await expect(page.getByRole("region", { name: "Listings" })).toContainText(
		"submit them once your business is verified"
	)
	await page.getByRole("button", { name: "Create listing" }).click()
	await expect(checklist(page)).toContainText("Your business must be verified")

	const animal = section(page, "About the puppy")
	await animal.getByLabel("Breed").selectOption({ label: "Beagle" })
	await animal.getByLabel("Sex").selectOption({ label: "Male" })
	await animal.getByLabel("Colour").fill("Tricolour")
	await animal.getByLabel("Date of birth").fill(isoDate(-40))
	await animal.getByLabel("Ready to go home").fill(isoDate(0))
	await save(animal)
	await expect(checklist(page)).toContainText("Puppies can't go home before 9 weeks")
	// The saved value has come back from the server, so the field won't be remounted under us.
	await expect(animal.getByLabel("Ready to go home")).toHaveValue(isoDate(0))

	await animal.getByLabel("Ready to go home").fill(isoDate(-50))
	await animal.getByRole("button", { name: "Save" }).click()
	await expect(animal.getByText("The ready date can't be before the date of birth.")).toBeVisible()

	await addRecord(page, "Vaccination", 10, "Nobivac DHP")
	await expect(checklist(page)).toContainText("Add at least 2 vaccinations")
	await section(page, "Health")
		.getByRole("button", { name: /Remove vaccination/ })
		.click()
	await expect(section(page, "Health")).toContainText("No records yet.")

	// Drafts that were never submitted can be deleted.
	await statusPanel(page).getByRole("button", { name: "Delete draft" }).click()
	await statusPanel(page).getByRole("button", { name: "Yes, delete" }).click()
	await expect(page).toHaveURL("/seller/listings")
	await expect(page.getByText("No listings yet")).toBeVisible()
})

test("a breeder marks a live listing reserved and available, and sees the revise warning", async ({ page }) => {
	await logIn(page, "alice@bibble.test")
	await expect(page).toHaveURL("/")
	await page.goto("/seller/listings?show=active")
	await page.getByRole("link", { name: /Pomeranian boy/ }).click()

	await expect(section(page, "Where the puppy comes from")).toContainText("Bred on your licensed premises")
	await expect(page.getByRole("status").filter({ hasText: "This listing is live" })).toBeVisible()

	await statusPanel(page).getByRole("button", { name: "Mark as available" }).click()
	await expect(statusPanel(page)).toContainText("Live on Bibble.")
	await statusPanel(page).getByRole("button", { name: "Mark as reserved" }).click()
	await expect(statusPanel(page)).toContainText("shown to buyers as reserved")

	await statusPanel(page).getByRole("button", { name: "Revise listing" }).click()
	await expect(statusPanel(page)).toContainText("Your listing leaves the marketplace while you edit it")
	await statusPanel(page).getByRole("button", { name: "Cancel" }).click()
	await expect(statusPanel(page).getByRole("button", { name: "Yes, revise" })).toHaveCount(0)
})

test("sellers can't open each other's listings", async ({ page }) => {
	await logIn(page, "dave@bibble.test")
	await expect(page).toHaveURL("/")
	const response = await page.goto("/seller/listings/bbbbbbbb-0000-0000-0000-000000000001")
	expect(response?.status()).toBe(404)

	const malformed = await page.goto("/seller/listings/not-a-listing")
	expect(malformed?.status()).toBe(404)
})
