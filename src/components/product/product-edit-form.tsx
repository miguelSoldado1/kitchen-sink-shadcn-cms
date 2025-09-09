"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import { BasicInfoForm, basicInfoSchema } from "@/components/product/basic-info-form";
import { ProductCategoryTable } from "@/components/product/product-categories/product-category-table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ProductMultimedia } from "./product-multimedia/product-multimedia";
import { RecordInfoForm } from "./record-info-form";
import type z from "zod";

interface ProductEditFormProps {
  id: number;
}

export function ProductEditForm({ id }: ProductEditFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const query = useQuery(trpc.product.getFirst.queryOptions({ id }));

  useEffect(() => {
    if (query.isError) {
      router.replace("/product/create");
    }
  }, [query.isError, router]);

  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    values: {
      name: query.data?.name ?? "",
      description: query.data?.description ?? "",
      sku: query.data?.sku ?? "",
      price: query.data?.price ? Number(query.data.price) : 0,
    },
  });

  const mutation = useMutation(trpc.product.update.mutationOptions());

  async function onSubmit(input: z.infer<typeof basicInfoSchema>) {
    const { error } = await tryCatch(mutation.mutateAsync({ ...input, id }));
    if (error) {
      return toast.error("Failed to update product", { description: error.message });
    }

    router.push("/product");
    toast.success("Product updated successfully");
    await queryClient.invalidateQueries(trpc.product.getTable.queryFilter());
  }

  return (
    <section className="container space-y-6 rounded-xl border p-6">
      <Accordion type="multiple" className="w-full" defaultValue={["basic-info", "product-multimedia"]}>
        <AccordionItem value="record-info" className="mb-4 rounded-lg border">
          <AccordionTrigger className="px-4 py-3">Record Information</AccordionTrigger>
          <AccordionContent className="my-1 px-4 pb-4">
            <RecordInfoForm data={query.data} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="basic-info" className="mb-4 rounded-lg border">
          <AccordionTrigger className="px-4 py-3">Basic Information</AccordionTrigger>
          <AccordionContent className="my-1 px-4 pb-4">
            <BasicInfoForm form={form} onSubmit={onSubmit} disabled={query.isPending} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="product-multimedia" className="mb-4 rounded-lg border">
          <AccordionTrigger className="px-4 py-3">Product Multimedia</AccordionTrigger>
          <AccordionContent className="my-1 px-4 pb-4">
            <ProductMultimedia productId={id} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="product-categories" className="mb-4 rounded-lg border">
          <AccordionTrigger className="px-4 py-3">Product Categories</AccordionTrigger>
          <AccordionContent className="my-1 px-4 pb-4">
            <ProductCategoryTable productId={id} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => router.push("/product")}>
          Cancel
        </Button>
        <Button type="submit" form="product-form" disabled={form.formState.isSubmitting}>
          Update Product
        </Button>
      </div>
    </section>
  );
}
