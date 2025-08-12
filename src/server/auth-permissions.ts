import "server-only";

import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { auth } from "@/lib/auth/auth";

export async function checkAdminPermission(redirectUrl: string) {
  return checkPermission({ project: ["admin"] }, redirectUrl);
}

export async function checkWritePermission(redirectUrl: string) {
  return checkPermission({ project: ["write"] }, redirectUrl);
}

export async function checkReadPermission(redirectUrl: string) {
  return checkPermission({ project: ["read"] }, redirectUrl);
}

async function checkPermission(permission: Record<string, string[]>, redirectUrl: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    return redirect("/sign-in", RedirectType.replace);
  }

  const { error, success } = await auth.api.userHasPermission({
    body: { permission: permission, userId: session.user.id },
  });

  if (error || !success) {
    return redirect(redirectUrl, RedirectType.replace);
  }
}
