"use client";

import React from "react";
import { useDeleteEntity } from "@/hooks/use-delete-entity";
import { trpc } from "@/lib/trpc/client";
import { TrashIcon } from "lucide-react";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";
import { Button } from "../ui/button";

interface DeleteProductButtonProps {
  id: number;
}

export function DeleteProductButton({ id }: DeleteProductButtonProps) {
  const utils = trpc.useUtils();
  const mutation = trpc.product.deleteProduct.useMutation();
  const deleteProduct = useDeleteEntity({
    invalidate: utils.product.getTableProducts.invalidate,
    redirectHref: "/product",
    entityName: "product",
    mutation,
    id,
  });

  return (
    <>
      <Button
        variant="destructive"
        className="cursor-pointer"
        onClick={deleteProduct.openDeleteDialog}
        disabled={deleteProduct.isDeleting}
      >
        <TrashIcon className="size-4" />
        Delete Product
      </Button>
      <DeleteConfirmationDialog
        open={deleteProduct.showDeleteDialog}
        onOpenChange={deleteProduct.setShowDeleteDialog}
        onConfirm={deleteProduct.handleDelete}
        disabled={deleteProduct.isDeleting}
      />
    </>
  );
}
