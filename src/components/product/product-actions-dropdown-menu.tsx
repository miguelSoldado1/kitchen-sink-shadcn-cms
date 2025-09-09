import { useState } from "react";
import * as ActionsMenuCore from "@/components/actions-menu";
import { useDeleteEntity } from "@/hooks/use-delete-entity";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";

interface ProductActionsDropdownMenuProps {
  id: number;
}

export function ProductActionsDropdownMenu({ id }: ProductActionsDropdownMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const mutation = useMutation(trpc.product.delete.mutationOptions());
  const deleteProduct = useDeleteEntity({
    mutateAsync: () => mutation.mutateAsync({ id }),
    invalidate: () => queryClient.invalidateQueries(trpc.product.getTable.queryFilter()),
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
