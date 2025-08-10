"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { tryCatch } from "@/app/try-catch";

interface UseDeleteProductOptions {
  id: number;
  redirectHref?: string;
}

export function useDeleteProduct(options: UseDeleteProductOptions) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const utils = trpc.useUtils();
  const router = useRouter();

  const mutation = trpc.deleteProduct.useMutation();

  async function handleDelete() {
    const result = await tryCatch(mutation.mutateAsync({ id: options.id }));

    if (result.error) {
      return toast.error("Failed to delete product", {
        description: result.error?.message ?? "An unknown error occurred.",
      });
    }

    toast.success("Successfully deleted product");
    utils.getTableProducts.invalidate();
    setShowDeleteDialog(false);

    if (options.redirectHref) {
      router.push(options.redirectHref);
    }
  }

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete,
    isDeleting: mutation.isPending,
    openDeleteDialog: () => setShowDeleteDialog(true),
  };
}
