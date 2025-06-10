"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          // Check if the main item or any of its sub-items are active
          const isActive =
            pathname === item.url || item.items?.some((sub) => pathname === sub.url);
          const isOpen = openMenus[item.title] ?? isActive;

          return item.items && item.items.length > 0 ? (
            // Collapsible menu for items with sub-items
            <Collapsible key={item.title} asChild open={isOpen}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild onClick={() => toggleMenu(item.title)}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    className={isActive ? "bg-primary text-white" : ""}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={`ml-auto transition-transform duration-200 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const isSubActive = pathname === subItem.url;
                      return (
                        <SidebarMenuSubItem key={subItem.title} className="first:my-2">
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className={`w-full ${
                              isSubActive ? "bg-secondary text-primary" : ""
                            }`}
                          >
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            // Simple menu button for single items (no submenu)
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.title}
                className={isActive ? "bg-primary text-white" : ""}
              >
                <a href={item.url} className="flex w-full items-center gap-2">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
