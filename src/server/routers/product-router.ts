import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { buildQueryParams } from "@/server/table-query";
import { TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import z from "zod";
import { readProcedure, router, writeProcedure } from "../trpc";
import type { TableQueryConfig } from "@/server/table-query";

const PRODUCT_SORT_COLUMNS = {
  price: schema.product.price,
  createdAt: schema.product.createdAt,
  updatedAt: schema.product.updatedAt,
} as const;

const PRODUCT_FILTER_COLUMNS = {
  name: schema.product.name,
  sku: schema.product.sku,
  price: schema.product.price,
  createdAt: schema.product.createdAt,
  updatedAt: schema.product.updatedAt,
} as const;

const PRODUCT_CONFIG: TableQueryConfig<typeof PRODUCT_SORT_COLUMNS, typeof PRODUCT_FILTER_COLUMNS> = {
  sortColumns: PRODUCT_SORT_COLUMNS,
  filterColumns: PRODUCT_FILTER_COLUMNS,
  dateColumns: new Set(["createdAt", "updatedAt"]),
  textColumns: new Set(["name", "sku"]),
  rangeColumns: new Set(["price"]),
} as const;

const getTableProductsInput = z.object({
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

async function getTableProductsHandler(input: z.infer<typeof getTableProductsInput>) {
  // Build query parameters using the reusable utility
  const queryParams = buildQueryParams(input, PRODUCT_CONFIG);

  // Build queries
  const baseQuery = db.select().from(schema.product);
  const productsQuery = queryParams.whereClause ? baseQuery.where(queryParams.whereClause) : baseQuery;
  const sortedQuery = queryParams.orderBy.length > 0 ? productsQuery.orderBy(...queryParams.orderBy) : productsQuery;

  const [products, totalCount] = await Promise.all([
    sortedQuery.limit(queryParams.limit).offset(queryParams.offset),
    db.select({ count: count() }).from(schema.product).where(queryParams.whereClause),
  ]);

  return {
    data: products,
    pageCount: Math.ceil(totalCount[0].count / queryParams.limit),
  };
}

const getProductSchema = z.object({ id: z.number().positive() });

async function getProductHandler(input: z.infer<typeof getProductSchema>) {
  const [product] = await db.select().from(schema.product).where(eq(schema.product.id, input.id));
  if (!product) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Product with id ${input.id} not found`,
    });
  }

  return product;
}

const deleteProductSchema = z.object({ id: z.number().positive() });

async function deleteProductHandler(input: z.infer<typeof deleteProductSchema>) {
  try {
    // Check if product exists
    const [existingProduct] = await db
      .select({ id: schema.product.id })
      .from(schema.product)
      .where(eq(schema.product.id, input.id));

    if (!existingProduct) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Product with id ${input.id} not found`,
      });
    }

    const result = await db.delete(schema.product).where(eq(schema.product.id, input.id));
    return result;
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

const createProductInput = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  sku: z.string().min(2).max(10),
  price: z.number().min(0.01).multipleOf(0.01),
});

async function createProductHandler(input: z.infer<typeof createProductInput>) {
  try {
    const [product] = await db
      .insert(schema.product)
      .values({ ...input, price: input.price.toFixed(2) })
      .returning({ id: schema.product.id });

    return product.id;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create product",
      cause: error,
    });
  }
}

const updateProductInput = z.object({
  id: z.number().positive(),
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  sku: z.string().min(2).max(10),
  price: z.number().min(0.01).multipleOf(0.01),
});

async function updateProductHandler(input: z.infer<typeof updateProductInput>) {
  try {
    const [existingProduct] = await db
      .select({ id: schema.product.id })
      .from(schema.product)
      .where(eq(schema.product.id, input.id));

    if (!existingProduct) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Product with id ${input.id} not found`,
      });
    }

    const result = await db
      .update(schema.product)
      .set({ ...input, price: input.price.toFixed(2), updatedAt: new Date() })
      .where(eq(schema.product.id, input.id));

    return result;
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update product",
      cause: error,
    });
  }
}

export const productRouter = router({
  getTableProducts: readProcedure.input(getTableProductsInput).query(({ input }) => getTableProductsHandler(input)),
  getProduct: readProcedure.input(getProductSchema).query(({ input }) => getProductHandler(input)),
  deleteProduct: writeProcedure.input(deleteProductSchema).mutation(({ input }) => deleteProductHandler(input)),
  createProduct: writeProcedure.input(createProductInput).mutation(({ input }) => createProductHandler(input)),
  updateProduct: writeProcedure.input(updateProductInput).mutation(({ input }) => updateProductHandler(input)),
});
