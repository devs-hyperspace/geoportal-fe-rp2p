"use client"

import * as React from "react"
import {
  BookOpen,
  Globe2Icon,
  Settings,
} from "lucide-react"


import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Logo from "@/components/Logo";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Admin",
      logo: Logo,
      plan: "RP2P Admin",
    },
    {
      name: "Kota Tangerang Selatan",
      logo: Logo,
      plan: "RP2P Kota Tangerang Selatan",
    },
  ],
  navMain: [
    {
      title: "Map",
      url: "/",
      icon: Globe2Icon,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        { title: "Users", url: "/settings/user" },
        { title: "Indikator SPP", url: "/settings/spp" },
      ],
    },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     { title: "User Guide", url: "#" },
    //   ],
    // },
  ]
}

export const AppSidebar: React.FC<{ session: any }> = (props) => {

  return props.session && (
    <Sidebar collapsible="icon" {...props} className="shadow-lg">
      <SidebarHeader>
        <TeamSwitcher session={props.session} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

