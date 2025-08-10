import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditIcon, Ellipsis, TrashIcon } from "lucide-react";

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
      return toast.error(`Failed to delete item: ${result.error}`);
    }

    toast.success(`Successfully deleted ${itemName}`);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Open menu" variant="ghost" className="data-[state=open]:bg-muted flex size-8 p-0">
            <Ellipsis className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild disabled={disabled}>
            <Link href={editHref} className="flex justify-between">
              Edit <EditIcon />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex justify-between"
            variant="destructive"
            disabled={disabled}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete <TrashIcon />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: () => Promise<unknown>;
  disabled?: boolean;
}

function DeleteConfirmationDialog({
  open,
  onOpenChange,
  itemName,
  onConfirm,
  disabled,
}: DeleteConfirmationDialogProps) {
  async function handleConfirm() {
    await onConfirm();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete &ldquo;{itemName}&rdquo; and remove it from our
            servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={disabled}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={disabled}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
