import { Button } from "@/components/ui/button";
import * as DropdownMenuCore from "@/components/ui/dropdown-menu";
import { useDeleteEntity } from "@/hooks/use-delete-entity";
import { trpc } from "@/lib/trpc/client";
import { EditIcon, Ellipsis, TrashIcon } from "lucide-react";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";

interface CategoryActionsDropdownMenuProps {
  id: number;
}

export function CategoryActionsDropdownMenu({ id }: CategoryActionsDropdownMenuProps) {
  const utils = trpc.useUtils();
  const mutation = trpc.category.deleteCategory.useMutation();
  const deleteCategory = useDeleteEntity({
    invalidate: utils.category.getTableCategories.invalidate,
    entityName: "category",
    mutation,
    id,
  });

  return (
    <>
      <DropdownMenuCore.DropdownMenu>
        <DropdownMenuCore.DropdownMenuTrigger asChild>
          <Button aria-label="Open menu" variant="ghost" className="data-[state=open]:bg-muted flex size-8 p-0">
            <Ellipsis className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuCore.DropdownMenuTrigger>
        <DropdownMenuCore.DropdownMenuContent>
          <DropdownMenuCore.DropdownMenuItem>
            <EditIcon className="size-4" />
            Edit
          </DropdownMenuCore.DropdownMenuItem>
          <DropdownMenuCore.DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={deleteCategory.openDeleteDialog}
            disabled={deleteCategory.isDeleting}
          >
            <TrashIcon className="size-4" />
            Delete
          </DropdownMenuCore.DropdownMenuItem>
        </DropdownMenuCore.DropdownMenuContent>
      </DropdownMenuCore.DropdownMenu>
      <DeleteConfirmationDialog
        open={deleteCategory.showDeleteDialog}
        onOpenChange={deleteCategory.setShowDeleteDialog}
        onConfirm={deleteCategory.handleDelete}
        disabled={deleteCategory.isDeleting}
      />
    </>
  );
}
