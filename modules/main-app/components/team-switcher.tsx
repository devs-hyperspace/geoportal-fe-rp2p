"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, User } from "lucide-react"
import Image from "next/image"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Logo from "@/components/Logo"
import Cookies from "js-cookie";
import { useSession } from "next-auth/react"
import { useUsersControl } from "../hooks/useUsersControl"
import { useUserMember } from "../hooks/useUsersControl"


export function TeamSwitcher({
  session,
}: {
  session: any
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState("")

  const usersControl = useUsersControl()
  const { isLoading, data: UseMember } = useUserMember(session.user.geonodeUid)


  const handleActiveMember = (user: any) => {
    usersControl.setUser({
      activeUsername: user.name?.toString() || '',
      activeGeonodeUid: user.geonodeUid?.toString() || '',
      activeGeonodeAccessToken: user.geonodeAccessToken || '',
      activeRoleId: user.roleId ?? null,
      activeKabkotId: user.kabkotId || '',
    });
  }


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* <Image
                  src={activeTeam.logo}
                  alt={`${activeTeam.name} logo`}
                  width={32}
                  height={32}
                  className="rounded-md object-contain"
                /> */}
                <Logo />
                {/* {typeof activeTeam.logo === "string" ? (
                ) : (
                  <activeTeam.logo className="size-4" />
                )} */}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-primary">
                  RP2P Geoportal
                </span>
                <span className="truncate text-xs">{usersControl?.user.activeUsername.replace('RP2P', '')}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Users
            </DropdownMenuLabel>
            {UseMember?.length > 0 && UseMember.map((member: any, index: number) => (
              <DropdownMenuItem
                key={member.name}
                onClick={() => handleActiveMember(member)}
                className="gap-2 p-2"
              >
                {member.name.replace('RP2P', '')}
                <DropdownMenuShortcut>⌘</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
