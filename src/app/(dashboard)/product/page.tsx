import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductTable } from "./table";

export default function ProductPage() {
  return (
    <main className="flex-1 space-y-4 p-4 pt-6 md:px-6 md:py-8">
      <header className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage and view all your products in one place.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/product/create">
              <Plus className="mr-2 size-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </header>
      <section aria-label="Product data table">
        <ProductTable />
      </section>
    </main>
  );
}
