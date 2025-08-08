import { createUploadRouteHandler, route } from "better-upload/server";
import { backblaze } from "better-upload/server/helpers";
import type { Router } from "better-upload/server";

const client = backblaze({
  region: "eu-central-003",
  applicationKeyId: "6369639dcdfc",
  applicationKey: "0036526d9633543c1eba97d32c4b2cd77b5c7165dd",
});

const router: Router = {
  client: client,
  bucketName: "test-audio-files",
  routes: {
    demo: route({
      fileTypes: ["image/*"],
      multipleFiles: true,
      maxFiles: 4,
      onAfterSignedUrl: async ({ files }) => {
        // const objectKeys = files.map((file) => file.objectKey);
        console.log("Files uploaded:", files);
      },
    }),
  },
};

export const { POST } = createUploadRouteHandler(router);
