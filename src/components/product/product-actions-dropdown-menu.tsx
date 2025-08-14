import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as DropdownMenuCore from "@/components/ui/dropdown-menu";
import { useDeleteEntity } from "@/hooks/use-delete-entity";
import { trpc } from "@/lib/trpc/client";
import { EditIcon, EllipsisIcon, TrashIcon } from "lucide-react";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";

interface ProductActionsDropdownMenuProps {
  id: number;
}

export function ProductActionsDropdownMenu({ id }: ProductActionsDropdownMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const utils = trpc.useUtils();
  const mutation = trpc.product.deleteProduct.useMutation();
  const deleteProduct = useDeleteEntity({
    mutateAsync: () => mutation.mutateAsync({ id }),
    invalidate: utils.product.getTableProducts.invalidate,
    entityName: "product",
  });

  return (
    <>
      <DropdownMenuCore.DropdownMenu>
        <DropdownMenuCore.DropdownMenuTrigger asChild>
          <Button aria-label="Open menu" variant="ghost" className="data-[state=open]:bg-muted flex size-8 p-0">
            <EllipsisIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuCore.DropdownMenuTrigger>
        <DropdownMenuCore.DropdownMenuContent>
          <DropdownMenuCore.DropdownMenuItem asChild>
            <Link href={`/product/edit/${id}`} className="cursor-pointer">
              <EditIcon className="size-4" />
              Edit
            </Link>
          </DropdownMenuCore.DropdownMenuItem>
          <DropdownMenuCore.DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
            disabled={mutation.isPending}
          >
            <TrashIcon className="size-4" />
            Delete
          </DropdownMenuCore.DropdownMenuItem>
        </DropdownMenuCore.DropdownMenuContent>
      </DropdownMenuCore.DropdownMenu>
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={deleteProduct}
        disabled={mutation.isPending}
      />
    </>
  );
}
