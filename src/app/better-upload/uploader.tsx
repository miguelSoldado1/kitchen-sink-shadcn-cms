"use client";

import { toast } from "sonner";
import { UploadDropzone } from "@/components/ui/upload-dropzone";
import { useUploadFiles } from "better-upload/client";

export function Uploader() {
  const { control } = useUploadFiles({
    route: "demo",
    onError: (error) => {
      toast.error(error.message);
    },
    onUploadFail: () => {
      toast.error("Some or all files failed to upload");
    },
    onUploadComplete: ({ files }) => {
      toast.success(`${files.length} files uploaded`);
    },
  });

  return (
    <UploadDropzone
      control={control}
      accept="image/*"
      description={{
        maxFiles: 4,
        maxFileSize: "5MB",
      }}
    />
  );
}
