import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { buildQueryParams } from "@/server/table-query";
import { count, eq } from "drizzle-orm";
import z from "zod";
import { publicProcedure, router } from "./trpc";
import type { TableQueryConfig } from "@/server/table-query";

const PRODUCT_SORT_COLUMNS = {
  id: schema.product.id,
  name: schema.product.name,
  description: schema.product.description,
  sku: schema.product.sku,
  price: schema.product.price,
  createdAt: schema.product.createdAt,
  updatedAt: schema.product.updatedAt,
} as const;

const PRODUCT_CONFIG: TableQueryConfig<typeof PRODUCT_SORT_COLUMNS> = {
  sortColumns: PRODUCT_SORT_COLUMNS,
  filterColumns: {
    name: schema.product.name,
    description: schema.product.description,
    sku: schema.product.sku,
    price: schema.product.price,
    createdAt: schema.product.createdAt,
    updatedAt: schema.product.updatedAt,
  },
  dateColumns: new Set(["createdAt", "updatedAt"]),
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

const createProductInput = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  sku: z.string().min(2).max(10),
  price: z.number().min(0.01).multipleOf(0.01),
});

export const appRouter = router({
  getTableProducts: publicProcedure.input(getTableProductsInput).query(async ({ input }) => {
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
  }),
  getProduct: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const [product] = await db.select().from(schema.product).where(eq(schema.product.id, input.id));
    if (!product) {
      throw new Error(`Product with id ${input.id} not found`);
    }

    return product;
  }),
  deleteProduct: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return db.delete(schema.product).where(eq(schema.product.id, input.id));
  }),
  createProduct: publicProcedure.input(createProductInput).mutation(async ({ input }) => {
    const [product] = await db
      .insert(schema.product)
      .values({ ...input, price: input.price.toFixed(2) })
      .returning({ id: schema.product.id });

    return product.id;
  }),
  updateProduct: publicProcedure.input(createProductInput.extend({ id: z.number() })).mutation(async ({ input }) => {
    return db
      .update(schema.product)
      .set({ ...input, price: input.price.toFixed(2), updatedAt: new Date() })
      .where(eq(schema.product.id, input.id));
  }),
});

export type AppRouter = typeof appRouter;
