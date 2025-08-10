import { PageHeader, PageLayout } from "@/components/page-layout";
import { ProductCreateForm } from "@/components/product/product-create-form";

const TITLE = "Create Product";
const DESCRIPTION = "Add a new product to your inventory.";

export default function CreateProductPage() {
  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION} />
      <ProductCreateForm />
    </PageLayout>
  );
}
