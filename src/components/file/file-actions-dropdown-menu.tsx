import { useState } from "react";
import * as ActionsMenuCore from "@/components/actions-menu";
import { DeleteConfirmationDialog } from "../delete-confirmation-dialog";

interface FileActionsDropdownMenuProps {
  filePath: string;
  onDownload: (filePath: string) => void;
  onDelete: (filePath: string) => void;
}

export function FileActionsDropdownMenu({ filePath, onDownload, onDelete }: FileActionsDropdownMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDownload = () => {
    onDownload(filePath);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    await onDelete(filePath);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <ActionsMenuCore.ActionsMenu>
        <ActionsMenuCore.ActionsMenuTriggerEllipsis />
        <ActionsMenuCore.ActionsContent>
          <ActionsMenuCore.ActionsMenuDownloadButton onClick={handleDownload} />
          <ActionsMenuCore.ActionsMenuDeleteButton
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={handleDelete}
          />
        </ActionsMenuCore.ActionsContent>
      </ActionsMenuCore.ActionsMenu>
      <DeleteConfirmationDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={confirmDelete} />
    </>
  );
}
