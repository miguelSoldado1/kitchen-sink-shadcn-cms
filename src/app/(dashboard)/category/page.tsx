import { CategoryCreateForm } from "@/components/category/category-create-form";
import { CategoryTable } from "@/components/category/category-table";
import { PageHeader, PageLayout } from "@/components/page-layout";

const TITLE = "Categories";
const DESCRIPTION = "Manage and view all your categories in one place.";

export default function CategoryPage() {
  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION}>
        <CategoryCreateForm />
      </PageHeader>
      <CategoryTable />
    </PageLayout>
  );
}
