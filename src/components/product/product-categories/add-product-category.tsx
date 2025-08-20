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
import { Form, FormField } from "@/components/ui/form";
import { FormItemWrapper } from "@/components/ui/form-item-wrapper";
import { MultiSelect } from "@/components/ui/multiselect";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const productCategoryFormSchema = z.object({
  categories: z.array(z.object({ value: z.string(), label: z.string() })).min(1),
});

interface AddProductCategoryProps {
  productId: number;
}

export function AddProductCategory({ productId }: AddProductCategoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const form = useForm<z.infer<typeof productCategoryFormSchema>>({
    resolver: zodResolver(productCategoryFormSchema),
    defaultValues: { categories: [] },
  });

  const query = trpc.category.getCursorCategory.useInfiniteQuery(
    { limit: 10, name: searchTerm },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const mutation = trpc.productCategory.createProductCategory.useMutation();

  async function onSubmit(data: z.infer<typeof productCategoryFormSchema>) {
    const categories = data.categories.map((category) => Number(category.value));

    const { error } = await tryCatch(mutation.mutateAsync({ productId, categories }));
    if (error) {
      return toast.error("Failed to add product category", { description: error.message });
    }

    toast.success("Product category added successfully");
    utils.productCategory.getTableProductCategories.invalidate({ productId });
    form.reset();
    setOpen(false);
  }

  const options = React.useMemo(() => {
    return query.data?.pages.flatMap((p) => p.data) ?? [];
  }, [query.data]);

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
          <form id="add-category-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItemWrapper label="Categories">
                  <MultiSelect
                    delay={300}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select categories"
                    onFetchMore={query.fetchNextPage}
                    hidePlaceholderWhenSelected={true}
                    options={options}
                    inputProps={{ onValueChange: (value: string) => setSearchTerm(value) }}
                    emptyIndicator={<p className="text-center text-sm">No results found</p>}
                    loadingIndicator={<p className="text-center text-sm">Loading...</p>}
                  />
                </FormItemWrapper>
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
