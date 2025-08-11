import { productRouter } from "./product-router";
import { router } from "./trpc";

export const appRouter = router({
  product: productRouter,
});

export type AppRouter = typeof appRouter;
