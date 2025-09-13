"use client";

import { useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { getSortingStateParser } from "@/lib/parsers";
import { useQuery } from "@tanstack/react-query";
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
import type { UseQueryOptions } from "@tanstack/react-query";
import type {
  ColumnDef,
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

type QueryOptionsOrBuilder<TData, TQueryFnData> =
  | UseQueryOptions<TQueryFnData, unknown, TQueryFnData>
  | ((params: DataTableQueryParams<TData>) => unknown);

interface UseQueryTableProps<TData, TQueryFnData = { data: TData[]; pageCount: number }> {
  columns: ColumnDef<TData>[];
  initialState?: Partial<TableOptions<TData>>["initialState"];
  debounceMs?: number;
  queryOptions: QueryOptionsOrBuilder<TData, TQueryFnData>;
}

const PAGE_KEY = "page";
const PER_PAGE_KEY = "perPage";
const SORT_KEY = "sort";
const ARRAY_SEPARATOR = ",";
const DEBOUNCE_MS = 300;

export interface DataTableQueryParams<T> {
  page: number;
  limit: number;
  sorting?: ExtendedColumnSort<T>[];
  filters?: Record<string, string | number | (string | number)[]>;
}

function computeColumnIds<T>(columns: ColumnDef<T>[]) {
  return new Set(columns.map((column) => column.id).filter((id): id is string => Boolean(id)));
}

function buildFilterParsers<T>(filterableColumns: ColumnDef<T>[]) {
  return filterableColumns.reduce<Record<string, Parser<string> | Parser<string[]>>>((acc, column) => {
    if (column.meta?.options) {
      acc[column.id ?? ""] = parseAsArrayOf(parseAsString, ARRAY_SEPARATOR).withOptions({ shallow: true });
    } else {
      acc[column.id ?? ""] = parseAsString.withOptions({ shallow: true });
    }
    return acc;
  }, {});
}

function computeFilters(filterValues: Record<string, string | string[] | null>) {
  const result: Record<string, string | string[]> = {};
  Object.entries(filterValues).forEach(([key, value]) => {
    if (value !== null) result[key] = value;
  });
  return result;
}

function computeInitialColumnFilters(filterValues: Record<string, string | string[] | null>) {
  return Object.entries(filterValues).reduce<ColumnFiltersState>((filters, [key, value]) => {
    if (value !== null) {
      const processedValue = Array.isArray(value)
        ? value
        : typeof value === "string" && /[^a-zA-Z0-9]/.test(value)
          ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
          : [value];

      filters.push({ id: key, value: processedValue });
    }
    return filters;
  }, []);
}

function buildQueryParams<T>(
  page: number,
  perPage: number,
  sorting: ExtendedColumnSort<T>[] | undefined,
  filters: Record<string, string | string[]>,
) {
  return { page, limit: perPage, sorting, filters } as DataTableQueryParams<T>;
}

// normalize tRPC or other custom option shapes to a UseQueryOptions object
function normalizeQueryOptions<U>(opts: unknown): UseQueryOptions<U, unknown, U> {
  return opts as UseQueryOptions<U, unknown, U>;
}

export function useQueryTable<
  TData,
  TQueryFnData extends { data: TData[]; pageCount: number } = { data: TData[]; pageCount: number },
>({ columns, initialState, debounceMs = DEBOUNCE_MS, queryOptions }: UseQueryTableProps<TData, TQueryFnData>) {
  // URL state: page & perPage
  const [page, setPage] = useQueryState(PAGE_KEY, parseAsInteger.withDefault(1).withOptions({ shallow: true }));
  const [perPage, setPerPage] = useQueryState(
    PER_PAGE_KEY,
    parseAsInteger.withDefault(initialState?.pagination?.pageSize ?? 10).withOptions({ shallow: true }),
  );

  // Sorting parser based on column IDs
  const columnIds = useMemo(() => computeColumnIds(columns), [columns]);

  const [sorting, setSorting] = useQueryState(
    SORT_KEY,
    getSortingStateParser<TData>(columnIds)
      .withOptions({ shallow: true })
      .withDefault((initialState?.sorting ?? []) as ExtendedColumnSort<TData>[]),
  );

  // Filters
  const filterableColumns = useMemo(() => columns.filter((c) => c.enableColumnFilter), [columns]);
  const filterParsers = useMemo(() => buildFilterParsers(filterableColumns), [filterableColumns]);

  const [filterValues, setFilterValues] = useQueryStates(filterParsers, { shallow: true });

  const debouncedSetFilterValues = useDebouncedCallback((values: typeof filterValues) => {
    void setPage(1);
    void setFilterValues(values);
  }, debounceMs);

  const filters = useMemo(() => computeFilters(filterValues), [filterValues]);

  const queryParams: DataTableQueryParams<TData> = useMemo(
    () => buildQueryParams(page, perPage, sorting, filters),
    [page, perPage, sorting, filters],
  );

  // Table state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState?.columnVisibility ?? {});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(initialState?.columnPinning ?? {});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialState?.rowSelection ?? {});

  const initialColumnFilters: ColumnFiltersState = useMemo(
    () => computeInitialColumnFilters(filterValues),
    [filterValues],
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters);

  const pagination: PaginationState = useMemo(() => ({ pageIndex: page - 1, pageSize: perPage }), [page, perPage]);

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
        setSorting(newSorting as ExtendedColumnSort<TData>[]);
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
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
            const val = filter.value;
            if (typeof val === "string" || Array.isArray(val)) {
              acc[filter.id] = val;
            } else if (val != null) {
              acc[filter.id] = String(val);
            } else {
              acc[filter.id] = null;
            }
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

  const getTableConfig = useCallback(
    (data: TData[], pageCount: number): TableOptions<TData> => {
      return {
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
    ],
  );

  const resolvedQueryOptions = useCallback(() => {
    return typeof queryOptions === "function" ? queryOptions(queryParams) : queryOptions;
  }, [queryOptions, queryParams]);

  const memoizedResolvedOptions = useMemo(() => resolvedQueryOptions(), [resolvedQueryOptions]);
  const normalizedOptions = useMemo(
    () => normalizeQueryOptions<TQueryFnData>(memoizedResolvedOptions),
    [memoizedResolvedOptions],
  );

  const query = useQuery(normalizedOptions);

  const table = useReactTable<TData>(getTableConfig(query.data?.data ?? [], query.data?.pageCount ?? -1));

  return { table, query };
}
