import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { auth } from "@/lib/auth/auth";

export default async function SignUpPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/product");
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
