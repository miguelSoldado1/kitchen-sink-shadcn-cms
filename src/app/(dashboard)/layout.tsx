"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PackageOpenIcon, TagIcon } from "lucide-react";
import Provider from "../../lib/trpc/provider";

const navigationData = [
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
