import { useState } from "react";
import * as ActionsMenuCore from "@/components/actions-menu";
import { useDeleteEntity } from "@/hooks/use-delete-entity";
import { trpc } from "@/lib/trpc/client";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";

interface ProductActionsDropdownMenuProps {
  id: number;
}

export function ProductActionsDropdownMenu({ id }: ProductActionsDropdownMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const utils = trpc.useUtils();
  const mutation = trpc.product.delete.useMutation();
  const deleteProduct = useDeleteEntity({
    mutateAsync: () => mutation.mutateAsync({ id }),
    invalidate: utils.product.getTable.invalidate,
    entityName: "product",
  });

  return (
    <>
      <ActionsMenuCore.ActionsMenu>
        <ActionsMenuCore.ActionsMenuTriggerEllipsis />
        <ActionsMenuCore.ActionsContent>
          <ActionsMenuCore.ActionsMenuEditItemLink href={`/product/edit/${id}`} />
          <ActionsMenuCore.ActionsMenuDeleteButton
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
            disabled={mutation.isPending}
          />
        </ActionsMenuCore.ActionsContent>
      </ActionsMenuCore.ActionsMenu>
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={deleteProduct}
        disabled={mutation.isPending}
      />
    </>
  );
}
