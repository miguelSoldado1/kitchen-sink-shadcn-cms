"use client";

import React from "react";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormField } from "../ui/form";
import { FormItemWrapper } from "../ui/form-item-wrapper";
import { PasswordInput } from "../ui/password-input";

export function ProfileEditPage() {
  const { data } = authClient.useSession();
  if (!data?.user) return null;

  return (
    <section className="container space-y-6 rounded-xl border p-6">
      <UpdateNameForm defaultName={data.user.name} />
      <UpdatePasswordForm />
    </section>
  );
}

interface UpdateNameFormProps {
  defaultName: string;
}

const updateNameFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
});

function UpdateNameForm({ defaultName }: UpdateNameFormProps) {
  const form = useForm<z.infer<typeof updateNameFormSchema>>({
    defaultValues: { name: defaultName },
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
    <div className="space-y-4 rounded-lg border p-3">
      <h3 className="text-sm font-medium">Update Name</h3>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdateName)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItemWrapper label="Name">
                <Input {...field} placeholder="Enter your name" />
              </FormItemWrapper>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Update Name
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

const updatePasswordFormSchema = z.object({
  currentPassword: z.string().min(6).max(100),
  newPassword: z.string().min(6).max(100),
  confirmPassword: z.string().min(6).max(100),
});

function UpdatePasswordForm() {
  const form = useForm<z.infer<typeof updatePasswordFormSchema>>({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
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

    toast.success("Password updated successfully");
    form.reset();
  }

  return (
    <div className="space-y-4 rounded-lg border p-3">
      <h3 className="text-sm font-medium">Update Password</h3>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleUpdatePassword)}>
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItemWrapper label="Current Password">
                <PasswordInput {...field} placeholder="***********" />
              </FormItemWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItemWrapper label="New Password">
                <PasswordInput {...field} placeholder="***********" />
              </FormItemWrapper>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItemWrapper label="Confirm New Password">
                <PasswordInput {...field} placeholder="***********" />
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
    </div>
  );
}
