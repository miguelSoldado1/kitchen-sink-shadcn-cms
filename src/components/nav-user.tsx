"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/auth/auth-client";
import { ChevronsUpDown, GalleryVerticalEndIcon, LogOut } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function NavUser() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data } = useSession();

  async function handleSignOut() {
    const { error } = await signOut();

    if (error) {
      return toast.error(error.message || "An error occurred while signing out.");
    }

    router.push("/sign-in");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              disabled={!data?.user}
            >
              <Avatar className="h-8 w-8 rounded-full border">
                {data?.user ? <GalleryVerticalEndIcon className="m-auto p-1" /> : null}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {data?.user ? (
                  <span className="truncate font-medium">{data.user.name}</span>
                ) : (
                  <Skeleton className="mb-1 h-3 w-1/2" />
                )}
                {data?.user ? (
                  <span className="truncate text-xs">{data.user.email}</span>
                ) : (
                  <Skeleton className="h-3 w-2/3" />
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full border">
                  <GalleryVerticalEndIcon className="m-auto p-1" />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{data?.user.name}</span>
                  <span className="truncate text-xs">{data?.user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
