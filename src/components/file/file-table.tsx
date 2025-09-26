"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileIcon, FolderIcon, PlayIcon } from "lucide-react";
import { FileActionsDropdownMenu } from "./file-actions-dropdown-menu";

interface ExplorerItem {
  name: string;
  type: "file" | "folder";
  path: string;
  size?: number | string;
}

interface FileTableProps {
  items: ExplorerItem[];
  navigateTo: (path: string) => void;
  handleDownload: (filePath: string) => void;
  handleDelete: (filePath: string) => void;
}

function formatSize(size?: number | string) {
  if (size == null) {
    return "";
  }
  if (typeof size === "string") {
    return size;
  }
  if (size < 1024) {
    return size + " B";
  }
  if (size < 1024 * 1024) {
    return Math.round((size / 1024) * 10) / 10 + " KB";
  }
  return Math.round((size / (1024 * 1024)) * 10) / 10 + " MB";
}

export function FileTable({ items, navigateTo, handleDownload, handleDelete }: FileTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(function (item) {
          return (
            <TableRow
              key={item.path}
              role={item.type === "folder" ? "button" : undefined}
              tabIndex={item.type === "folder" ? 0 : undefined}
              onClick={function () {
                if (item.type === "folder") {
                  navigateTo(item.path);
                }
              }}
              className={item.type === "folder" ? "cursor-pointer" : undefined}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {item.type === "folder" ? <FolderIcon className="size-4" /> : <FileIcon className="size-4" />}
                  <span className="select-none">{item.name}</span>
                </div>
              </TableCell>
              <TableCell className="capitalize">{item.type}</TableCell>
              <TableCell>{item.type === "file" ? formatSize(item.size) : "------"}</TableCell>
              <TableCell className="text-right">
                <div
                  onClick={function (e) {
                    e.stopPropagation();
                  }}
                  onKeyDown={function (e) {
                    e.stopPropagation();
                  }}
                  className="flex items-center justify-end"
                >
                  {item.type === "file" ? (
                    <div className="flex items-center">
                      <Button size="sm" variant="ghost">
                        <PlayIcon className="size-4" />
                      </Button>
                      <FileActionsDropdownMenu
                        filePath={item.path}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                      />
                    </div>
                  ) : (
                    <div aria-hidden className="h-8 w-8" />
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
