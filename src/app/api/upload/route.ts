import { env } from "@/env";
import { createUploadRouteHandler, route } from "better-upload/server";
import { backblaze } from "better-upload/server/helpers";
import type { Router } from "better-upload/server";

const client = backblaze({
  region: env.BACKBLAZE_REGION,
  applicationKeyId: env.BACKBLAZE_APPLICATION_KEY_ID,
  applicationKey: env.BACKBLAZE_APPLICATION_KEY,
});

const router: Router = {
  client: client,
  bucketName: env.BACKBLAZE_BUCKET_NAME,
  routes: {
    productMultimedia: route({
      fileTypes: ["image/*"],
      multipleFiles: true,
      maxFiles: 4,
    }),
  },
};

export const { POST } = createUploadRouteHandler(router);
