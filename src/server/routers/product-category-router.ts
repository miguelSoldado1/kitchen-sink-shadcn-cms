import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { and, count, eq } from "drizzle-orm";
import z from "zod";
import { buildQueryParams, getTableDataInput } from "../table-query";
import { readProcedure, router } from "../trpc";
import type { TableQueryConfig } from "../table-query";

const SORT_COLUMNS = {
  createdAt: schema.productCategory.createdAt,
  updatedAt: schema.productCategory.updatedAt,
} as const;

const FILTER_COLUMNS = {} as const;

const CONFIG: TableQueryConfig<typeof SORT_COLUMNS, typeof FILTER_COLUMNS> = {
  sortColumns: SORT_COLUMNS,
  filterColumns: FILTER_COLUMNS,
  dateColumns: new Set(["createdAt", "updatedAt"]),
} as const;

const productCategorySelect = {
  id: schema.productCategory.id,
  name: schema.category.name,
  createdAt: schema.productCategory.createdAt,
  updatedAt: schema.productCategory.updatedAt,
};

const getTableProductCategoryInput = getTableDataInput.extend({ productId: z.number() });

async function getTableProductCategoryHandler(input: z.infer<typeof getTableProductCategoryInput>) {
  const queryParams = buildQueryParams(input, CONFIG);

  const combinedWhereClause = queryParams.whereClause
    ? and(eq(schema.productCategory.productId, input.productId), queryParams.whereClause)
    : eq(schema.productCategory.productId, input.productId);

  const baseQuery = db
    .select(productCategorySelect)
    .from(schema.productCategory)
    .innerJoin(schema.category, eq(schema.productCategory.categoryId, schema.category.id))
    .where(combinedWhereClause);

  const query = queryParams.orderBy.length ? baseQuery.orderBy(...queryParams.orderBy) : baseQuery;

  const [data, totalCount] = await Promise.all([
    query.limit(queryParams.limit).offset(queryParams.offset),
    db.select({ count: count() }).from(schema.productCategory).where(combinedWhereClause),
  ]);

  return {
    data,
    pageCount: Math.ceil(totalCount[0].count / queryParams.limit),
  };
}

export const productCategoryRouter = router({
  getTableProductCategories: readProcedure
    .input(getTableProductCategoryInput)
    .query(({ input }) => getTableProductCategoryHandler(input)),
});
