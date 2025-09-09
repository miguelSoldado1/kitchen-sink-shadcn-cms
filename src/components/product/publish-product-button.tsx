"use client";

import React from "react";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../ui/button";

interface PublishProductButtonProps {
  id: number;
}

export function PublishProductButton({ id }: PublishProductButtonProps) {
  const trpc = useTRPC();

  const query = useQuery(trpc.product.getFirst.queryOptions({ id }));
  const publishMutation = useMutation(trpc.product.publish.mutationOptions());
  const unpublishMutation = useMutation(trpc.product.unpublish.mutationOptions());

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
