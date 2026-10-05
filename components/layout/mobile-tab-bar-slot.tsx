import { getCurrentUser } from "@/lib/auth/session"
import { MobileTabBar } from "./mobile-tab-bar"

/** Reads the session for the tab bar. Render inside `<Suspense>`. */
export async function MobileTabBarSlot() {
	const user = await getCurrentUser()
	return <MobileTabBar signedIn={user !== null} />
}
