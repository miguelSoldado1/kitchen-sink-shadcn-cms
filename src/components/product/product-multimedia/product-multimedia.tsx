"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc/client";
import { useUploadFiles } from "better-upload/client";
import { DragAndDropMedia } from "./drag-and-drop-media";
import { UploadDropzone } from "./upload-dropzone";

interface ProductMultimediaProps {
  productId: number;
}

export function ProductMultimedia({ productId }: ProductMultimediaProps) {
  const query = trpc.productMultimedia.getProductMultimedia.useQuery({ productId });
  const [items, setItems] = useState(query.data ?? []);

  useEffect(() => {
    setItems(query.data ?? []);
  }, [query.data]);

  const mutation = trpc.productMultimedia.reorderProductMultimedia.useMutation();

  const { control } = useUploadFiles({
    route: "productMultimedia",
    onError: (error) => {
      toast.error("Something went wrong", { description: error.message });
    },
    onUploadFail: () => {
      toast.error("Something went wrong", { description: "Some or all files failed to upload" });
    },
    onUploadComplete: () => {
      toast.success("Files uploaded successfully");
      query.refetch();
    },
  });

  async function handleReorder() {
    const newOrderIds = items.map((item) => item.id);
    const { error } = await tryCatch(mutation.mutateAsync({ productId, newOrderIds }));
    if (error) {
      console.log(error);
      return toast.error("Failed to reorder items", { description: error.message });
    }

    toast.success("Order updated successfully");
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-7">
        <UploadDropzone control={control} metadata={{ productId }} />
        {!query.isPending ? (
          <DragAndDropMedia items={items} setItems={setItems} invalidate={() => query.refetch()} />
        ) : (
          new Array(5).fill(null).map((_, index) => <Skeleton key={index} className="size-40" />)
        )}
      </div>
      <div className="flex justify-end">
        <Button onClick={handleReorder} disabled={mutation.isPending || query.isPending || items.length === 0}>
          Update Order
        </Button>
      </div>
    </div>
  );
}
