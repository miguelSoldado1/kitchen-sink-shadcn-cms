"use client";

import React from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { tryCatch } from "@/try-catch";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../ui/button";

interface PublishProductButtonProps {
  id: number;
}

export function PublishProductButton({ id }: PublishProductButtonProps) {
  const query = trpc.product.getFirst.useQuery({ id });
  const publishMutation = trpc.product.publish.useMutation();
  const unpublishMutation = trpc.product.unpublish.useMutation();

  const isPublished = query.data?.published;
  const isLoading = query.isPending || publishMutation.isPending || unpublishMutation.isPending;

  async function handleTogglePublish() {
    const mutation = isPublished ? unpublishMutation : publishMutation;
    const action = isPublished ? "unpublish" : "publish";

    const { error } = await tryCatch(mutation.mutateAsync({ id }));
    if (error) {
      return toast.error(`Failed to ${action} product`, {
        description: error.message,
      });
    }

    toast.success(`Product ${action}ed successfully`);
    query.refetch();
  }

  return (
    <Button disabled={isLoading} onClick={handleTogglePublish}>
      {isPublished ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      {isPublished ? "Unpublish Product" : "Publish Product"}
    </Button>
  );
}
