import { Suspense } from "react";
import { CategoryCreateForm } from "@/components/category/category-create-form";
import { CategoryTable } from "@/components/category/category-table";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { checkReadPermission } from "@/server/auth-permissions";

const TITLE = "Categories";
const DESCRIPTION = "Manage and view all your categories in one place.";

export default async function CategoryPage() {
  await checkReadPermission("/category");

  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION}>
        <CategoryCreateForm />
      </PageHeader>
      <Suspense>
        <CategoryTable />
      </Suspense>
    </PageLayout>
  );
}
