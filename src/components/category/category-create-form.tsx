"use client";

import { useState } from "react";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import * as DialogCore from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import { FormItemWrapper } from "../ui/form-item-wrapper";
import { Input } from "../ui/input";

const createCategoryForm = z.object({
  name: z.string().min(2).max(100),
});

export function CategoryCreateForm() {
  const utils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createCategoryForm>>({
    resolver: zodResolver(createCategoryForm),
    defaultValues: { name: "" },
  });

  const mutation = trpc.category.createCategory.useMutation();
  async function onSubmit(data: z.infer<typeof createCategoryForm>) {
    const { error } = await tryCatch(mutation.mutateAsync(data));
    if (error) {
      return toast.error("Failed to create category", { description: error.message });
    }

    toast.success("Category created successfully");
    utils.category.getTableCategories.invalidate();
    setOpen(false);
  }

  return (
    <DialogCore.Dialog open={open} onOpenChange={setOpen}>
      <DialogCore.DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          Add Category
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
