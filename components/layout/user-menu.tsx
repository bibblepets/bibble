"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logOut } from "@/lib/auth/actions"
import type { CurrentUser } from "@/lib/auth/session"
import { initialsFor } from "@/lib/placeholder"
import { MenuIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { navLinks } from "./nav-links"

const triggerClassName =
	"hover:shadow-md focus-visible:ring-ring/50 flex items-center gap-2 rounded-full border py-1 pr-1 pl-3 transition-shadow outline-none focus-visible:ring-3 aria-expanded:shadow-md"

/** Airbnb-style menu button with an avatar. */
export function UserMenu({ user, hasSeller = false }: { user: CurrentUser | null; hasSeller?: boolean }) {
	const name = user?.displayName ?? user?.email

	return (
		<DropdownMenu>
			<DropdownMenuTrigger aria-label="Open menu" className={triggerClassName}>
				<MenuIcon className="size-4" aria-hidden />
				<Avatar size="sm">
					<AvatarFallback className={user ? "bg-primary text-primary-foreground text-xs font-semibold" : undefined}>
						{name ? initialsFor(name) : <UserIcon className="size-4" aria-hidden />}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-60">
				{user ? (
					<>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="text-foreground grid gap-0.5 py-2">
								<span className="truncate text-sm font-semibold">{name}</span>
								{user.displayName && <span className="text-muted-foreground truncate font-normal">{user.email}</span>}
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem render={<Link href={navLinks.favourites} />}>Favourites</DropdownMenuItem>
						{hasSeller ? (
							<DropdownMenuItem render={<Link href={navLinks.sellerDashboard} />}>Switch to selling</DropdownMenuItem>
						) : (
							<DropdownMenuItem render={<Link href={navLinks.becomeSeller} />}>Become a seller</DropdownMenuItem>
						)}
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => void logOut()}>Log out</DropdownMenuItem>
					</>
				) : (
					<>
						<DropdownMenuItem render={<Link href={navLinks.signUp} />} className="font-semibold">
							Sign up
						</DropdownMenuItem>
						<DropdownMenuItem render={<Link href={navLinks.logIn} />}>Log in</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem render={<Link href={navLinks.becomeSeller} />}>Become a seller</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

/** Placeholder with the trigger's footprint while the session loads. */
export function UserMenuFallback() {
	return <div aria-hidden className={`${triggerClassName} h-[42px] w-[78px] opacity-60`} />
}
