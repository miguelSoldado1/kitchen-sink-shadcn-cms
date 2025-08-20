import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/format";
import { TrashIcon } from "lucide-react";
import type { trpc } from "@/lib/trpc/client";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ReturnType<typeof trpc.productCategory.getTableProductCategories.useQuery>>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    enableSorting: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    enableSorting: false,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created Date" />,
    cell: ({ getValue }) => formatDate(getValue<Date>()),
    enableSorting: true,
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated Date" />,
    cell: ({ getValue }) => formatDate(getValue<Date>()),
    enableSorting: true,
  },
  {
    id: "actions",
    cell: () => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" className="text-destructive focus:text-destructive size-4 cursor-pointer">
            <TrashIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
    ),
    size: 20,
  },
];
