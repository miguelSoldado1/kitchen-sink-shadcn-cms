import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { TRPCError } from "@trpc/server";
import { count, eq, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import z from "zod";
import { buildQueryParams, getTableDataInput } from "../table-query";
import { readProcedure, router, writeProcedure } from "../trpc";
import type { TableQueryConfig } from "../table-query";

const SORT_COLUMNS = {
  createdAt: schema.productBundle.createdAt,
  updatedAt: schema.productBundle.updatedAt,
} as const;

const FILTER_COLUMNS = {
  id: schema.productBundle.id,
  createdAt: schema.productBundle.createdAt,
  updatedAt: schema.productBundle.updatedAt,
} as const;

const CONFIG: TableQueryConfig<typeof SORT_COLUMNS, typeof FILTER_COLUMNS> = {
  sortColumns: SORT_COLUMNS,
  filterColumns: FILTER_COLUMNS,
  dateColumns: new Set(["createdAt", "updatedAt"]),
  numberColumns: new Set(["id"]),
} as const;

async function getTableHandler(input: z.infer<typeof getTableDataInput>) {
  // Build query parameters using the reusable utility
  const queryParams = buildQueryParams(input, CONFIG);

  // Create table aliases for joining the same product table twice
  const primaryProduct = alias(schema.product, "primary_product");
  const bundledProduct = alias(schema.product, "bundled_product");

  const baseQuery = db
    .select({
      id: schema.productBundle.id,
      primaryProductId: schema.productBundle.primaryProductId,
      bundledProductId: schema.productBundle.bundledProductId,
      primaryProductName: primaryProduct.name,
      bundledProductName: bundledProduct.name,
      createdAt: schema.productBundle.createdAt,
      updatedAt: schema.productBundle.updatedAt,
    })
    .from(schema.productBundle)
    .innerJoin(primaryProduct, eq(schema.productBundle.primaryProductId, primaryProduct.id))
    .innerJoin(bundledProduct, eq(schema.productBundle.bundledProductId, bundledProduct.id));

  const filterQuery = queryParams.whereClause ? baseQuery.where(queryParams.whereClause) : baseQuery;
  const sortedQuery = queryParams.orderBy.length > 0 ? filterQuery.orderBy(...queryParams.orderBy) : filterQuery;

  const [data, totalCount] = await Promise.all([
    sortedQuery.limit(queryParams.limit).offset(queryParams.offset),
    db.select({ count: count() }).from(schema.productBundle).where(queryParams.whereClause),
  ]);

  return {
    data: data,
    pageCount: Math.ceil(totalCount[0].count / queryParams.limit),
  };
}

const createProductBundleInput = z.object({
  primaryProductId: z.coerce.number().positive(),
  bundledProductId: z.coerce.number().positive(),
});

async function createHandler(input: z.infer<typeof createProductBundleInput>) {
  try {
    const [existingPrimaryProduct] = await db
      .select({ id: schema.product.id })
      .from(schema.product)
      .where(eq(schema.product.id, input.primaryProductId));

    if (!existingPrimaryProduct) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Product with id ${input.primaryProductId} not found`,
      });
    }

    const [existingBundledProduct] = await db
      .select({ id: schema.product.id })
      .from(schema.product)
      .where(eq(schema.product.id, input.bundledProductId));

    if (!existingBundledProduct) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Product with id ${input.bundledProductId} not found`,
      });
    }

    return db
      .insert(schema.productBundle)
      .values({ primaryProductId: input.primaryProductId, bundledProductId: input.bundledProductId });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create product bundle",
    });
  }
}

const bulkCreateInput = z.array(createProductBundleInput);

async function bulkCreateHandler(input: z.infer<typeof bulkCreateInput>) {
  try {
    const allProductIds = new Set([
      ...input.map((item) => item.primaryProductId),
      ...input.map((item) => item.bundledProductId),
    ]);

    const existingProducts = await db
      .select({ id: schema.product.id })
      .from(schema.product)
      .where(inArray(schema.product.id, Array.from(allProductIds)));

    const existingProductIds = new Set(existingProducts.map((p) => p.id));

    const missingPrimaryIds = input
      .filter((item) => !existingProductIds.has(item.primaryProductId))
      .map((item) => item.primaryProductId);

    const missingBundledIds = input
      .filter((item) => !existingProductIds.has(item.bundledProductId))
      .map((item) => item.bundledProductId);

    if (missingPrimaryIds.length > 0 || missingBundledIds.length > 0) {
      const missingIds = [...new Set([...missingPrimaryIds, ...missingBundledIds])];
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Products with ids ${missingIds.join(", ")} not found`,
      });
    }

    return await db.insert(schema.productBundle).values(
      input.map((item) => ({
        primaryProductId: item.primaryProductId,
        bundledProductId: item.bundledProductId,
      })),
    );
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create product bundles",
    });
  }
}

export const productBundleRouter = router({
  getTable: readProcedure.input(getTableDataInput).query(({ input }) => getTableHandler(input)),
  create: writeProcedure.input(createProductBundleInput).mutation(({ input }) => createHandler(input)),
  bulkCreate: writeProcedure.input(bulkCreateInput).mutation(async ({ input }) => bulkCreateHandler(input)),
});
