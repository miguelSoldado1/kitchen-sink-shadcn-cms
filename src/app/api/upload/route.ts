import { headers } from "next/headers";
import { env } from "@/env";
import { auth } from "@/lib/auth/auth";
import { productMultimediaRouter } from "@/server/routers/product-multimedia-router";
import { createUploadRouteHandler, route } from "better-upload/server";
import { backblaze } from "better-upload/server/helpers";
import z from "zod";
import type { Router } from "better-upload/server";

const client = backblaze({
  region: env.BACKBLAZE_REGION,
  applicationKeyId: env.BACBKLAZE_APPLICATION_KEY_ID,
  applicationKey: env.BACBKLAZE_APPLICATION_KEY,
});

const router: Router = {
  client: client,
  bucketName: env.BACKBLAZE_BUCKET_NAME,
  routes: {
    productMultimedia: route({
      fileTypes: ["image/*"],
      multipleFiles: true,
      maxFiles: 4,
      clientMetadataSchema: z.object({
        productId: z.number(),
      }),
      onAfterSignedUrl: async ({ files, clientMetadata }) => {
        const session = await auth.api.getSession({ headers: await headers() });

        const caller = productMultimediaRouter.createCaller({ user: session?.user });
        caller.createProductMultimedia({
          multimedia: files.map((file) => ({ objectKey: file.objectKey })),
          productId: clientMetadata.productId,
        });
      },
    }),
  },
};

export const { POST } = createUploadRouteHandler(router);
