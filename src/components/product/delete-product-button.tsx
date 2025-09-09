"use client";

import React, { useState } from "react";
import { useDeleteEntity } from "@/hooks/use-delete-entity";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";
import { Button } from "../ui/button";

interface DeleteProductButtonProps {
  id: number;
}

export function DeleteProductButton({ id }: DeleteProductButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const query = useQuery(trpc.product.getFirst.queryOptions({ id }));

  const mutation = useMutation(trpc.product.delete.mutationOptions());
  const deleteProduct = useDeleteEntity({
    mutateAsync: () => mutation.mutateAsync({ id }),
    invalidate: () => queryClient.invalidateQueries(trpc.product.getTable.queryFilter()),
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
