"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";
import { useUploadFiles } from "better-upload/client";
import { UploadWithCropper } from "../../upload-with-cropper";
import { DragAndDropMedia } from "./drag-and-drop-media";

interface ProductMultimediaProps {
  productId: number;
}

export function ProductMultimedia({ productId }: ProductMultimediaProps) {
  const query = trpc.productMultimedia.getAllById.useQuery({ productId });
  const [items, setItems] = useState(query.data ?? []);

  useEffect(() => {
    setItems(query.data ?? []);
  }, [query.data]);

  const createMutation = trpc.productMultimedia.create.useMutation();
  const reorderMutation = trpc.productMultimedia.updateOrder.useMutation();

  const { control } = useUploadFiles({
    route: "productMultimedia",
    onError: (error) => {
      toast.error("Something went wrong", { description: error.message });
    },
    onUploadFail: () => {
      toast.error("Something went wrong", { description: "Some or all files failed to upload" });
    },
    onUploadComplete: async (data) => {
      const multimedia = data.files.map((file) => ({ objectKey: file.objectKey }));
      const { error } = await tryCatch(createMutation.mutateAsync({ multimedia, productId }));
      if (error) {
        toast.error("Failed to upload files", { description: error.message });
        return;
      }

      query.refetch();
    },
  });

  async function handleReorder() {
    const newOrderIds = items.map((item) => item.id);
    const { error } = await tryCatch(reorderMutation.mutateAsync({ productId, newOrderIds }));
    if (error) {
      return toast.error("Failed to reorder items", { description: error.message });
    }

    toast.success("Order updated successfully");
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,max-content))] gap-4">
        <UploadWithCropper onUpload={(file) => control.upload([file])} />
        {!query.isPending ? (
          <DragAndDropMedia items={items} setItems={setItems} invalidate={() => query.refetch()} />
        ) : (
          new Array(5).fill(null).map((_, index) => <Skeleton key={index} className="size-40" />)
        )}
      </div>
      <div className="flex justify-end">
        <Button onClick={handleReorder} disabled={reorderMutation.isPending || query.isPending || items.length === 0}>
          Update Order
        </Button>
      </div>
    </div>
  );
}
