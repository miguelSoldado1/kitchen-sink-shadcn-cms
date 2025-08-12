import Link from "next/link";
import { CategoryTable } from "@/components/category/category-table";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const TITLE = "Categories";
const DESCRIPTION = "Manage and view all your categories in one place.";

export default function CategoryPage() {
  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION}>
        <Button asChild>
          <Link href="/category/create">
            <Plus className="size-4" />
            Add Category
          </Link>
        </Button>
      </PageHeader>
      <CategoryTable />
    </PageLayout>
  );
}
