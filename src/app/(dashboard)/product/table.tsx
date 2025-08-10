"use client";

import { trpc } from "@/app/_trpc/client";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { columns } from "./columns";

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
