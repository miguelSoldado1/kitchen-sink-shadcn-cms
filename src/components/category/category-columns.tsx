import { formatDate } from "@/lib/format";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { CategoryActionsDropdownMenu } from "./category-actions-dropdown-menu";
import type { category } from "@/lib/database/schema";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<typeof category.$inferSelect>[] = [
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
    meta: {
      label: "Name",
      variant: "text",
      placeholder: "Search name…",
    },
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created Date" />,
    cell: ({ getValue }) => formatDate(getValue<Date>()),
    meta: {
      label: "Created date",
      variant: "date",
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated Date" />,
    cell: ({ getValue }) => formatDate(getValue<Date>()),
    meta: {
      label: "Updated date",
      variant: "date",
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell({ row }) {
      return <CategoryActionsDropdownMenu id={row.original.id} />;
    },
    size: 20,
  },
];
