"use client";

import { trpc } from "@/app/_trpc/client";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
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

// const categoryOptions = [
//   { label: "Electronics", value: "Electronics" },
//   { label: "Accessories", value: "Accessories" },
//   { label: "Home", value: "Home" },
//   { label: "Outdoors", value: "Outdoors" },
//   { label: "Apparel", value: "Apparel" },
//   { label: "Stationery", value: "Stationery" },
//   { label: "Fitness", value: "Fitness" },
// ];

const columns: ColumnDef<typeof product.$inferSelect>[] = [
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      label: "Name",
      variant: "text",
      placeholder: "Search name…",
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => currency(getValue<number>()),
    meta: {
      label: "Price",
      variant: "range",
      unit: "$",
      range: [0, 1000],
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "sku",
    header: "Sku",
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ getValue }) => formatDate(getValue<Date>()),
    meta: {
      label: "Created",
      variant: "date",
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated Date",
    cell: ({ getValue }) => formatDate(getValue<Date>()),
    meta: {
      label: "Updated",
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

interface ProductTableProps {
  page: number;
  perPage: number;
}

export function ProductTable({ page, perPage }: ProductTableProps) {
  const { data, isPending, isPlaceholderData } = trpc.getTableProducts.useQuery(
    { page, limit: perPage },
    { placeholderData: (previousData) => previousData },
  );

  const { table } = useDataTable({
    data: data?.products ?? [],
    pageCount: data?.pageCount ?? 0,
    columns: columns,
    shallow: false,
    initialState: {
      pagination: {
        pageIndex: page,
        pageSize: perPage,
      },
    },
  });

  if (isPending && !isPlaceholderData) {
    return (
      <DataTableSkeleton
        columnCount={6}
        withViewOptions={false}
        cellWidths={["15rem", "10rem", "8rem", "8rem", "8rem", "10rem"]}
        shrinkZero
        filterCount={3}
      />
    );
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>{/* <DataTableSortList table={table} /> */}</DataTableToolbar>
    </DataTable>
  );
}
