import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as DropdownMenuCore from "@/components/ui/dropdown-menu";
import { useDeleteProduct } from "@/hooks/use-delete-product";
import { EditIcon, Ellipsis, TrashIcon } from "lucide-react";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";

interface ProductActionsDropdownMenuProps {
  id: number;
  editHref: string;
  disabled?: boolean;
}

export function ProductActionsDropdownMenu({ id, editHref, disabled }: ProductActionsDropdownMenuProps) {
  const deleteProduct = useDeleteProduct({ id });

  return (
    <>
      <DropdownMenuCore.DropdownMenu>
        <DropdownMenuCore.DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="data-[state=open]:bg-muted flex size-8 p-0"
            disabled={disabled}
          >
            <Ellipsis className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuCore.DropdownMenuTrigger>
        <DropdownMenuCore.DropdownMenuContent>
          <DropdownMenuCore.DropdownMenuItem asChild disabled={disabled}>
            <Link href={editHref} className="cursor-pointer">
              <EditIcon className="size-4" />
              Edit
            </Link>
          </DropdownMenuCore.DropdownMenuItem>
          <DropdownMenuCore.DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={deleteProduct.openDeleteDialog}
            disabled={disabled || deleteProduct.isDeleting}
          >
            <TrashIcon className="size-4" />
            Delete
          </DropdownMenuCore.DropdownMenuItem>
        </DropdownMenuCore.DropdownMenuContent>
      </DropdownMenuCore.DropdownMenu>
      <DeleteConfirmationDialog
        open={deleteProduct.showDeleteDialog}
        onOpenChange={deleteProduct.setShowDeleteDialog}
        onConfirm={deleteProduct.handleDelete}
        disabled={deleteProduct.isDeleting}
      />
    </>
  );
}
