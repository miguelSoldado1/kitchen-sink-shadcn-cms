import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BACBKLAZE_APPLICATION_KEY: z.string(),
    BACBKLAZE_APPLICATION_KEY_ID: z.string(),
    BACKBLAZE_REGION: z.string(),
    BACKBLAZE_BUCKET_NAME: z.string(),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BACBKLAZE_APPLICATION_KEY: process.env.BACBKLAZE_APPLICATION_KEY,
    BACBKLAZE_APPLICATION_KEY_ID: process.env.BACBKLAZE_APPLICATION_KEY_ID,
    BACKBLAZE_REGION: process.env.BACKBLAZE_REGION,
    BACKBLAZE_BUCKET_NAME: process.env.BACKBLAZE_BUCKET_NAME,
  },
});
