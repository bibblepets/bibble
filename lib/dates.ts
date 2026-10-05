/** Today's date in Singapore as YYYY-MM-DD, the format Postgres `date` columns use. */
export function todayInSingapore(now: Date = new Date()): string {
	// en-CA formats dates as YYYY-MM-DD.
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore" }).format(now)
}

/** A YYYY-MM-DD date for display, e.g. "1 Oct 2027". */
export function formatDate(date: string): string {
	return new Intl.DateTimeFormat("en-SG", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
		new Date(`${date}T00:00:00Z`)
	)
}
