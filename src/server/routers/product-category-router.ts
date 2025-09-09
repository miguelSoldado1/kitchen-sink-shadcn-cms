import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { readProcedure, router, writeProcedure } from "../trpc";

const getAllProductCategoriesInput = z.object({ productId: z.number() });

async function getAllHandler(input: z.infer<typeof getAllProductCategoriesInput>) {
  const categories = await db
    .select({
      id: schema.productCategory.id,
      categoryId: schema.category.id,
      name: schema.category.name,
      createdAt: schema.productCategory.createdAt,
      updatedAt: schema.productCategory.updatedAt,
    })
    .from(schema.productCategory)
    .innerJoin(schema.category, eq(schema.category.id, schema.productCategory.categoryId))
    .where(eq(schema.productCategory.productId, input.productId));

  return categories;
}

const createProductCategoryInput = z.object({
  productId: z.coerce.number(),
  categoryId: z.coerce.number(),
});

async function createHandler(input: z.infer<typeof createProductCategoryInput>) {
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

    return db.insert(schema.productCategory).values({ productId: input.productId, categoryId: input.categoryId });
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

async function deleteHandler(input: z.infer<typeof deleteProductCategorySchema>) {
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
  getAll: readProcedure.input(getAllProductCategoriesInput).query(({ input }) => getAllHandler(input)),
  create: writeProcedure.input(createProductCategoryInput).mutation(({ input }) => createHandler(input)),
  delete: writeProcedure.input(deleteProductCategorySchema).mutation(({ input }) => deleteHandler(input)),
});
