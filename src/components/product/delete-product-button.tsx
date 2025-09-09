"use client";

import React, { useState } from "react";
import { useDeleteEntity } from "@/hooks/use-delete-entity";
import { trpc } from "@/lib/trpc/client";
import { TrashIcon } from "lucide-react";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";
import { Button } from "../ui/button";

interface DeleteProductButtonProps {
  id: number;
}

export function DeleteProductButton({ id }: DeleteProductButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const query = trpc.product.getProduct.useQuery({ id: id });

  const utils = trpc.useUtils();
  const mutation = trpc.product.deleteProduct.useMutation();
  const deleteProduct = useDeleteEntity({
    mutateAsync: () => mutation.mutateAsync({ id }),
    invalidate: utils.product.getTableProducts.invalidate,
    redirectHref: "/product",
    entityName: "product",
  });

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setShowDeleteDialog(true)}
        disabled={mutation.isPending || query.isPending}
      >
        <TrashIcon className="size-4" />
        Delete Product
      </Button>
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={deleteProduct}
        disabled={mutation.isPending}
      />
    </>
  );
}
