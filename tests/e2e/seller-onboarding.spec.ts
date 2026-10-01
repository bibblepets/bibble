import { expect, test, type Page } from "@playwright/test"
import path from "node:path"
import { logIn, signUpConfirmed } from "./helpers/auth"
import { uniqueEmail } from "./helpers/mailpit"

const fixture = (name: string) => path.join(__dirname, "fixtures", name)

/** A UEN no other run has used: 8 random digits + a letter. */
function uniqueUen() {
	return `${String(Math.floor(Math.random() * 1e8)).padStart(8, "0")}A`
}

function isoDate(daysFromNow: number) {
	return new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function next(page: Page) {
	return page.getByRole("navigation", { name: "Steps" }).getByRole("button", { name: "Next" })
}

function uploadTile(page: Page, title: string) {
	return page.getByRole("region", { name: title })
}

test("a new user onboards as a pet shop, resumes later and submits for verification", async ({ page, request }) => {
	test.slow()
	await signUpConfirmed(page, request, uniqueEmail("seller"), "Shop Owner")

	await page.getByRole("banner").getByRole("link", { name: "Become a seller" }).click()
	await expect(page.getByRole("heading", { name: "Sell on Bibble" })).toBeVisible()
	await page.getByRole("link", { name: "Get started" }).click()

	// Step 1: type.
	await expect(page.getByRole("progressbar", { name: "Step 1 of 5" })).toBeVisible()
	await page.getByText("Pet shop", { exact: true }).click()
	await expect(page.getByRole("checkbox", { name: "Dogs" })).toBeChecked()
	await expect(page.getByRole("checkbox", { name: /Cats/ })).toBeDisabled()
	await next(page).click()

	// Step 2: business, with validation errors first.
	await expect(page).toHaveURL("/seller/onboarding/business")
	await page.getByLabel("Trading name").fill("Paws & Claws")
	await page.getByLabel("Registered business name").fill("Paws and Claws Pte. Ltd.")
	await page.getByLabel("UEN").fill("123")
	await page.getByLabel("AVS pet shop licence number").fill("BR25008")
	await page.getByLabel("Licence expiry date").fill(isoDate(-1))
	await next(page).click()
	await expect(page.getByText("Enter a valid UEN, e.g. 202301234K.")).toBeVisible()
	await expect(page.getByText(/Enter your AVS licence number, e.g. AS24A00123/)).toBeVisible()
	await expect(page.getByText(/This licence has expired/)).toBeVisible()
	await expect(page.getByLabel("Trading name")).toHaveValue("Paws & Claws")

	await page.getByLabel("UEN").fill(uniqueUen())
	await page.getByLabel("AVS pet shop licence number").fill("as24a00999")
	await page.getByLabel("Licence expiry date").fill(isoDate(200))
	await next(page).click()

	// Step 3: location, then save and leave.
	await expect(page).toHaveURL("/seller/onboarding/location")
	await page.getByLabel("Address", { exact: true }).fill("10 Tampines Central 1")
	await page.getByLabel("Postal code").fill("529536")
	await page.getByLabel("Area").selectOption({ label: "Tampines" })
	await expect(page.getByText("Buyers will see: Tampines, East")).toBeVisible()
	await page.getByLabel("Phone").fill("6789 1234")
	await page.getByRole("button", { name: "Save & exit" }).click()

	await expect(page).toHaveURL("/seller")
	await expect(page.getByRole("status", { name: "Verification status" })).toContainText("Finish setting up")
	await expect(page.getByRole("link", { name: /Upload your AVS licence and ACRA BizFile \(to do\)/ })).toBeVisible()
	await expect(page.getByRole("banner").getByRole("link", { name: "Switch to selling" })).toBeVisible()

	// Coming back resumes at the documents step.
	await page.goto("/seller/onboarding")
	await page.getByRole("link", { name: "Continue" }).click()
	await expect(page).toHaveURL("/seller/onboarding/documents")
	await expect(page.getByRole("navigation", { name: "Steps" }).getByRole("button", { name: "Next" })).toBeDisabled()

	// Step 4: documents. A wrong file type is refused in the browser.
	await uploadTile(page, "AVS licence").locator("input[type=file]").setInputFiles(fixture("notes.txt"))
	await expect(uploadTile(page, "AVS licence").getByRole("alert")).toHaveText("Upload a PDF, JPG or PNG.")
	await uploadTile(page, "AVS licence").locator("input[type=file]").setInputFiles(fixture("avs-licence.pdf"))
	await expect(uploadTile(page, "AVS licence")).toContainText("avs-licence.pdf")
	await uploadTile(page, "ACRA BizFile").locator("input[type=file]").setInputFiles(fixture("acra-bizfile.pdf"))
	await expect(uploadTile(page, "ACRA BizFile")).toContainText("acra-bizfile.pdf")
	await page.getByRole("navigation", { name: "Steps" }).getByRole("link", { name: "Next" }).click()

	// Step 5: review and submit.
	await expect(page).toHaveURL("/seller/onboarding/review")
	await expect(page.getByRole("main")).toContainText("AS24A00999")
	await expect(page.getByRole("main")).toContainText("Tampines, East")
	await page.getByRole("button", { name: "Submit for verification" }).click()

	await expect(page).toHaveURL("/seller")
	await expect(page.getByRole("status", { name: "Verification status" })).toContainText("We're reviewing your details")

	// Submitted sellers can't reopen the wizard.
	await page.goto("/seller/onboarding/business")
	await expect(page).toHaveURL("/seller")
})

test("seller pages require logging in", async ({ page }) => {
	await page.goto("/seller")
	await expect(page).toHaveURL("/login?next=%2Fseller")

	await page.goto("/seller/onboarding/documents")
	await expect(page).toHaveURL("/login?next=%2Fseller%2Fonboarding%2Fdocuments")
})

test("skipping ahead in the wizard returns to the first unfinished step", async ({ page }) => {
	// bob has no seller account, so everything after the type step is out of reach.
	await logIn(page, "bob@bibble.test")
	await expect(page).toHaveURL("/")
	await page.goto("/seller/onboarding/review")
	await expect(page).toHaveURL("/seller/onboarding/type")

	await page.goto("/seller")
	await expect(page).toHaveURL("/seller/onboarding")
})

test("a verified seller sees their status and can edit unlocked details", async ({ page }) => {
	await logIn(page, "dave@bibble.test")
	await page.getByRole("banner").getByRole("link", { name: "Switch to selling" }).click()

	await expect(page.getByRole("heading", { name: "Happy Paws Pet Shop" })).toBeVisible()
	await expect(page.getByRole("status", { name: "Verification status" })).toContainText("You're verified")

	await page.getByRole("link", { name: "Edit details" }).click()
	const verified = page.getByRole("region", { name: "Verified details" })
	await expect(verified).toContainText("53123456A")
	await expect(verified).toContainText("AS24A00123")
	await expect(page.getByLabel("UEN")).toHaveCount(0)

	const about = `Neighbourhood pet shop. Updated ${Date.now()}.`
	await page.getByLabel("About your business (optional)").fill(about)
	await page.getByRole("button", { name: "Save changes" }).click()

	await expect(page).toHaveURL("/seller")
	await expect(page.getByRole("main")).toContainText(about)
})

test("the wizard footer stays usable on a phone", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 })
	await logIn(page, "bob@bibble.test")
	await expect(page).toHaveURL("/")
	await page.goto("/seller/onboarding/type")

	await expect(next(page)).toBeInViewport()
	await expect(page.getByRole("navigation", { name: "Steps" }).getByRole("link", { name: "Back" })).toBeInViewport()
})
