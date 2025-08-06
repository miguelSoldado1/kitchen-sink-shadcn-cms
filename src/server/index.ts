import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { count } from "drizzle-orm";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    return [10, 20, 30];
  }),
  getTotalUsers: publicProcedure.query(async () => {
    const totalUsers = await db.select({ count: count() }).from(schema.user);
    return totalUsers;
  }),
});

export type AppRouter = typeof appRouter;
