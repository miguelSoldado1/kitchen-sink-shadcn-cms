import { router } from "../trpc";
import { categoryRouter } from "./category-router";
import { productCategoryRouter } from "./product-category-router";
import { productMultimediaRouter } from "./product-multimedia-router";
import { productRouter } from "./product-router";
import { userRouter } from "./user-router";

export const appRouter = router({
  product: productRouter,
  category: categoryRouter,
  productCategory: productCategoryRouter,
  productMultimedia: productMultimediaRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
