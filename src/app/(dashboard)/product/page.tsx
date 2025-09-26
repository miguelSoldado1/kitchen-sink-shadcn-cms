import { Suspense } from "react";
import Link from "next/link";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { ProductTable } from "@/components/product/product-table";
import { Button } from "@/components/ui/button";
import { checkReadPermission } from "@/server/auth-permissions";
import { Plus } from "lucide-react";

const TITLE = "Products";
const DESCRIPTION = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur gravida dignissim scelerisque.";

export default async function ProductPage() {
  await checkReadPermission("/sign-in");

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
      <Suspense>
        <ProductTable />
      </Suspense>
    </PageLayout>
  );
}
