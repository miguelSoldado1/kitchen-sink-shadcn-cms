import { router } from "../trpc";
import { productRouter } from "./product-router";

export const appRouter = router({
  product: productRouter,
});

export type AppRouter = typeof appRouter;
