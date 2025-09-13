"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useQueryTable } from "@/hooks/use-query-table";
import { useTRPC } from "@/utils/trpc";
import { columns } from "./user-columns";

export function UserTable() {
  const trpc = useTRPC();
  const { table, query } = useQueryTable({
    queryOptions: (params) => trpc.user.getTable.queryOptions(params, { placeholderData: (prev) => prev }),
    initialState: { sorting: [{ id: "createdAt", desc: true }], columnPinning: { right: ["actions"] } },
    columns,
  });

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
