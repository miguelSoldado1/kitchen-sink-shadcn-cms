"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRoundIcon, TrashIcon, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormField } from "../ui/form";
import { FormItemWrapper } from "../ui/form-item-wrapper";
import { PasswordInput } from "../ui/password-input";

export function ProfileEditPage() {
  return (
    <section className="container space-y-6 rounded-xl border p-6">
      <UpdateNameForm />
      <UpdatePasswordForm />
      <DeleteAccountForm />
    </section>
  );
}

const updateNameFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
});

function UpdateNameForm() {
  const { data } = authClient.useSession();
  const form = useForm<z.infer<typeof updateNameFormSchema>>({
    values: { name: data?.user.name ?? "" },
    resolver: zodResolver(updateNameFormSchema),
  });

  async function handleUpdateName(data: z.infer<typeof updateNameFormSchema>) {
    const { error } = await tryCatch(authClient.updateUser({ name: data.name }));
    if (error) {
      return toast.error("Failed to update user", { description: error.message });
    }

    toast.success("User updated successfully!");
  }

  return (
    <Card className="bg-background w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="size-5" />
          Update Name
        </CardTitle>
        <CardDescription>Change your display name that appears on your profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdateName)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItemWrapper label="Name">
                  <Input {...field} placeholder="Enter your name" disabled={!data?.user} />
                </FormItemWrapper>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting || !data?.user}>
                Update Name
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const updatePasswordFormSchema = z.object({
  currentPassword: z.string().min(6).max(100),
  newPassword: z.string().min(6).max(100),
  confirmPassword: z.string().min(6).max(100),
});

function UpdatePasswordForm() {
  const form = useForm<z.infer<typeof updatePasswordFormSchema>>({
    resolver: zodResolver(updatePasswordFormSchema),
  });

  async function handleUpdatePassword(data: z.infer<typeof updatePasswordFormSchema>) {
    if (data.newPassword !== data.confirmPassword) {
      return form.setError("confirmPassword", { message: "New passwords do not match" });
    }

    const { error } = await tryCatch(authClient.changePassword({ ...data, revokeOtherSessions: true }));
    if (error) {
      return toast.error("Failed to update password", { description: error.message });
    }

    toast.success("Password updated successfully!");
    form.reset();
  }

  return (
    <Card className="bg-background w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRoundIcon className="size-5" />
          Update Password
        </CardTitle>
        <CardDescription>
          Change your password to keep your account secure. Other sessions will be logged out.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdatePassword)}>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItemWrapper label="Current Password">
                  <PasswordInput {...field} placeholder="Enter current password" />
                </FormItemWrapper>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItemWrapper label="New Password">
                  <PasswordInput {...field} placeholder="Enter new password" />
                </FormItemWrapper>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItemWrapper label="Confirm New Password">
                  <PasswordInput {...field} placeholder="Confirm new password" />
                </FormItemWrapper>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Update Password
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function DeleteAccountForm() {
  const router = useRouter();

  async function handleDeleteAccount() {
    const { error } = await tryCatch(authClient.deleteUser());
    if (error) {
      return toast.error("Failed to delete account", { description: error.message });
    }

    toast.success("Account deleted successfully!");
    router.push("/sign-in");
  }

  return (
    <Card className="bg-background border-destructive w-full">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <TrashIcon className="size-5" />
          Delete Account
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from
                our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                Yes, delete my account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
