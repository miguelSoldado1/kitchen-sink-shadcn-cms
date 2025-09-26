"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PackageIcon, PackageOpenIcon, TagIcon, UsersRoundIcon } from "lucide-react";
import Provider from "../../lib/trpc/provider";
import type { NavigationItem } from "@/components/nav-main";

const navigationData: NavigationItem[] = [
  {
    title: "Products",
    url: "/product",
    icon: PackageOpenIcon,
  },
  {
    title: "Categories",
    url: "/category",
    icon: TagIcon,
  },
  {
    title: "Bundles",
    url: "/bundle",
    icon: PackageIcon,
  },
  {
    title: "Users",
    url: "/user",
    roleAccess: "admin",
    icon: UsersRoundIcon,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar navigationData={navigationData} />
      <SidebarInset className="px-4">
        <Provider>{children}</Provider>
      </SidebarInset>
    </SidebarProvider>
  );
}
