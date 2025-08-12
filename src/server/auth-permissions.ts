import "server-only";

import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { auth } from "@/lib/auth/auth";

export async function checkAdminPermission(redirectUrl: string) {
  return checkRolePermission(["admin"], redirectUrl);
}

export async function checkWritePermission(redirectUrl: string) {
  return checkRolePermission(["admin", "write"], redirectUrl);
}

export async function checkReadPermission(redirectUrl: string) {
  return checkRolePermission(["admin", "write", "read"], redirectUrl);
}

async function checkRolePermission(allowedRoles: string[], redirectUrl: string) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    return redirect("/sign-in", RedirectType.replace);
  }

  const userRoles = session.user.role?.split(",") || [];
  const hasPermission = userRoles.some((role) => allowedRoles.includes(role));

  if (!hasPermission) {
    return redirect(redirectUrl, RedirectType.replace);
  }
}
