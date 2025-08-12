import { PageHeader, PageLayout } from "@/components/page-layout";
import { ProductCreateForm } from "@/components/product/product-create-form";
import { checkWritePermission } from "@/server/auth-permissions";

const TITLE = "Create Product";
const DESCRIPTION = "Add a new product to your inventory.";

export default async function CreateProductPage() {
  await checkWritePermission("/product");

  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION} backHref="/product" />
      <ProductCreateForm />
    </PageLayout>
  );
}
