"use client";

import Image from "next/image";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";
import { useUploadFiles } from "better-upload/client";
import { CustomUploadDropzone } from "./custom-upload-dropzone";

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
        <Image key={image.id} src={image.url} alt="" width={160} height={160} />
      ))}
    </div>
  );
}
