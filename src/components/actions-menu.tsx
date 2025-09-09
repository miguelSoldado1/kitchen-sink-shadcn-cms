import Link from "next/link";
import * as DropdownMenuCore from "@/components/ui/dropdown-menu";
import clsx from "clsx";
import { EditIcon, EllipsisIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function ActionsMenuTriggerEllipsis() {
  return (
    <DropdownMenuCore.DropdownMenuTrigger asChild>
      <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0">
        <EllipsisIcon className="size-4" aria-hidden="true" />
      </Button>
    </DropdownMenuCore.DropdownMenuTrigger>
  );
}

export function ActionsMenuEditItemLink({ className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <DropdownMenuCore.DropdownMenuItem asChild>
      <Link className={clsx("cursor-pointer", className)} {...props}>
        <EditIcon className="size-4" />
        Edit
      </Link>
    </DropdownMenuCore.DropdownMenuItem>
  );
}

export function ActionsMenuEditItemButton(props: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuCore.DropdownMenuItem {...props}>
      <EditIcon className="size-4" />
      Edit
    </DropdownMenuCore.DropdownMenuItem>
  );
}

export function ActionsMenuDeleteButton({ className, ...props }: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuCore.DropdownMenuItem
      className={clsx("text-destructive focus:text-destructive", className)}
      {...props}
    >
      <TrashIcon className="text-destructive size-4" />
      Delete
    </DropdownMenuCore.DropdownMenuItem>
  );
}

export const ActionsMenu = DropdownMenuCore.DropdownMenu;
export const ActionsContent = DropdownMenuCore.DropdownMenuContent;
