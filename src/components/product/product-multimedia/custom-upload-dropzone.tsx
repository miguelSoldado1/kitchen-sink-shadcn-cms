"use client";

import React, { useId } from "react";
import { Loader2Icon, UploadIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import type { UploadHookControl } from "better-upload/client";

interface CustomUploadDropzoneProps {
  control: UploadHookControl<true>;
  metadata?: Record<string, unknown>;
  accept?: string;
}

export function CustomUploadDropzone({ control: { upload, isPending }, metadata, accept }: CustomUploadDropzoneProps) {
  const id = useId();

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    noClick: true,
    onDrop: (files) => {
      if (files.length > 0 && !isPending) upload(files, { metadata });
      inputRef.current.value = "";
    },
  });

  return (
    <div className="bg-input/10 size-40 rounded-xl border border-dashed">
      <label
        className="flex size-full cursor-pointer flex-col items-center justify-center p-2"
        {...getRootProps()}
        htmlFor={id}
      >
        <div className="my-2">
          {isPending ? <Loader2Icon className="size-6 animate-spin" /> : <UploadIcon className="size-6" />}
        </div>

        <div className="mt-3 space-y-1 text-center">
          <p className="text-sm font-semibold">Drag and drop files here</p>
        </div>
        <input {...getInputProps()} type="file" multiple id={id} accept={accept} disabled={isPending} />
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
