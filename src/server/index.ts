import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { and, asc, count, desc, gte, ilike, lte, or } from "drizzle-orm";
import z from "zod";
import { publicProcedure, router } from "./trpc";
import type { SQL } from "drizzle-orm";

export const appRouter = router({
  getDashboardStats: publicProcedure.query(async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalUsersRes, lastMonthUsersRes, totalProductsRes, lastMonthProductsRes] = await Promise.all([
      db.select({ count: count() }).from(schema.user),
      db.select({ count: count() }).from(schema.user).where(gte(schema.user.createdAt, thirtyDaysAgo)),
      db.select({ count: count() }).from(schema.product),
      db.select({ count: count() }).from(schema.product).where(gte(schema.product.createdAt, thirtyDaysAgo)),
    ]);

    return {
      users: {
        total: totalUsersRes[0].count,
        lastMonth: lastMonthUsersRes[0].count,
      },
      products: {
        total: totalProductsRes[0].count,
        lastMonth: lastMonthProductsRes[0].count,
      },
    };
  }),
  getTableProducts: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        sorting: z
          .array(
            z.object({
              id: z.string(),
              desc: z.boolean(),
            }),
          )
          .optional()
          .default([]),
        filters: z
          .record(z.string(), z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]))
          .optional()
          .default({}),
      }),
    )
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;

      // Build order by clause from sorting
      const orderBy = input.sorting
        .map((sort) => {
          // Map column IDs to actual table columns
          const columnMap = {
            id: schema.product.id,
            name: schema.product.name,
            description: schema.product.description,
            sku: schema.product.sku,
            price: schema.product.price,
            createdAt: schema.product.createdAt,
            updatedAt: schema.product.updatedAt,
          } as const;

          const column = columnMap[sort.id as keyof typeof columnMap];
          if (!column) return null;

          return sort.desc ? desc(column) : asc(column);
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      // Build where conditions from filters
      const whereConditions: SQL<unknown>[] = [];

      Object.entries(input.filters).forEach(([key, value]) => {
        const columnMap = {
          name: schema.product.name,
          description: schema.product.description,
          sku: schema.product.sku,
          price: schema.product.price,
          createdAt: schema.product.createdAt,
          updatedAt: schema.product.updatedAt,
        } as const;

        const column = columnMap[key as keyof typeof columnMap];
        if (!column || !value) return;

        // Handle date columns differently
        if (key === "createdAt" || key === "updatedAt") {
          if (Array.isArray(value)) {
            // Handle date range filters
            const conditions = value
              .map((v) => {
                // Handle numbers (timestamps), timestamp strings, and date strings
                const date =
                  typeof v === "number"
                    ? new Date(v)
                    : typeof v === "string" && /^\d+$/.test(v)
                      ? new Date(parseInt(v, 10))
                      : new Date(v);
                if (!isNaN(date.getTime())) {
                  // For date filters, we might want to use gte/lte for ranges
                  return gte(column, date);
                }
                return null;
              })
              .filter((condition): condition is NonNullable<typeof condition> => condition !== null);
            if (conditions.length > 0) {
              whereConditions.push(or(...conditions)!);
            }
          } else {
            // Single date filter - handle number (timestamp), timestamp string, or date string
            const date =
              typeof value === "number"
                ? new Date(value)
                : typeof value === "string" && /^\d+$/.test(value)
                  ? new Date(parseInt(value, 10))
                  : new Date(value);
            if (!isNaN(date.getTime())) {
              // For single date, filter for the entire day
              const startOfDay = new Date(date);
              startOfDay.setHours(0, 0, 0, 0);
              const endOfDay = new Date(date);
              endOfDay.setHours(23, 59, 59, 999);

              whereConditions.push(and(gte(column, startOfDay), lte(column, endOfDay))!);
            }
          }
        } else if (Array.isArray(value)) {
          // Handle array values (for select filters)
          const conditions = value.map((v) => ilike(column, `%${String(v)}%`));
          whereConditions.push(or(...conditions)!);
        } else {
          // Handle string/number values (for text filters) - convert to string first
          const stringValue = String(value);
          const searchTerms = stringValue.trim().split(/\s+/).filter(Boolean);
          if (searchTerms.length > 0) {
            if (searchTerms.length === 1) {
              // Single word search
              whereConditions.push(ilike(column, `%${searchTerms[0]}%`));
            } else {
              // Multi-word search - all words must be present (AND)
              const wordConditions = searchTerms.map((term: string) => ilike(column, `%${term}%`));
              whereConditions.push(and(...wordConditions)!);
            }
          }
        }
      });

      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Build queries properly with filters first, then pagination and sorting
      const baseQuery = db.select().from(schema.product);

      const productsQuery = whereClause ? baseQuery.where(whereClause) : baseQuery;

      const sortedQuery = orderBy.length > 0 ? productsQuery.orderBy(...orderBy) : productsQuery;

      // Execute queries in parallel
      const [products, totalCount] = await Promise.all([
        // Get paginated results
        sortedQuery.limit(input.limit).offset(offset),
        // Get total count of filtered results
        db.select({ count: count() }).from(schema.product).where(whereClause),
      ]);

      return {
        data: products,
        pageCount: Math.ceil(totalCount[0].count / input.limit),
      };
    }),
});

export type AppRouter = typeof appRouter;
