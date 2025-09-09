"use client";

import { useState } from "react";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import * as DialogCore from "@/components/ui/dialog";
import { useCategoryForm } from "@/hooks/use-category-form";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import { FormItemWrapper } from "../ui/form-item-wrapper";
import { Input } from "../ui/input";
import type { CategoryFormType } from "@/hooks/use-category-form";

export function CategoryCreateForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const mutation = useMutation(trpc.category.create.mutationOptions());
  const form = useCategoryForm({ defaultValues: { name: "" } });
  const [open, setOpen] = useState(false);

  async function onSubmit(data: CategoryFormType) {
    const { error } = await tryCatch(mutation.mutateAsync(data));
    if (error) {
      return toast.error("Failed to create category", { description: error.message });
    }

    queryClient.invalidateQueries(trpc.category.getTable.queryFilter());
    toast.success("Category created successfully");
    setOpen(false);
    form.reset();
  }

  return (
    <DialogCore.Dialog open={open} onOpenChange={setOpen}>
      <DialogCore.DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          Create Category
        </Button>
      </DialogCore.DialogTrigger>
      <DialogCore.DialogContent>
        <DialogCore.DialogHeader>
          <DialogCore.DialogTitle>Create Category</DialogCore.DialogTitle>
          <DialogCore.DialogDescription>Create a new category.</DialogCore.DialogDescription>
        </DialogCore.DialogHeader>
        <Form {...form}>
          <form id="create-category-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItemWrapper label="Name">
                  <Input {...field} />
                </FormItemWrapper>
              )}
            />
          </form>
        </Form>
        <DialogCore.DialogFooter>
          <DialogCore.DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogCore.DialogClose>
          <Button type="submit" form="create-category-form" disabled={form.formState.isSubmitting}>
            Save changes
          </Button>
        </DialogCore.DialogFooter>
      </DialogCore.DialogContent>
    </DialogCore.Dialog>
  );
}
