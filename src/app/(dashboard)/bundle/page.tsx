import { Suspense } from "react";
import { ProductBundleTable } from "@/components/bundle/product-bundle-table";
import { PageHeader, PageLayout } from "@/components/page-layout";
import { checkReadPermission } from "@/server/auth-permissions";

const TITLE = "Bundles";
const DESCRIPTION = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur gravida dignissim scelerisque.";

export default async function BundlePage() {
  await checkReadPermission("/sign-in");

  return (
    <PageLayout>
      <PageHeader title={TITLE} description={DESCRIPTION}></PageHeader>
      <Suspense>
        <ProductBundleTable />
      </Suspense>
    </PageLayout>
  );
}
