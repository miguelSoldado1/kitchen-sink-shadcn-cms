import { Button } from "@/components/ui/button";
import * as DialogCore from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: () => Promise<unknown>;
  disabled?: boolean;
}

export function DeleteConfirmationDialog({
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
    <DialogCore.Dialog open={open} onOpenChange={onOpenChange}>
      <DialogCore.DialogContent showCloseButton={false}>
        <DialogCore.DialogHeader>
          <DialogCore.DialogTitle>Are you absolutely sure?</DialogCore.DialogTitle>
          <DialogCore.DialogDescription>
            This action cannot be undone. This will permanently delete &ldquo;{itemName}&rdquo; and remove it from our
            servers.
          </DialogCore.DialogDescription>
        </DialogCore.DialogHeader>
        <DialogCore.DialogFooter>
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
        </DialogCore.DialogFooter>
      </DialogCore.DialogContent>
    </DialogCore.Dialog>
  );
}
