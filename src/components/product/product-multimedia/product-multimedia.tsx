"use client";

import { trpc } from "@/lib/trpc/client";
import { useUploadFiles } from "better-upload/client";
import { toast } from "sonner";
import { CustomUploadDropzone } from "./custom-upload-dropzone";
import { DraggableImage } from "./draggable-image";

interface ProductMultimediaProps {
  productId: number;
}

export function ProductMultimedia({ productId }: ProductMultimediaProps) {
  const query = trpc.productMultimedia.getProductMultimedia.useQuery({ productId });
  const { control } = useUploadFiles({
    route: "demo",
    onError: (error) => {
      toast.error(error.message);
    },
    onUploadFail: () => {
      toast.error("Some or all files failed to upload");
    },
    onUploadComplete: () => {
      toast.success("Files uploaded successfully");
      query.refetch();
    },
  });

  return (
    <div className="grid grid-cols-7">
      <CustomUploadDropzone control={control} metadata={{ productId }} />
      {query.data?.map((image) => (
        <DraggableImage key={image.id} productImage={image} invalidate={() => query.refetch()} />
      ))}
    </div>
  );
}
