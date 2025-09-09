import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import { db } from "../database/drizzle";
import * as schema from "./auth-schema";
import { ac, roles } from "./permissions";

export const auth = betterAuth({
  plugins: [nextCookies(), adminPlugin({ ac, roles, defaultRole: "read", adminRoles: ["admin"] })],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
});
