import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import * as DialogCore from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/auth-client";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<unknown>;
  disabled?: boolean;
}

export function DeleteConfirmationDialog({ open, onOpenChange, onConfirm, disabled }: DeleteConfirmationDialogProps) {
  const { data: session } = authClient.useSession();

  async function handleConfirm() {
    if (!session?.user.role || !["admin", "write"].includes(session.user.role)) {
      toast.error("You do not have permission to delete this item.");
      return onOpenChange(false);
    }

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
