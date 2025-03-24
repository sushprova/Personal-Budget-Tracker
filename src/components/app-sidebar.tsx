"use client";
import { Folder, Home, Plus, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// import { usePathname } from "next/navigation";

// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Add Transaction",
    url: "/add",
    icon: Plus,
  },
  {
    title: "Category",
    url: "/category",
    icon: Folder,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-[#0d7263] text-white">
        {/* <SidebarGroup> */}
        {/* <SidebarGroupLabel>Menu</SidebarGroupLabel> */}
        {/* <SidebarGroupContent> */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url} className="sidebar-text">
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {/* </SidebarGroupContent> */}
        {/* </SidebarGroup> */}
      </SidebarContent>
    </Sidebar>
  );
}
