import { router } from "../trpc";
import { categoryRouter } from "./category-router";
import { productCategoryRouter } from "./product-category-router";
import { productRouter } from "./product-router";

export const appRouter = router({
  product: productRouter,
  category: categoryRouter,
  productCategory: productCategoryRouter,
});

export type AppRouter = typeof appRouter;
