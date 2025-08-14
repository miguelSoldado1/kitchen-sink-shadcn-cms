import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as DropdownMenuCore from "@/components/ui/dropdown-menu";
import { useDeleteEntity } from "@/hooks/use-delete-entity";
import { trpc } from "@/lib/trpc/client";
import { EditIcon, Ellipsis, TrashIcon } from "lucide-react";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";

interface CategoryActionsDropdownMenuProps {
  id: number;
}

export function CategoryActionsDropdownMenu({ id }: CategoryActionsDropdownMenuProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const mutation = trpc.category.deleteCategory.useMutation();
  const utils = trpc.useUtils();
  const deleteCategory = useDeleteEntity({
    invalidate: utils.category.getTableCategories.invalidate,
    mutateAsync: () => mutation.mutateAsync({ id }),
    entityName: "category",
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
          <DropdownMenuCore.DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <EditIcon className="size-4" />
            Edit
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
        onConfirm={deleteCategory}
        disabled={mutation.isPending}
      />
      <EditCategoryDialog open={showEditDialog} onOpenChange={setShowEditDialog} categoryId={id} />
    </>
  );
}
