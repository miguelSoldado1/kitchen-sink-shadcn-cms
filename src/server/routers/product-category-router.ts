import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { readProcedure, router, writeProcedure } from "../trpc";

const getAllProductCategoriesInput = z.object({ productId: z.number() });

async function getAllProductCategoriesHandler(input: z.infer<typeof getAllProductCategoriesInput>) {
  const categories = await db
    .select({
      id: schema.productCategory.id,
      name: schema.category.name,
      createdAt: schema.productCategory.createdAt,
      updatedAt: schema.productCategory.updatedAt,
    })
    .from(schema.category)
    .innerJoin(schema.productCategory, eq(schema.category.id, schema.productCategory.categoryId))
    .where(eq(schema.productCategory.productId, input.productId));

  return categories;
}

const createProductCategoryInput = z.object({
  productId: z.number(),
  categories: z.array(z.coerce.number()).min(1),
});

async function createProductCategoryHandler(input: z.infer<typeof createProductCategoryInput>) {
  try {
    const [existingProduct] = await db
      .select({ id: schema.product.id })
      .from(schema.product)
      .where(eq(schema.product.id, input.productId));

    if (!existingProduct) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Product with id ${input.productId} not found`,
      });
    }

    return db
      .insert(schema.productCategory)
      .values(input.categories.map((categoryId) => ({ productId: input.productId, categoryId })));
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create product category",
      cause: error,
    });
  }
}

const deleteProductCategorySchema = z.object({ id: z.number().positive() });

async function deleteProductCategoryHandler(input: z.infer<typeof deleteProductCategorySchema>) {
  try {
    const [existingProductCategory] = await db
      .select({ id: schema.productCategory.id })
      .from(schema.productCategory)
      .where(eq(schema.productCategory.id, input.id));

    if (!existingProductCategory) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Product category with id ${input.id} not found`,
      });
    }

    await db.delete(schema.productCategory).where(eq(schema.productCategory.id, input.id));
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete product category",
      cause: error,
    });
  }
}

export const productCategoryRouter = router({
  getAllProductCategories: readProcedure
    .input(getAllProductCategoriesInput)
    .query(({ input }) => getAllProductCategoriesHandler(input)),
  createProductCategory: writeProcedure
    .input(createProductCategoryInput)
    .mutation(({ input }) => createProductCategoryHandler(input)),
  deleteProductCategory: writeProcedure
    .input(deleteProductCategorySchema)
    .mutation(({ input }) => deleteProductCategoryHandler(input)),
});
