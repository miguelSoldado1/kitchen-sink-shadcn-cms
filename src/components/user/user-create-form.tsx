"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import * as DialogCore from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/auth-client";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField } from "../ui/form";
import { FormItemWrapper } from "../ui/form-item-wrapper";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const DEFAULT_PASSWORD = "guestuser";

const createUserFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  role: z.enum(["admin", "write", "read"]),
});

export function UserCreateForm() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const form = useForm<z.infer<typeof createUserFormSchema>>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof createUserFormSchema>) {
    const { error } = await authClient.admin.createUser({ ...data, password: DEFAULT_PASSWORD });
    if (error) {
      return toast.error("Failed to create user", { description: error.message });
    }

    toast.success("User created successfully");
    utils.user.getTable.invalidate();
    setOpen(false);
    form.reset();
  }

  function onOpenChange(isOpen: boolean) {
    if (!isOpen) form.reset();
    setOpen(isOpen);
  }

  return (
    <DialogCore.Dialog open={open} onOpenChange={onOpenChange}>
      <DialogCore.DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          Create User
        </Button>
      </DialogCore.DialogTrigger>
      <DialogCore.DialogContent>
        <DialogCore.DialogHeader>
          <DialogCore.DialogTitle>Create User</DialogCore.DialogTitle>
          <DialogCore.DialogDescription>
            After creating the user they should change their password to something secure. The default password is{" "}
            <strong>{DEFAULT_PASSWORD}</strong>
          </DialogCore.DialogDescription>
        </DialogCore.DialogHeader>
        <Form {...form}>
          <form id="create-user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItemWrapper label="Name">
                  <Input {...field} />
                </FormItemWrapper>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItemWrapper label="Email">
                  <Input {...field} />
                </FormItemWrapper>
              )}
            />
            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItemWrapper label="Role">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="write">Write</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItemWrapper>
              )}
            />
          </form>
        </Form>
        <DialogCore.DialogFooter>
          <DialogCore.DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogCore.DialogClose>
          <Button type="submit" form="create-user-form" disabled={form.formState.isSubmitting}>
            Save changes
          </Button>
        </DialogCore.DialogFooter>
      </DialogCore.DialogContent>
    </DialogCore.Dialog>
  );
}
