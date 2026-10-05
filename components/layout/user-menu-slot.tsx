import { isPlatformAdmin } from "@/lib/admin/session"
import { getCurrentUser } from "@/lib/auth/session"
import { getCurrentSeller } from "@/lib/sellers/queries"
import { UserMenu } from "./user-menu"

/** Reads the session so the header can stream without waiting on it. Render inside `<Suspense>`. */
export async function UserMenuSlot() {
	const [user, seller, isAdmin] = await Promise.all([getCurrentUser(), getCurrentSeller(), isPlatformAdmin()])
	return <UserMenu user={user} hasSeller={seller !== null} isAdmin={isAdmin} />
}
