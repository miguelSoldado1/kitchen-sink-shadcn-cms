import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { TRPCError } from "@trpc/server";
import { asc, desc, eq } from "drizzle-orm";
import z from "zod";
import { readProcedure, router, writeProcedure } from "../trpc";

const getProductMultimediaInput = z.object({ productId: z.number() });

async function getProductMultimediaHandler(input: z.infer<typeof getProductMultimediaInput>) {
  return db.query.productMultimedia.findMany({
    where: eq(schema.productMultimedia.productId, input.productId),
    orderBy: [asc(schema.productMultimedia.order)],
  });
}

const createProductMultimediaInput = z.object({
  multimedia: z.array(z.object({ objectKey: z.string() })),
  productId: z.number(),
});

async function createProductMultimediaHandler(input: z.infer<typeof createProductMultimediaInput>) {
  return db.transaction(async (tx) => {
    const lastImage = await tx.query.productMultimedia.findFirst({
      where: eq(schema.productMultimedia.productId, input.productId),
      orderBy: [desc(schema.productMultimedia.order)],
      columns: { order: true },
    });

    const nextOrder = lastImage ? lastImage.order + 1 : 1;
    return tx.insert(schema.productMultimedia).values(
      input.multimedia.map((media, index) => ({
        url: `https://f003.backblazeb2.com/file/${process.env.BACKBLAZE_BUCKET_NAME}/${media.objectKey}`,
        productId: input.productId,
        order: nextOrder + index,
      })),
    );
  });
}

const deleteProductMultimediaInput = z.object({
  id: z.number(),
});

async function deleteProductMultimediaHandler(input: z.infer<typeof deleteProductMultimediaInput>) {
  try {
    const existingImage = await db.query.productMultimedia.findFirst({
      where: eq(schema.productMultimedia.id, input.id),
    });

    if (!existingImage) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Image with id ${input.id} not found`,
      });
    }

    await db.delete(schema.productMultimedia).where(eq(schema.productMultimedia.id, input.id));
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update category",
      cause: error,
    });
  }
}

export const productMultimediaRouter = router({
  getProductMultimedia: readProcedure
    .input(getProductMultimediaInput)
    .query(({ input }) => getProductMultimediaHandler(input)),
  createProductMultimedia: writeProcedure
    .input(createProductMultimediaInput)
    .mutation(({ input }) => createProductMultimediaHandler(input)),
  deleteProductMultimedia: writeProcedure
    .input(deleteProductMultimediaInput)
    .mutation(({ input }) => deleteProductMultimediaHandler(input)),
});
