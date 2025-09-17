"use client";

import { toast } from "sonner";
import * as DialogCore from "@/components/ui/dialog";
import { useCategoryForm } from "@/hooks/use-category-form";
import { trpc } from "@/lib/trpc/client";
import { tryCatch } from "@/try-catch";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import { FormItemWrapper } from "../ui/form-item-wrapper";
import { Input } from "../ui/input";
import type { CategoryFormType } from "@/hooks/use-category-form";

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: number;
}

export function EditCategoryDialog({ open, onOpenChange, categoryId }: EditCategoryDialogProps) {
  const mutation = trpc.category.update.useMutation();
  const query = trpc.category.getFirst.useQuery({ id: categoryId });
  const form = useCategoryForm({ values: { name: query.data?.name ?? "" } });
  const utils = trpc.useUtils();

  async function onSubmit(data: CategoryFormType) {
    const { error } = await tryCatch(mutation.mutateAsync({ id: categoryId, ...data }));
    if (error) {
      return toast.error("Failed to update category", { description: error.message });
    }

    toast.success("Category updated successfully");
    utils.category.getTable.invalidate();
    onOpenChange(false);
  }

  return (
    <DialogCore.Dialog open={open} onOpenChange={onOpenChange}>
      <DialogCore.DialogContent>
        <DialogCore.DialogHeader>
          <DialogCore.DialogTitle>Edit Category</DialogCore.DialogTitle>
          <DialogCore.DialogDescription>Make changes to your category.</DialogCore.DialogDescription>
        </DialogCore.DialogHeader>
        <Form {...form}>
          <form id="edit-category-form" onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button type="submit" form="edit-category-form" disabled={form.formState.isSubmitting || query.isPending}>
            Save changes
          </Button>
        </DialogCore.DialogFooter>
      </DialogCore.DialogContent>
    </DialogCore.Dialog>
  );
}
