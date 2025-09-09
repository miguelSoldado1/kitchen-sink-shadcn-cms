"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tryCatch } from "@/app/try-catch";
import { BasicInfoForm, basicInfoSchema } from "@/components/product/basic-info-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { RecordInfoForm } from "./record-info-form";
import type z from "zod";

export function ProductCreateForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: 0,
    },
  });

  const mutation = useMutation(trpc.product.create.mutationOptions());
  async function onSubmit(input: z.infer<typeof basicInfoSchema>) {
    const { data: id, error } = await tryCatch(mutation.mutateAsync(input));
    if (error) {
      return toast.error("Failed to create product", { description: error.message });
    }

    queryClient.invalidateQueries(trpc.product.getTable.queryFilter());
    toast.success("Product created successfully");
    router.push(`/product/edit/${id}`);
  }

  return (
    <section className="container space-y-6 rounded-xl border p-6">
      <Accordion type="multiple" className="w-full" defaultValue={["basic-info"]}>
        <AccordionItem value="record-info" className="mb-4 rounded-lg border">
          <AccordionTrigger className="px-4 py-3">Record Information</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <RecordInfoForm />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="basic-info" className="mb-4 rounded-lg border">
          <AccordionTrigger className="px-4 py-3">
            <div className="text-left">Basic Information</div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <BasicInfoForm form={form} onSubmit={onSubmit} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => router.push("/product")}>
          Cancel
        </Button>
        <Button type="submit" form="product-form" disabled={form.formState.isSubmitting}>
          Create Product
        </Button>
      </div>
    </section>
  );
}
