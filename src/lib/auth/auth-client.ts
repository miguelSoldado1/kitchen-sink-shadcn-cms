import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, roles } from "./permissions";

export const { signIn, signUp, signOut, useSession } = createAuthClient({
  plugins: [adminClient({ ac, roles })],
});
