"use client";

import { trpc } from "@/app/_trpc/client";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import { formatDate } from "@/lib/format";
import { EditIcon, Ellipsis, TrashIcon } from "lucide-react";
import type { product } from "@/lib/database/schema";
import type { ColumnDef } from "@tanstack/react-table";

function currency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

const columns: ColumnDef<typeof product.$inferSelect>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    enableMultiSort: false,
    meta: {
      label: "Name",
      variant: "text",
      placeholder: "Search name…",
    },
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: "sku",
    accessorKey: "sku",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sku" />,
    meta: { label: "Sku", variant: "text", placeholder: "Search sku…" },
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    id: "price",
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ getValue }) => currency(getValue<number>()),
    meta: {
      label: "Price",
      variant: "range",
      unit: "$",
      range: [0, 2000],
    },
    enableSorting: true,
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
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Open menu" variant="ghost" className="data-[state=open]:bg-muted flex size-8 p-0">
              <Ellipsis className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="flex justify-between">
              Edit <EditIcon />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-between">
              Delete <TrashIcon />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 20,
  },
];

export function ProductTable() {
  const { table, query } = useDataTable({
    queryFn: (props) => trpc.getTableProducts.useQuery(props, { placeholderData: (previousData) => previousData }),
    columns,
  });

  if (query.isPending && !query.isPlaceholderData) {
    return (
      <DataTableSkeleton
        columnCount={6}
        cellWidths={["15rem", "10rem", "8rem", "8rem", "8rem", "10rem"]}
        filterCount={5}
        rowCount={10}
        shrinkZero
      />
    );
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DataTableSortList table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
