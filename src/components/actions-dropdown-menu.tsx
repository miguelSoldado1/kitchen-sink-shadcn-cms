import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import { Button } from "@/components/ui/button";
import * as DropdownMenuCore from "@/components/ui/dropdown-menu";
import { EditIcon, Ellipsis, TrashIcon } from "lucide-react";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

interface ActionsDropdownMenuProps {
  itemName: string;
  editHref: string;
  onDelete: () => Promise<unknown>;
  disabled?: boolean;
}

export function ActionsDropdownMenu({ itemName, editHref, onDelete, disabled }: ActionsDropdownMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function handleDelete() {
    const result = await tryCatch(onDelete());

    if (result.error) {
      return toast.error("Failed to delete item", {
        description: result.error?.message ?? "An unknown error occurred.",
      });
    }

    toast.success(`Successfully deleted ${itemName}`);
  }

  return (
    <>
      <DropdownMenuCore.DropdownMenu>
        <DropdownMenuCore.DropdownMenuTrigger asChild>
          <Button aria-label="Open menu" variant="ghost" className="data-[state=open]:bg-muted flex size-8 p-0">
            <Ellipsis className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuCore.DropdownMenuTrigger>
        <DropdownMenuCore.DropdownMenuContent>
          <DropdownMenuCore.DropdownMenuItem asChild disabled={disabled}>
            <Link href={editHref} className="flex justify-between">
              Edit <EditIcon />
            </Link>
          </DropdownMenuCore.DropdownMenuItem>

          <DropdownMenuCore.DropdownMenuItem
            className="flex justify-between"
            variant="destructive"
            disabled={disabled}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete <TrashIcon />
          </DropdownMenuCore.DropdownMenuItem>
        </DropdownMenuCore.DropdownMenuContent>
      </DropdownMenuCore.DropdownMenu>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        itemName={itemName}
        onConfirm={handleDelete}
        disabled={disabled}
      />
    </>
  );
}
