import { Button } from "@/components/ui/button";
import * as DialogCore from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<unknown>;
  disabled?: boolean;
}

export function DeleteConfirmationDialog({ open, onOpenChange, onConfirm, disabled }: DeleteConfirmationDialogProps) {
  async function handleConfirm() {
    await onConfirm();
    onOpenChange(false);
  }

  return (
    <DialogCore.Dialog open={open} onOpenChange={onOpenChange}>
      <DialogCore.DialogContent showCloseButton={false}>
        <DialogCore.DialogHeader>
          <DialogCore.DialogTitle>Are you absolutely sure?</DialogCore.DialogTitle>
          <DialogCore.DialogDescription>
            This action cannot be undone. This will permanently delete the item and remove it from our servers.
          </DialogCore.DialogDescription>
        </DialogCore.DialogHeader>
        <DialogCore.DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={disabled}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={disabled}>
            Delete
          </Button>
        </DialogCore.DialogFooter>
      </DialogCore.DialogContent>
    </DialogCore.Dialog>
  );
}
