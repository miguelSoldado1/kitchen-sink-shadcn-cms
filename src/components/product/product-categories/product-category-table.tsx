"use client";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTable } from "@/hooks/use-data-table";
import { trpc } from "@/lib/trpc/client";
import { DataTable } from "../../data-table/data-table";
import { DataTableSkeleton } from "../../data-table/data-table-skeleton";
import { AddProductCategory } from "./add-product-category";
import { columns } from "./product-category-columns";

interface ProductCategoriesTableProps {
  productId: number;
}

export function ProductCategoryTable({ productId }: ProductCategoriesTableProps) {
  const { table, query } = useDataTable({
    queryFn: (props) => trpc.productCategory.getTableProductCategories.useQuery({ ...props, productId }),
    initialState: { sorting: [{ id: "createdAt", desc: true }], pagination: { pageIndex: 0, pageSize: 3 } },
    columns: columns,
  });

  return (
    <div className="mt-1 space-y-3">
      <div className="flex justify-end"></div>
      {!query.isPending || query.isPlaceholderData ? (
        <>
          <DataTable table={table} showPagination={false} />
          <div className="flex items-center">
            <AddProductCategory productId={productId} />
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
