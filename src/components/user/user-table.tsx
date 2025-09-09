"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTableConfig, useDataTableFromQuery } from "@/hooks/use-data-table-with-query";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./user-columns";

export function UserTable() {
  const { queryParams, getTableConfig } = useDataTableConfig({
    initialState: { sorting: [{ id: "createdAt", desc: true }], columnPinning: { right: ["actions"] } },
    columns,
  });

  const trpc = useTRPC();
  const query = useQuery(trpc.user.getTable.queryOptions(queryParams, { placeholderData: (prev) => prev }));
  const table = useDataTableFromQuery(getTableConfig, query.data);

  if (query.isPending && !query.isPlaceholderData) {
    return (
      <section>
        <DataTableSkeleton
          columnCount={4}
          cellWidths={["5rem", "15rem", "8rem", "8rem"]}
          filterCount={3}
          rowCount={10}
          shrinkZero
        />
      </section>
    );
  }

  return (
    <section>
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} />
        </DataTableToolbar>
      </DataTable>
    </section>
  );
}
