"use client"

import { cn } from "@/lib/utils"
import { HeartIcon, SearchIcon, UserCircleIcon, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navLinks } from "./nav-links"

type Tab = { href: string; label: string; icon: LucideIcon }

const browseTabs: Tab[] = [
	{ href: navLinks.explore, label: "Explore", icon: SearchIcon },
	{ href: navLinks.favourites, label: "Favourites", icon: HeartIcon },
]
const logInTab: Tab = { href: navLinks.logIn, label: "Log in", icon: UserCircleIcon }

/** Airbnb-style bottom navigation, shown below the `md` breakpoint only. Signed-in users reach their account through the header menu. */
export function MobileTabBar({ signedIn }: { signedIn: boolean }) {
	const pathname = usePathname()
	const tabs = signedIn ? browseTabs : [...browseTabs, logInTab]

	return (
		<nav
			aria-label="Primary"
			className="bg-background fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] md:hidden"
		>
			<ul className="mx-auto flex max-w-md justify-around">
				{tabs.map(({ href, label, icon: Icon }) => {
					const active = pathname === href
					return (
						<li key={href}>
							<Link
								href={href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium",
									active ? "text-primary" : "text-muted-foreground"
								)}
							>
								<Icon className="size-6" aria-hidden />
								{label}
							</Link>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}
