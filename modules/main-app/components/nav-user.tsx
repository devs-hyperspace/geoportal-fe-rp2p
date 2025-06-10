"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User2Icon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { signOut } from "next-auth/react"

export function NavUser({
  user,
}: any) {
  const { isMobile } = useSidebar()

  return user && (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Ensure the icon is always visible */}
              <div className="p-2 bg-gray-100 rounded h-8 w-8 flex items-center justify-center">
                <User2Icon size={20} />
              </div>
              
              {/* Only show the user name when sidebar is NOT collapsed */}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.user.name}</span>
                </div>
              
              {/* Show dropdown chevron only when sidebar is NOT collapsed */}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="p-2 bg-gray-100 rounded h-8 w-8 flex items-center justify-center">
                  <User2Icon size={20} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-semibold">{user.user.name}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: `${process.env.NEXTAUTH_URL}/sign-in` })}
                className="flex items-center gap-2 hover:bg-red-100 cursor-pointer"
            >
                <LogOut/>
                <p className="font-bold text-center">Log Out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
