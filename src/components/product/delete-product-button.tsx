"use client";

import React from "react";
import { useDeleteProduct } from "@/hooks/use-delete-product";
import { TrashIcon } from "lucide-react";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";
import { Button } from "../ui/button";

interface DeleteProductButtonProps {
  id: number;
}

export function DeleteProductButton({ id }: DeleteProductButtonProps) {
  const deleteProduct = useDeleteProduct({ id, redirectHref: "/product" });

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
