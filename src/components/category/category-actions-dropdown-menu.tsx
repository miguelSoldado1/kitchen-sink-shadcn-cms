import { useState } from "react";
import * as ActionsMenuCore from "@/components/actions-menu";
import { useDeleteEntity } from "@/hooks/use-delete-entity";
import { trpc } from "@/lib/trpc/client";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";

interface CategoryActionsDropdownMenuProps {
  id: number;
}

export function CategoryActionsDropdownMenu({ id }: CategoryActionsDropdownMenuProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const mutation = trpc.category.delete.useMutation();
  const utils = trpc.useUtils();
  const deleteCategory = useDeleteEntity({
    invalidate: utils.category.getTable.invalidate,
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
