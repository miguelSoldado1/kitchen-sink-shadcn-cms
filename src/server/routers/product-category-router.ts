import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { TRPCError } from "@trpc/server";
import { and, count, eq } from "drizzle-orm";
import z from "zod";
import { buildQueryParams, getTableDataInput } from "../table-query";
import { readProcedure, router, writeProcedure } from "../trpc";
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

const createProductCategoryInput = z.object({
  productId: z.number(),
  categories: z.array(z.coerce.number()).min(1),
});

async function createProductCategoryHandler(input: z.infer<typeof createProductCategoryInput>) {
  try {
    const [existingProduct] = await db
      .select({ id: schema.product.id })
      .from(schema.product)
      .where(eq(schema.product.id, input.productId));

    if (!existingProduct) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Product with id ${input.productId} not found`,
      });
    }

    return db
      .insert(schema.productCategory)
      .values(input.categories.map((categoryId) => ({ productId: input.productId, categoryId })));
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create product category",
      cause: error,
    });
  }
}

const deleteProductCategorySchema = z.object({ id: z.number().positive() });

async function deleteProductCategoryHandler(input: z.infer<typeof deleteProductCategorySchema>) {
  try {
    const [existingProductCategory] = await db
      .select({ id: schema.productCategory.id })
      .from(schema.productCategory)
      .where(eq(schema.productCategory.id, input.id));

    if (!existingProductCategory) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Product category with id ${input.id} not found`,
      });
    }

    await db.delete(schema.productCategory).where(eq(schema.productCategory.id, input.id));
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete product category",
      cause: error,
    });
  }
}

export const productCategoryRouter = router({
  getTableProductCategories: readProcedure
    .input(getTableProductCategoryInput)
    .query(({ input }) => getTableProductCategoryHandler(input)),
  createProductCategory: writeProcedure
    .input(createProductCategoryInput)
    .mutation(({ input }) => createProductCategoryHandler(input)),
  deleteProductCategory: writeProcedure
    .input(deleteProductCategorySchema)
    .mutation(({ input }) => deleteProductCategoryHandler(input)),
});
