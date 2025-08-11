"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { trpc } from "@/lib/trpc/client";
import { columns } from "./product-columns";

export function ProductTable() {
  const { table, query } = useDataTable({
    queryFn: (props) =>
      trpc.product.getTableProducts.useQuery(props, { placeholderData: (previousData) => previousData }),
    initialState: { sorting: [{ id: "createdAt", desc: true }], columnPinning: { right: ["actions"] } },
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
