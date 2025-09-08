"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import * as ActionsMenuCore from "@/components/actions-menu";
import { authClient } from "@/lib/auth/auth-client";
import { trpc } from "@/lib/trpc/client";
import { UserCog } from "lucide-react";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";

interface UserActionsDropdownMenuProps {
  id: string;
}

export function UserActionsDropdownMenu({ id }: UserActionsDropdownMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const utils = trpc.useUtils();

  function deleteUser(userId: string) {
    startTransition(async () => {
      const { error } = await authClient.admin.removeUser({ userId });
      if (error) {
        toast.error("Failed to delete user", { description: error.message });
        return;
      }

      toast.success("User deleted successfully");
      utils.user.getTableUsers.invalidate();
      setShowDeleteDialog(false);
    });
  }

  function changeUserRole(userId: string, role: "admin" | "read" | "write") {
    startTransition(async () => {
      const { error } = await authClient.admin.setRole({ userId, role });
      if (error) {
        toast.error("Failed to change user role", { description: error.message });
        return;
      }

      toast.success("User role updated successfully");
      utils.user.getTableUsers.invalidate();
    });
  }

  return (
    <>
      <ActionsMenuCore.ActionsMenu>
        <ActionsMenuCore.ActionsMenuTriggerEllipsis />
        <ActionsMenuCore.ActionsContent>
          <ActionsMenuCore.ActionsMenuDeleteButton
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isPending}
          />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <div className="mr-2 flex">
                <UserCog className="mr-2 size-4" />
                Change Role
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem className="cursor-pointer" onClick={() => changeUserRole(id, "admin")}>
                  Set Admin
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => changeUserRole(id, "read")}>
                  Set Read
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => changeUserRole(id, "write")}>
                  Set Write
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </ActionsMenuCore.ActionsContent>
      </ActionsMenuCore.ActionsMenu>
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => deleteUser(id)}
        disabled={isPending}
      />
    </>
  );
}
