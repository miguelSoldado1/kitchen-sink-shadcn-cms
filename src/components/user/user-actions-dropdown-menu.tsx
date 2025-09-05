"use client";

import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import * as ActionsMenuCore from "@/components/actions-menu";
import { authClient } from "@/lib/auth/auth-client";
import { trpc } from "@/lib/trpc/client";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";

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
