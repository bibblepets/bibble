/** Today's date in Singapore as YYYY-MM-DD, the format Postgres `date` columns use. */
export function todayInSingapore(now: Date = new Date()): string {
	// en-CA formats dates as YYYY-MM-DD.
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Singapore" }).format(now)
}
