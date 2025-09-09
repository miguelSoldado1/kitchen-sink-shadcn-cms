"use client";

import { useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { getSortingStateParser } from "@/lib/parsers";
import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState, useQueryStates } from "nuqs";
import type { ExtendedColumnSort } from "@/types/data-table";
import type {
  ColumnFiltersState,
  ColumnPinningState,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  Updater,
  VisibilityState,
} from "@tanstack/react-table";
import type { Parser } from "nuqs";

const PAGE_KEY = "page";
const PER_PAGE_KEY = "perPage";
const SORT_KEY = "sort";
const ARRAY_SEPARATOR = ",";
const DEBOUNCE_MS = 300;

interface UseDataTableOptions<T>
  extends Omit<
    TableOptions<T>,
    | "data"
    | "pageCount"
    | "state"
    | "onPaginationChange"
    | "onSortingChange"
    | "onColumnFiltersChange"
    | "onColumnVisibilityChange"
    | "onRowSelectionChange"
    | "getCoreRowModel"
    | "getFilteredRowModel"
    | "getPaginationRowModel"
    | "getSortedRowModel"
    | "getFacetedRowModel"
    | "getFacetedUniqueValues"
    | "getFacetedMinMaxValues"
  > {
  debounceMs?: number;
}

export interface DataTableQueryParams<T> {
  page: number;
  limit: number;
  sorting?: ExtendedColumnSort<T>[];
  filters?: Record<string, string | number | (string | number)[]>;
}

export function useDataTableConfig<T>({
  columns,
  debounceMs = DEBOUNCE_MS,
  initialState,
  ...tableProps
}: UseDataTableOptions<T>) {
  const [page, setPage] = useQueryState(PAGE_KEY, parseAsInteger.withDefault(1).withOptions({ shallow: true }));
  const [perPage, setPerPage] = useQueryState(
    PER_PAGE_KEY,
    parseAsInteger.withDefault(initialState?.pagination?.pageSize ?? 10).withOptions({ shallow: true }),
  );

  // Get column IDs for sorting parser
  const columnIds = useMemo(() => {
    return new Set(columns.map((column) => column.id).filter(Boolean) as string[]);
  }, [columns]);

  const [sorting, setSorting] = useQueryState(
    SORT_KEY,
    getSortingStateParser<T>(columnIds)
      .withOptions({ shallow: true })
      .withDefault((initialState?.sorting as ExtendedColumnSort<T>[]) ?? []),
  );

  // Filtering setup
  const filterableColumns = useMemo(() => {
    return columns.filter((column) => column.enableColumnFilter);
  }, [columns]);

  const filterParsers = useMemo(() => {
    return filterableColumns.reduce<Record<string, Parser<string> | Parser<string[]>>>((acc, column) => {
      if (column.meta?.options) {
        acc[column.id ?? ""] = parseAsArrayOf(parseAsString, ARRAY_SEPARATOR).withOptions({ shallow: true });
      } else {
        acc[column.id ?? ""] = parseAsString.withOptions({ shallow: true });
      }
      return acc;
    }, {});
  }, [filterableColumns]);

  const [filterValues, setFilterValues] = useQueryStates(filterParsers, { shallow: true });

  const debouncedSetFilterValues = useDebouncedCallback((values: typeof filterValues) => {
    void setPage(1); // Reset to first page when filtering
    void setFilterValues(values);
  }, debounceMs);

  // Convert filter values to the format expected by the query
  const filters = useMemo(() => {
    const result: Record<string, string | string[]> = {};
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value !== null) {
        result[key] = value;
      }
    });
    return result;
  }, [filterValues]);

  // Query properties to be used with useQuery
  const queryParams: DataTableQueryParams<T> = useMemo(
    () => ({
      page,
      limit: perPage,
      sorting,
      filters,
    }),
    [page, perPage, sorting, filters],
  );

  // Table state - use regular useState for other states with initialState support
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState?.columnVisibility ?? {});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(initialState?.columnPinning ?? {});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialState?.rowSelection ?? {});

  // Initialize column filters from URL state
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    return Object.entries(filterValues).reduce<ColumnFiltersState>((filters, [key, value]) => {
      if (value !== null) {
        const processedValue = Array.isArray(value)
          ? value
          : typeof value === "string" && /[^a-zA-Z0-9]/.test(value)
            ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
            : [value];

        filters.push({
          id: key,
          value: processedValue,
        });
      }
      return filters;
    }, []);
  }, [filterValues]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters);

  const pagination: PaginationState = useMemo(() => {
    return {
      pageIndex: page - 1,
      pageSize: perPage,
    };
  }, [page, perPage]);

  const onPaginationChange = useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === "function") {
        const newPagination = updaterOrValue(pagination);
        void setPage(newPagination.pageIndex + 1);
        void setPerPage(newPagination.pageSize);
      } else {
        void setPage(updaterOrValue.pageIndex + 1);
        void setPerPage(updaterOrValue.pageSize);
      }
    },
    [pagination, setPage, setPerPage],
  );

  const onSortingChange = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === "function") {
        const newSorting = updaterOrValue(sorting);
        setSorting(newSorting as ExtendedColumnSort<T>[]);
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<T>[]);
      }
    },
    [sorting, setSorting],
  );

  const onColumnFiltersChange = useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      setColumnFilters((prev) => {
        const next = typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;

        const filterUpdates = next.reduce<Record<string, string | string[] | null>>((acc, filter) => {
          if (filterableColumns.find((column) => column.id === filter.id)) {
            acc[filter.id] = filter.value as string | string[];
          }
          return acc;
        }, {});

        for (const prevFilter of prev) {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null;
          }
        }

        debouncedSetFilterValues(filterUpdates);
        return next;
      });
    },
    [debouncedSetFilterValues, filterableColumns],
  );

  // Function to create table with query data
  const getTableConfig = useCallback(
    (data: T[], pageCount: number): TableOptions<T> => {
      return {
        ...tableProps,
        columns,
        data,
        pageCount,
        state: {
          pagination,
          sorting,
          columnFilters,
          columnVisibility,
          columnPinning,
          rowSelection,
        },
        onPaginationChange,
        onSortingChange,
        onColumnFiltersChange,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnPinningChange: setColumnPinning,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
      };
    },
    [
      tableProps,
      columns,
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      columnPinning,
      rowSelection,
      onPaginationChange,
      onSortingChange,
      onColumnFiltersChange,
      setColumnVisibility,
      setColumnPinning,
      setRowSelection,
    ],
  );

  return { queryParams, getTableConfig };
}

export function useDataTableFromQuery<T>(
  getTableConfig: (data: T[], pageCount: number) => TableOptions<T>,
  data?: { data: T[]; pageCount: number } | undefined,
) {
  return useReactTable<T>(getTableConfig(data?.data ?? [], data?.pageCount ?? -1));
}
