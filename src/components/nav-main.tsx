"use client";

import { usePathname } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth/auth-client";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
  roleAccess?: "admin" | "write" | "read";
}

interface NavMainProps {
  items: NavigationItem[];
}

function canAccessItem(item: NavigationItem, userRole?: string | null): boolean {
  if (!item.roleAccess) return true;
  if (!userRole) return false;

  const rolePriority: Record<string, number> = { admin: 3, write: 2, read: 1 };
  return (rolePriority[userRole] ?? 0) >= (rolePriority[item.roleAccess] ?? 0);
}

export function NavMain({ items }: NavMainProps) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();

  if (isPending) {
    return (
      <SidebarMenu className="p-2">
        {items.map((_item, idx) => (
          <Skeleton key={idx} className="h-8 w-full rounded-lg" />
        ))}
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu className="p-2">
      {items.map(
        (item) =>
          canAccessItem(item, session?.user?.role) && (
            <SidebarMenuItem key={item.title} className={clsx("rounded-lg", pathname === item.url && "bg-muted")}>
              {item.items && item.items.length > 0 ? (
                <Collapsible
                  asChild
                  defaultOpen={item.items.some((subItem) => subItem.url === pathname)}
                  className="group/collapsible"
                >
                  <div>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="cursor-pointer" tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className={clsx(pathname === item.url && "bg-muted rounded-lg")}
                          >
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ) : (
                <SidebarMenuButton tooltip={item.title} asChild>
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ),
      )}
    </SidebarMenu>
  );
}
