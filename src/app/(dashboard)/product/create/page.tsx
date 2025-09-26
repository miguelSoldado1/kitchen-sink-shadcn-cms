import { Suspense } from "react";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { ProductCreateForm } from "@/components/product/product-create-form";
import { checkWritePermission } from "@/server/auth-permissions";

const TITLE = "Create Product";
const DESCRIPTION = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur gravida dignissim scelerisque.";

export default async function CreateProductPage() {
  await checkWritePermission("/product");

  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION} backHref="/product" />
      <Suspense>
        <ProductCreateForm />
      </Suspense>
    </PageLayout>
  );
}
