import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { count } from "drizzle-orm";
import z from "zod";
import { buildQueryParams } from "../table-query";
import { readProcedure, router } from "../trpc";
import type { TableQueryConfig } from "../table-query";

const SORT_COLUMNS = {
  createdAt: schema.category.createdAt,
  updatedAt: schema.category.updatedAt,
} as const;

const FILTER_COLUMNS = {
  name: schema.category.name,
  createdAt: schema.category.createdAt,
  updatedAt: schema.category.updatedAt,
} as const;

const CONFIG: TableQueryConfig<typeof SORT_COLUMNS, typeof FILTER_COLUMNS> = {
  sortColumns: SORT_COLUMNS,
  filterColumns: FILTER_COLUMNS,
  dateColumns: new Set(["createdAt", "updatedAt"]),
  textColumns: new Set(["name"]),
} as const;

const getTableCategoriesInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sorting: z
    .array(z.object({ id: z.string(), desc: z.boolean() }))
    .optional()
    .default([]),
  filters: z
    .record(z.string(), z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]))
    .optional()
    .default({}),
});

async function getTableCategoriesHandler(input: z.infer<typeof getTableCategoriesInput>) {
  // Build query parameters using the reusable utility
  const queryParams = buildQueryParams(input, CONFIG);

  // Build queries
  const baseQuery = db.select().from(schema.category);
  const filterQuery = queryParams.whereClause ? baseQuery.where(queryParams.whereClause) : baseQuery;
  const sortedQuery = queryParams.orderBy.length > 0 ? filterQuery.orderBy(...queryParams.orderBy) : filterQuery;

  const [data, totalCount] = await Promise.all([
    sortedQuery.limit(queryParams.limit).offset(queryParams.offset),
    db.select({ count: count() }).from(schema.category).where(queryParams.whereClause),
  ]);

  return {
    data: data,
    pageCount: Math.ceil(totalCount[0].count / queryParams.limit),
  };
}

export const categoryRouter = router({
  getTableCategories: readProcedure
    .input(getTableCategoriesInput)
    .query(({ input }) => getTableCategoriesHandler(input)),
});
