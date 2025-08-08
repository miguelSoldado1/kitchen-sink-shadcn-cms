import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { count, gte } from "drizzle-orm";
import z from "zod";
import { publicProcedure, router } from "./trpc";

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
    .input(z.object({ page: z.number().min(1).default(1), limit: z.number().min(1).max(100).default(10) }))
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;

      const [products, totalCount] = await Promise.all([
        db.select().from(schema.product).limit(input.limit).offset(offset),
        db.select({ count: count() }).from(schema.product),
      ]);

      return {
        products: products,
        pageCount: Math.ceil(totalCount[0].count / input.limit),
      };
    }),
});

export type AppRouter = typeof appRouter;
