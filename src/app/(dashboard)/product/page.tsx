import Link from "next/link";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductTable } from "./product-table";

const TITLE = "Products";
const DESCRIPTION = "Manage and view all your products in one place.";

export default function ProductPage() {
  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION}>
        <Button asChild>
          <Link href="/product/create">
            <Plus className="size-4" />
            Add Product
          </Link>
        </Button>
      </PageHeader>
      <section>
        <ProductTable />
      </section>
    </PageLayout>
  );
}
