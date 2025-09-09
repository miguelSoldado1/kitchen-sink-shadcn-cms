"use client";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "../../data-table/data-table";
import { DataTableSkeleton } from "../../data-table/data-table-skeleton";
import { AddProductCategory } from "./add-product-category";
import { columns } from "./product-category-columns";

interface ProductCategoriesTableProps {
  productId: number;
}

export function ProductCategoryTable({ productId }: ProductCategoriesTableProps) {
  const trpc = useTRPC();
  const query = useQuery(trpc.productCategory.getAll.queryOptions({ productId }));
  const table = useReactTable({
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    initialState: { sorting: [{ id: "createdAt", desc: true }], pagination: { pageIndex: 0, pageSize: 3 } },
    data: query.data ?? [],
    columns,
  });

  return (
    <div className="space-y-3">
      <div className="flex justify-end"></div>
      {!query.isPending || query.isPlaceholderData ? (
        <>
          <DataTable table={table} showPagination={false} />
          <div className="flex items-center">
            <AddProductCategory
              productId={productId}
              existingCategories={query.data?.map((row) => row.categoryId) ?? []}
            />
            <DataTablePagination table={table} pageSizeOptions={[3, 5, 10]} />
          </div>
        </>
      ) : (
        <DataTableSkeleton
          columnCount={4}
          cellWidths={["3rem", "5rem", "3rem", "3rem"]}
          rowCount={3}
          shrinkZero
          withViewOptions={false}
        />
      )}
    </div>
  );
}
