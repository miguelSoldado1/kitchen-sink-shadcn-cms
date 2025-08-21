import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { TRPCError } from "@trpc/server";
import { count, eq, sql } from "drizzle-orm";
import z from "zod";
import { buildQueryParams, getTableDataInput } from "../table-query";
import { readProcedure, router, writeProcedure } from "../trpc";
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

async function getTableCategoriesHandler(input: z.infer<typeof getTableDataInput>) {
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

const getCategorySchema = z.object({ id: z.number().positive() });

async function getCategoryHandler(input: z.infer<typeof getCategorySchema>) {
  const [category] = await db.select().from(schema.category).where(eq(schema.category.id, input.id)).limit(1).execute();
  if (!category) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Category with id ${input.id} not found`,
    });
  }

  return category;
}

async function getSelectCategoriesHandler() {
  const categories = await db
    .select({
      value: sql<string>`cast(${schema.category.id} as text)`,
      label: schema.category.name,
    })
    .from(schema.category)
    .orderBy(schema.category.name);

  return categories;
}

const deleteCategorySchema = z.object({ id: z.number().positive() });

async function deleteCategoryHandler(input: z.infer<typeof deleteCategorySchema>) {
  try {
    const [existingCategory] = await db
      .select({ id: schema.category.id })
      .from(schema.category)
      .where(eq(schema.category.id, input.id));

    if (!existingCategory) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Category with id ${input.id} not found`,
      });
    }

    await db.delete(schema.category).where(eq(schema.category.id, input.id));
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update category",
      cause: error,
    });
  }
}

const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
});

async function createCategoryHandler(input: z.infer<typeof createCategorySchema>) {
  try {
    const [category] = await db.insert(schema.category).values(input).returning({ id: schema.category.id });
    return category.id;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create category",
      cause: error,
    });
  }
}

const updateCategorySchema = z.object({
  id: z.number().positive(),
  name: z.string().min(2).max(100),
});

async function updateCategoryHandler(input: z.infer<typeof updateCategorySchema>) {
  try {
    const [existingCategory] = await db
      .select({ id: schema.category.id })
      .from(schema.category)
      .where(eq(schema.category.id, input.id));

    if (!existingCategory) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Category with id ${input.id} not found`,
      });
    }

    await db
      .update(schema.category)
      .set({ name: input.name, updatedAt: new Date() })
      .where(eq(schema.category.id, input.id));
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete product",
      cause: error,
    });
  }
}

export const categoryRouter = router({
  getTableCategories: readProcedure.input(getTableDataInput).query(({ input }) => getTableCategoriesHandler(input)),
  getCategory: readProcedure.input(getCategorySchema).query(({ input }) => getCategoryHandler(input)),
  getSelectCategories: readProcedure.query(() => getSelectCategoriesHandler()),
  deleteCategory: writeProcedure.input(deleteCategorySchema).mutation(({ input }) => deleteCategoryHandler(input)),
  createCategory: writeProcedure.input(createCategorySchema).mutation(({ input }) => createCategoryHandler(input)),
  updateCategory: writeProcedure.input(updateCategorySchema).mutation(({ input }) => updateCategoryHandler(input)),
});
