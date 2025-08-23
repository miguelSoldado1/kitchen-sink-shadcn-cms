import { db } from "@/lib/database/drizzle";
import * as schema from "@/lib/database/schema";
import { asc, desc, eq } from "drizzle-orm";
import z from "zod";
import { readProcedure, router } from "../trpc";

const getProductMultimediaInput = z.object({ productId: z.number() });

async function getProductMultimediaHandler(input: z.infer<typeof getProductMultimediaInput>) {
  return db.query.productMultimedia.findMany({
    where: eq(schema.productMultimedia.productId, input.productId),
    orderBy: [asc(schema.productMultimedia.order)],
  });
}

const createProductMultimediaInput = z.object({
  productId: z.number(),
  multimedia: z.array(
    z.object({
      objectKey: z.string(),
    }),
  ),
});

async function createProductMultimediaHandler(input: z.infer<typeof createProductMultimediaInput>) {
  return db.transaction(async (tx) => {
    const lastImage = await tx.query.productMultimedia.findFirst({
      where: eq(schema.productMultimedia.productId, input.productId),
      orderBy: [desc(schema.productMultimedia.order)],
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

export const productMultimediaRouter = router({
  getProductMultimedia: readProcedure
    .input(getProductMultimediaInput)
    .query(({ input }) => getProductMultimediaHandler(input)),
  createProductMultimedia: readProcedure
    .input(createProductMultimediaInput)
    .mutation(({ input }) => createProductMultimediaHandler(input)),
});
