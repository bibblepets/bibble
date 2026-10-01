import { expect, test, type Browser, type Page } from "@playwright/test"
import { logIn } from "./helpers/auth"
import { onboardSeller } from "./helpers/seller"

/** carol, the seeded platform admin, in her own browser context. */
async function adminPage(browser: Browser): Promise<Page> {
	const page = await (await browser.newContext()).newPage()
	await logIn(page, "carol@bibble.test")
	await expect(page).toHaveURL("/")
	return page
}

async function openSeller(admin: Page, tradingName: string, status = "pending") {
	await admin.goto(`/admin/sellers?status=${status}`)
	await admin.getByRole("link", { name: tradingName }).click()
	await expect(admin.getByRole("heading", { level: 1, name: tradingName })).toBeVisible()
}

function decisionPanel(admin: Page) {
	return admin.getByRole("region", { name: "Decision" })
}

function statusBanner(page: Page) {
	return page.getByRole("status", { name: "Verification status" })
}

test("an admin approves, suspends, reinstates and corrects a seller", async ({ browser, page, request }) => {
	test.slow()
	const { tradingName } = await onboardSeller(page, request, "Approve Pets")
	const admin = await adminPage(browser)

	// The user menu links admins to the console.
	await admin.getByRole("banner").getByRole("button", { name: "Open menu" }).click()
	await admin.getByRole("menuitem", { name: "Admin" }).click()
	await expect(admin).toHaveURL("/admin/sellers")
	await expect(admin.getByRole("link", { name: /^Pending, \d+ sellers?$/ })).toHaveAttribute("aria-current", "page")

	await openSeller(admin, tradingName)
	await expect(admin.getByRole("main")).toContainText("10 Tampines Central 1")

	// Documents open through a short-lived signed URL.
	const licenceLink = admin.getByRole("link", { name: /avs-licence\.pdf/ })
	await expect(licenceLink).toHaveAttribute("target", "_blank")
	const download = await admin.request.get((await licenceLink.getAttribute("href"))!)
	expect(download.ok()).toBe(true)
	expect(download.headers()["content-type"]).toContain("application/pdf")

	// Approve needs the whole checklist.
	const approve = decisionPanel(admin).getByRole("button", { name: "Approve" })
	await expect(approve).toBeDisabled()
	for (const checkbox of await decisionPanel(admin).getByRole("checkbox").all()) {
		await checkbox.check()
	}
	await approve.click()
	await expect(admin.getByRole("region", { name: "History" })).toContainText("Approved by Carol")
	await expect(admin.getByRole("region", { name: "History" })).toContainText("All 6 checks ticked")

	await page.reload()
	await expect(statusBanner(page)).toContainText("You're verified")

	// Suspend needs a message, which the seller sees.
	await decisionPanel(admin).getByRole("button", { name: "Suspend seller" }).click()
	await expect(decisionPanel(admin)).toContainText("Tell the seller why")
	await decisionPanel(admin)
		.getByLabel("Message to the seller")
		.fill("Complaint about an unwell puppy is under review.")
	await decisionPanel(admin).getByLabel("Internal note (optional)").fill("Ticket #123")
	await decisionPanel(admin).getByRole("button", { name: "Suspend seller" }).click()
	await expect(admin.getByRole("region", { name: "History" })).toContainText("Internal: Ticket #123")

	await page.reload()
	await expect(statusBanner(page)).toContainText("Your seller account is suspended")
	await expect(statusBanner(page)).toContainText("Reason: Complaint about an unwell puppy is under review.")
	await expect(page.getByRole("main")).not.toContainText("Ticket #123")

	await decisionPanel(admin).getByRole("button", { name: "Reinstate seller" }).click()
	await expect(admin.getByRole("region", { name: "History" })).toContainText("Reinstated by Carol")
	await page.reload()
	await expect(statusBanner(page)).toContainText("You're verified")

	// Corrections change locked details with a note.
	await admin.getByText("Correct verified details").click()
	await admin.getByLabel("AVS licence number").fill("AS24A01000")
	await admin.getByRole("button", { name: "Save correction" }).click()
	await expect(admin.getByText("Explain the correction for the audit trail.")).toBeVisible()
	await admin.getByLabel("Reason for the correction").fill("Seller renewed; new licence number on email.")
	await admin.getByRole("button", { name: "Save correction" }).click()
	await expect(admin.getByRole("region", { name: "History" })).toContainText("Details corrected by Carol")
	await expect(admin.getByRole("main")).toContainText("AS24A01000")
})

test("a rejected seller sees the reason, fixes it and resubmits", async ({ browser, page, request }) => {
	test.slow()
	const { tradingName } = await onboardSeller(page, request, "Reject Pets")
	const admin = await adminPage(browser)
	await openSeller(admin, tradingName)

	await decisionPanel(admin).getByRole("button", { name: "Reject" }).click()
	await expect(decisionPanel(admin)).toContainText("Tell the seller why")
	await decisionPanel(admin).getByLabel("Message to the seller").fill("Your licence number isn't in the AVS registry.")
	await decisionPanel(admin).getByRole("button", { name: "Reject" }).click()
	await expect(admin.getByRole("region", { name: "History" })).toContainText("Rejected by Carol")
	await expect(decisionPanel(admin)).toContainText("Waiting for the seller to fix their details")

	await page.reload()
	await expect(statusBanner(page)).toContainText("Reason: Your licence number isn't in the AVS registry.")
	await page.getByRole("link", { name: "Review and resubmit" }).click()
	await expect(page.getByRole("main")).toContainText("Reason: Your licence number isn't in the AVS registry.")
	await page.getByRole("link", { name: "Edit business details" }).click()
	await page.getByLabel("AVS pet shop licence number").fill("AS24A00998")
	await page.getByRole("navigation", { name: "Steps" }).getByRole("button", { name: "Next" }).click()
	await page.goto("/seller/onboarding/review")
	await page.getByRole("button", { name: "Submit for verification" }).click()
	await expect(statusBanner(page)).toContainText("We're reviewing")

	await admin.goto("/admin/sellers?status=pending")
	await expect(admin.getByRole("link", { name: tradingName })).toBeVisible()
})

test("the admin console is hidden from everyone else", async ({ page }) => {
	await page.goto("/admin/sellers")
	await expect(page).toHaveURL("/login?next=%2Fadmin%2Fsellers")

	await logIn(page, "bob@bibble.test")
	await expect(page).toHaveURL("/")
	const response = await page.goto("/admin/sellers")
	expect(response?.status()).toBe(404)
	await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible()
	await expect(page.getByText("Admin", { exact: true })).toHaveCount(0)

	const documentResponse = await page.request.get("/admin/documents/00000000-0000-0000-0000-000000000000")
	expect(documentResponse.status()).toBe(404)
})
