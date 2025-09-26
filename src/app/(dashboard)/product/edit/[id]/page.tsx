import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { DeleteProductButton } from "@/components/product/delete-product-button";
import { ProductEditForm } from "@/components/product/product-edit-form";
import { PublishProductButton } from "@/components/product/publish-product-button";
import { checkWritePermission } from "@/server/auth-permissions";
import z from "zod";

const TITLE = "Edit Product";
const DESCRIPTION = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur gravida dignissim scelerisque.";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const idSchema = z.coerce.number().min(1);

export default async function EditProductPage({ params }: EditProductPageProps) {
  await checkWritePermission("/product");

  const id = idSchema.safeParse((await params).id);
  if (!id.success) {
    redirect("/product/create");
  }

  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION} backHref="/product">
        <PublishProductButton id={id.data} />
        <DeleteProductButton id={id.data} />
      </PageHeader>
      <Suspense>
        <ProductEditForm id={id.data} />
      </Suspense>
    </PageLayout>
  );
}
