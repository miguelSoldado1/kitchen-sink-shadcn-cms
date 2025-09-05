"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";
import { ChevronsUpDown, LogOutIcon, Monitor, Moon, Sun, UserPenIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Skeleton } from "./ui/skeleton";

export function NavUser() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data } = authClient.useSession();
  const { setTheme } = useTheme();

  async function handleSignOut() {
    const { error } = await authClient.signOut();

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
              <Avatar className="size-8 rounded-full border">
                {data?.user ? <AvatarFallback>{data.user.name.charAt(0).toUpperCase()}</AvatarFallback> : null}
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
                  {data?.user ? <AvatarFallback>{data.user.name.charAt(0).toUpperCase()}</AvatarFallback> : null}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex items-center justify-between">
                    <span className="truncate font-medium">{data?.user.name}</span>
                  </div>
                  <span className="truncate text-xs">{data?.user.email}</span>
                </div>
                {data?.user.role && (
                  <Badge variant="secondary" className="ml-auto">
                    {data.user.role}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                <Sun className="text-muted-foreground size-4 dark:hidden" />
                <Moon className="text-muted-foreground hidden size-4 dark:block" />
                Change theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor />
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserPenIcon />
                Edit Profile
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
