import { Suspense } from "react";
import { CategoryCreateForm } from "@/components/category/category-create-form";
import { CategoryTable } from "@/components/category/category-table";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { checkReadPermission } from "@/server/auth-permissions";

const TITLE = "Categories";
const DESCRIPTION = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur gravida dignissim scelerisque.";

export default async function CategoryPage() {
  await checkReadPermission("/sign-in");

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
