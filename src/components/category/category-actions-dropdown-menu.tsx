import { useState } from "react";
import * as ActionsMenuCore from "@/components/actions-menu";
import { useDeleteEntity } from "@/hooks/use-delete-entity";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";

interface CategoryActionsDropdownMenuProps {
  id: number;
}

export function CategoryActionsDropdownMenu({ id }: CategoryActionsDropdownMenuProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const mutation = useMutation(trpc.category.delete.mutationOptions());

  const deleteCategory = useDeleteEntity({
    invalidate: () => queryClient.invalidateQueries(trpc.category.getTable.queryFilter()),
    mutateAsync: () => mutation.mutateAsync({ id }),
    entityName: "category",
  });

  return (
    <>
      <ActionsMenuCore.ActionsMenu>
        <ActionsMenuCore.ActionsMenuTriggerEllipsis />
        <ActionsMenuCore.ActionsContent>
          <ActionsMenuCore.ActionsMenuEditItemButton onClick={() => setShowEditDialog(true)} />
          <ActionsMenuCore.ActionsMenuDeleteButton onClick={() => setShowDeleteDialog(true)} />
        </ActionsMenuCore.ActionsContent>
      </ActionsMenuCore.ActionsMenu>
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={deleteCategory}
        disabled={mutation.isPending}
      />
      <EditCategoryDialog open={showEditDialog} onOpenChange={setShowEditDialog} categoryId={id} />
    </>
  );
}
