import { headers } from "next/headers";
import { env } from "@/env";
import { auth } from "@/lib/auth/auth";
import { createUploadRouteHandler, route, UploadFileError } from "better-upload/server";
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
      multipleFiles: false,
      onBeforeUpload: async () => {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
          throw new UploadFileError("Not logged in!");
        }
      },
    }),
  },
};

export const { POST } = createUploadRouteHandler(router);
