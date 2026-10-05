import { Logo } from "@/components/brand/logo"
import { UserMenuFallback } from "@/components/layout/user-menu"
import { UserMenuSlot } from "@/components/layout/user-menu-slot"
import { isPlatformAdmin } from "@/lib/admin/session"
import Link from "next/link"
import { Suspense } from "react"

/**
 * Admin chrome. Non-admins get the bare page, which redirects them to log in or 404s, so the console isn't
 * revealed. Pages and actions do the real access checks.
 */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
	if (!(await isPlatformAdmin())) {
		return children
	}

	return (
		<>
			<header className="border-b">
				<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
					<div className="flex items-center gap-3">
						<Logo />
						<span className="bg-foreground text-background rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide uppercase">
							Admin
						</span>
					</div>
					<nav aria-label="Admin" className="flex items-center gap-1 text-sm font-medium">
						<Link href="/admin/sellers" className="hover:bg-muted rounded-full px-4 py-2">
							Sellers
						</Link>
						<Link href="/" className="hover:bg-muted rounded-full px-4 py-2">
							Back to Bibble
						</Link>
						<Suspense fallback={<UserMenuFallback />}>
							<UserMenuSlot />
						</Suspense>
					</nav>
				</div>
			</header>
			{children}
		</>
	)
}
