"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ShoppingBasketIcon } from "lucide-react";
import Provider from "../_trpc/provider";

const navigationData = [
  {
    title: "Catalog",
    url: "#",
    icon: ShoppingBasketIcon,
    items: [
      {
        title: "Products",
        url: "/product",
      },
    ],
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
