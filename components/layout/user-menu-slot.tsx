import { getCurrentUser } from "@/lib/auth/session"
import { getCurrentSeller } from "@/lib/sellers/queries"
import { UserMenu } from "./user-menu"

/** Reads the session so the header can stream without waiting on it. Render inside `<Suspense>`. */
export async function UserMenuSlot() {
	const [user, seller] = await Promise.all([getCurrentUser(), getCurrentSeller()])
	return <UserMenu user={user} hasSeller={seller !== null} />
}
