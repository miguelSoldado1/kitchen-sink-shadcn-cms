"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PackageIcon, ShoppingBasketIcon, ShoppingCartIcon, TagIcon, UserIcon } from "lucide-react";
import Provider from "../_trpc/provider";

const navigationData = [
  {
    title: "Customers",
    url: "#",
    icon: UserIcon,
    isActive: false,
    items: [
      {
        title: "Customer List",
        url: "/customers",
      },
      {
        title: "Customer Groups",
        url: "/customer-groups",
      },
      {
        title: "Reviews",
        url: "/reviews",
      },
    ],
  },
  {
    title: "Catalog",
    url: "#",
    icon: ShoppingBasketIcon,
    isActive: false,
    items: [
      {
        title: "Products",
        url: "/product",
      },
      {
        title: "Categories",
        url: "/categories",
      },
      {
        title: "Brands",
        url: "/brands",
      },
      {
        title: "Attributes",
        url: "/attributes",
      },
      {
        title: "Variants",
        url: "/productVariant",
      },
    ],
  },
  {
    title: "Orders",
    url: "#",
    icon: ShoppingCartIcon,
    isActive: false,
    items: [
      {
        title: "All Orders",
        url: "/orders",
      },
      {
        title: "Returns",
        url: "/returns",
      },
    ],
  },
  {
    title: "Marketing",
    url: "#",
    icon: TagIcon,
    isActive: false,
    items: [
      {
        title: "Discounts",
        url: "/discounts",
      },
      {
        title: "Promotions",
        url: "/promotions",
      },
      {
        title: "Campaigns",
        url: "/campaigns",
      },
      {
        title: "SEO",
        url: "/seo",
      },
    ],
  },
  {
    title: "Inventory",
    url: "#",
    icon: PackageIcon,
    isActive: false,
    items: [
      {
        title: "Stock Levels",
        url: "/inventory",
      },
      {
        title: "Warehouses",
        url: "/warehouses",
      },
      {
        title: "Movements",
        url: "/inventory-movements",
      },
    ],
  },
];

function getCurrentPageInfo(pathname: string) {
  if (pathname === "/") {
    return { title: "Backoffice", parent: null };
  }

  for (const item of navigationData) {
    if (item.url === pathname) {
      return { title: item.title, parent: null };
    }

    if (item.items) {
      for (const subItem of item.items) {
        if (subItem.url === pathname) {
          return { title: subItem.title, parent: item.title };
        }
      }
    }
  }

  // Default fallback
  return { title: "Page", parent: null };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageInfo = getCurrentPageInfo(pathname);

  return (
    <SidebarProvider>
      <AppSidebar navigationData={navigationData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Backoffice</BreadcrumbLink>
                </BreadcrumbItem>
                {pageInfo.parent && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">{pageInfo.parent}</BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                {pageInfo.title !== "Backoffice" && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{pageInfo.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Provider>{children}</Provider>
      </SidebarInset>
    </SidebarProvider>
  );
}
