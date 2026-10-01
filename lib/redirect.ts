/**
 * Resolves a user-supplied redirect target (e.g. a `?next=` param) against `origin`,
 * falling back to `fallback` unless the result stays on the same origin.
 *
 * Validates the *parsed* URL rather than the raw string: the URL parser treats `\` as `/`
 * and strips tabs/newlines, so string checks like `startsWith("/")` are bypassable
 * (`/\evil.com` resolves to `http://evil.com/`).
 */
export function safeRedirectUrl(next: string | null, origin: string, fallback = "/"): URL {
	if (next) {
		try {
			const target = new URL(next, origin)
			if (target.origin === new URL(origin).origin) {
				return target
			}
		} catch {
			// Unparseable input falls through to the fallback.
		}
	}
	return new URL(fallback, origin)
}
