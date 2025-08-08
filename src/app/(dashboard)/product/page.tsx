import { loadSearchParams } from "./search-params";
import { ProductTable } from "./table";
import type { SearchParams } from "nuqs/server";

interface ProductPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
  const { page, perPage } = await loadSearchParams(searchParams);

  return <ProductTable page={page} perPage={perPage} />;
}
