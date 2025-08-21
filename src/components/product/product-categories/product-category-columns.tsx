import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { formatDate } from "@/lib/format";
import { DeleteProductCategory } from "./delete-product-category";
import type { productCategory } from "@/lib/database/schema";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<typeof productCategory.$inferSelect>[] = [
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
    cell: ({ row }) => <DeleteProductCategory id={row.original.id} />,
    size: 20,
  },
];
