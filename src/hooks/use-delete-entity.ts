"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";

interface UseDeleteEntityProps {
  id: number;
  redirectHref?: string;
  mutation: { mutateAsync: (input: { id: number }) => Promise<unknown>; isPending: boolean };
  invalidate: () => void;
  entityName?: string;
}

export function useDeleteEntity({ id, redirectHref, mutation, invalidate, entityName = "item" }: UseDeleteEntityProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const result = await tryCatch(mutation.mutateAsync({ id }));

    if (result.error) {
      return toast.error(`Failed to delete ${entityName}`, {
        description: result.error?.message ?? "An unknown error occurred.",
      });
    }

    invalidate();
    setShowDeleteDialog(false);
    toast.success(`Successfully deleted ${entityName}`);

    if (redirectHref) {
      router.push(redirectHref);
    }
  }

  return {
    handleDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting: mutation.isPending,
    openDeleteDialog: () => setShowDeleteDialog(true),
  };
}
