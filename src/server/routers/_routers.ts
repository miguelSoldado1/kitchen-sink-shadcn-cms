import { router } from "../trpc";
import { categoryRouter } from "./category-router";
import { productRouter } from "./product-router";

export const appRouter = router({
  product: productRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
