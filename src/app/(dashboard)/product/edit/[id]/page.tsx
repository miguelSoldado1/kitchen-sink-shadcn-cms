import { redirect } from "next/navigation";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { DeleteProductButton } from "@/components/product/delete-product-button";
import { ProductEditForm } from "@/components/product/product-edit-form";
import z from "zod";

const TITLE = "Edit Product";
const DESCRIPTION = "Edit an existing product in your inventory.";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const idSchema = z.coerce.number().min(1);

export default async function EditProductPage({ params }: EditProductPageProps) {
  const id = idSchema.safeParse((await params).id);
  if (!id.success) {
    redirect("/product/create");
  }

  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION} backHref="/product">
        <DeleteProductButton id={id.data} />
      </PageHeader>
      <ProductEditForm id={id.data} />
    </PageLayout>
  );
}
