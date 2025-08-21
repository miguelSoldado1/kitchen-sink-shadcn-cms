"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const productCategoryFormSchema = z.object({
  category: z.string(),
});

interface AddProductCategoryProps {
  productId: number;
  existingCategories: number[];
}

export function AddProductCategory({ productId, existingCategories }: AddProductCategoryProps) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const form = useForm<z.infer<typeof productCategoryFormSchema>>({
    resolver: zodResolver(productCategoryFormSchema),
    defaultValues: { category: "" },
  });

  const query = trpc.category.getSelectCategories.useQuery();

  const mutation = trpc.productCategory.createProductCategory.useMutation();

  async function onSubmit(data: z.infer<typeof productCategoryFormSchema>) {
    const { error } = await tryCatch(mutation.mutateAsync({ productId, categoryId: Number(data.category) }));
    if (error) {
      return toast.error("Failed to add product category", { description: error.message });
    }

    toast.success("Product category added successfully");
    utils.productCategory.getAllProductCategories.invalidate({ productId });
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>Add a new product category</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="add-category-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {query.data?.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                          disabled={existingCategories.includes(Number(option.value))}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={form.formState.isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="add-category-form" disabled={form.formState.isSubmitting}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
