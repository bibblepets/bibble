import { expect, type APIRequestContext } from "@playwright/test"

/** Local Supabase's mail catcher (`npm run db:start` prints it as MAILPIT_URL). */
const MAILPIT_URL = process.env.MAILPIT_URL ?? "http://127.0.0.1:54324"

type MessageSummary = { ID: string; Subject: string }

/** A unique address per test, so parallel tests never read each other's mail. */
export function uniqueEmail(label: string): string {
	return `e2e+${label}-${crypto.randomUUID().slice(0, 8)}@bibble.test`
}

/**
 * Waits for the newest email to `to` whose subject matches, and returns the path and query of its `/auth/confirm`
 * link. The origin is dropped so tests open it against Playwright's baseURL rather than Supabase's site_url.
 */
export async function authLinkFor(request: APIRequestContext, to: string, subject: RegExp): Promise<string> {
	let message: MessageSummary | undefined

	await expect
		.poll(
			async () => {
				const response = await request.get(`${MAILPIT_URL}/api/v1/search`, {
					params: { query: `to:"${to}"` },
				})
				const { messages } = (await response.json()) as { messages: MessageSummary[] }
				message = messages.find((m) => subject.test(m.Subject))
				return message
			},
			{ message: `email to ${to} matching ${subject}`, timeout: 15_000 }
		)
		.toBeTruthy()

	const response = await request.get(`${MAILPIT_URL}/api/v1/message/${message!.ID}`)
	const { HTML } = (await response.json()) as { HTML: string }
	const href = HTML.match(/href="([^"]*\/auth\/confirm[^"]*)"/)?.[1]
	expect(href, "auth link in email").toBeTruthy()
	const url = new URL(href!.replaceAll("&amp;", "&"))
	return url.pathname + url.search
}
