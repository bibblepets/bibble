import { getCurrentUser } from "@/lib/auth/session"
import { UserMenu } from "./user-menu"

/** Reads the session so the header can stream without waiting on it. Render inside `<Suspense>`. */
export async function UserMenuSlot() {
	const user = await getCurrentUser()
	return <UserMenu user={user} />
}
