"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import { BasicInfoForm, basicInfoSchema } from "@/components/product/basic-info-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";

interface ProductEditFormProps {
  id: number;
}

export function ProductEditForm({ id }: ProductEditFormProps) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const query = trpc.product.getProduct.useQuery({ id: id });
  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    values: {
      name: query.data?.name ?? "",
      description: query.data?.description ?? "",
      sku: query.data?.sku ?? "",
      price: query.data?.price ? Number(query.data.price) : 0,
    },
  });

  const mutation = trpc.product.updateProduct.useMutation();
  async function onSubmit(input: z.infer<typeof basicInfoSchema>) {
    const { error } = await tryCatch(mutation.mutateAsync({ ...input, id }));
    if (error) {
      return toast.error("Failed to update product", { description: error.message });
    }

    toast.success("Product updated successfully");
    utils.product.getTableProducts.invalidate();
    router.push("/product");
  }

  return (
    <section className="container space-y-6 rounded-xl border p-6">
      <Accordion type="multiple" className="w-full" defaultValue={["basic-info"]}>
        <AccordionItem value="record-info" className="mb-4 rounded-lg border">
          <AccordionTrigger className="px-4 py-3">Record Information</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <form className="space-y-4">
              <div className="grid gap-2">
                <Label>Id</Label>
                <Input disabled value={query.data?.id} />
              </div>
              <div className="grid gap-2">
                <Label>Created At</Label>
                <Input disabled value={query.data?.createdAt ? new Date(query.data.createdAt).toLocaleString() : ""} />
              </div>
              <div className="grid gap-2">
                <Label>Updated At</Label>
                <Input disabled value={query.data?.updatedAt ? new Date(query.data.updatedAt).toLocaleString() : ""} />
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="basic-info" className="mb-4 rounded-lg border">
          <AccordionTrigger className="px-4 py-3">
            <div className="text-left">Basic Information</div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <BasicInfoForm form={form} onSubmit={onSubmit} disabled={query.isPending} />
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
