import { useState } from "react";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc/client";
import { TrashIcon } from "lucide-react";

interface DeleteProductCategoryProps {
  id: number;
}

export function DeleteProductCategory({ id }: DeleteProductCategoryProps) {
  const [open, setOpen] = useState(false);
  const mutation = trpc.productCategory.delete.useMutation();
  const utils = trpc.useUtils();

  async function handleDelete() {
    const { error } = await tryCatch(mutation.mutateAsync({ id }));
    if (error) {
      return toast.error("Failed to delete product category", { description: error.message });
    }

    toast.success("Product category deleted successfully");
    utils.productCategory.getAll.invalidate();
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive focus:text-destructive size-4 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <TrashIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
      <DeleteConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleDelete}
        disabled={mutation.isPending}
      />
    </>
  );
}
