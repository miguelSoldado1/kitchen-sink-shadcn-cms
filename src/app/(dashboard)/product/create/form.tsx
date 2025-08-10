"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const basicInfoSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  sku: z.string().min(2).max(10),
  price: z.number().min(0.01).multipleOf(0.01),
});

const basicInfoDefaultValues: z.infer<typeof basicInfoSchema> = {
  name: "",
  description: "",
  sku: "",
  price: 0,
};

export function ProductCreateForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: basicInfoDefaultValues,
  });

  const mutation = trpc.createProduct.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully");
      router.push("/product");
    },
    onError: (error) => {
      toast.error("Failed to create product", { description: error.message });
    },
  });

  function onSubmit(data: z.infer<typeof basicInfoSchema>) {
    return mutation.mutateAsync(data);
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
                <Input disabled />
              </div>
              <div className="grid gap-2">
                <Label>Created At</Label>
                <Input disabled />
              </div>
              <div className="grid gap-2">
                <Label>Updated At</Label>
                <Input disabled />
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="basic-info" className="mb-4 rounded-lg border">
          <AccordionTrigger className="px-4 py-3">
            <div className="text-left">Basic Information</div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Form {...form}>
              <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="submit" form="product-form">
          Create Product
        </Button>
      </div>
    </section>
  );
}
