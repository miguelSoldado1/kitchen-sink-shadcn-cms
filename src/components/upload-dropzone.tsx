import React from "react";
import { Loader2Icon, UploadIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface UploadDropzoneProps {
  isPending?: boolean;
  accept?: string;
  onFilesSelected: (files: File[]) => void;
}

export function UploadDropzone({ isPending, accept, onFilesSelected }: UploadDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    noClick: true,
    onDrop: (files: File[]) => {
      if (files.length > 0 && !isPending) {
        onFilesSelected(files);
      }
      if (inputRef.current) inputRef.current.value = "";
    },
  });

  return (
    <div className="bg-input/10 size-40 rounded-xl border border-dashed">
      <label className="flex size-full cursor-pointer flex-col items-center justify-center p-2" {...getRootProps()}>
        <div className="my-2">
          {isPending ? <Loader2Icon className="size-6 animate-spin" /> : <UploadIcon className="size-6" />}
        </div>
        <div className="mt-1 space-y-1 text-center">
          <p className="text-xs font-semibold">Drag and drop files here</p>
          <p className="text-muted-foreground max-w-64 text-xs">You can upload 4 images. Each up to 5MB.</p>
        </div>
        <input {...getInputProps()} type="file" multiple accept={accept} disabled={isPending} />
      </label>
      {isDragActive && (
        <div className="bg-background pointer-events-none absolute inset-0 rounded-lg">
          <div className="dark:bg-accent/30 bg-accent flex size-full flex-col items-center justify-center rounded-lg">
            <div className="my-2">
              <UploadIcon className="size-6" />
            </div>
            <p className="mt-3 text-sm font-semibold">Drop files here</p>
          </div>
        </div>
      )}
    </div>
  );
}
