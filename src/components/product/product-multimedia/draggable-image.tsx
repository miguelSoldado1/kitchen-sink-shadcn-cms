"use client";

import { useState } from "react";
import Image from "next/image";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteEntity } from "@/hooks/use-delete-entity";
import { trpc } from "@/lib/trpc/client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2Icon } from "lucide-react";
import type { productMultimedia } from "@/lib/database/schema";
import type { CSSProperties } from "react";

interface DraggableImageProps {
  productImage: typeof productMultimedia.$inferSelect;
  invalidate: () => unknown;
}

export function DraggableImage({ productImage, invalidate }: DraggableImageProps) {
  const [open, setOpen] = useState(false);
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id: productImage.id });

  const mutation = trpc.productMultimedia.deleteProductMultimedia.useMutation();
  const deleteMultimedia = useDeleteEntity({
    mutateAsync: () => mutation.mutateAsync({ id: productImage.id }),
    entityName: "product multimedia",
    invalidate,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
    opacity: isDragging || mutation.isPending ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  return (
    <div
      className="relative h-[160px] w-[160px] cursor-pointer overflow-hidden rounded-2xl shadow-md select-none"
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
    >
      <div className="bg-secondary text-secondary-foreground absolute top-2 left-2 z-10 rounded-md px-2 py-1 text-xs font-semibold select-none">
        {productImage.order}
      </div>
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 z-10 size-6 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Trash2Icon className="size-4" />
      </Button>
      <Image src={productImage.url} fill={true} alt="" className="object-cover" />
      <DeleteConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => deleteMultimedia()}
        disabled={mutation.isPending}
      />
    </div>
  );
}
