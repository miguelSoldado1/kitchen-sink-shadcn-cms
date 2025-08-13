"use client";

import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import * as DialogCore from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const editCategorySchema = z.object({
  name: z.string().min(2).max(100),
});

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: number;
}

export function EditCategoryDialog({ open, onOpenChange, categoryId }: EditCategoryDialogProps) {
  const utils = trpc.useUtils();
  const query = trpc.category.getCategory.useQuery({ id: categoryId });
  const form = useForm<z.infer<typeof editCategorySchema>>({
    resolver: zodResolver(editCategorySchema),
    values: { name: query.data?.name ?? "" },
  });

  const mutation = trpc.category.updateCategory.useMutation();
  async function onSubmit(data: z.infer<typeof editCategorySchema>) {
    const { error } = await tryCatch(mutation.mutateAsync({ id: categoryId, ...data }));
    if (error) {
      return toast.error("Failed to update category", { description: error.message });
    }

    toast.success("Category updated successfully");
    utils.category.getTableCategories.invalidate();
    onOpenChange(false);
  }

  return (
    <DialogCore.Dialog open={open} onOpenChange={onOpenChange}>
      <DialogCore.DialogContent>
        <DialogCore.DialogTitle>Edit Category</DialogCore.DialogTitle>
        <DialogCore.DialogDescription>Make changes to your category.</DialogCore.DialogDescription>
        <Form {...form}>
          <form id="edit-category-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogCore.DialogFooter>
          <DialogCore.DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogCore.DialogClose>
          <Button type="submit" form="edit-category-form" disabled={mutation.isPending || query.isPending}>
            Save changes
          </Button>
        </DialogCore.DialogFooter>
      </DialogCore.DialogContent>
    </DialogCore.Dialog>
  );
}
