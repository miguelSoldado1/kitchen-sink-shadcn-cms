import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { Url } from "next/dist/shared/lib/router/router";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return <main className="flex-1 space-y-4 p-4 pt-6 md:px-6 md:py-8">{children}</main>;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  backHref?: Url;
}

export function PageHeader({ title, description, children, backHref }: PageHeaderProps) {
  return (
    <section className="flex items-center justify-between space-y-2">
      <div className="flex items-center space-x-4">
        {backHref && (
          <Button variant="ghost" size="icon" asChild>
            <Link href={backHref}>
              <ChevronLeftIcon className="size-8" />
            </Link>
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children && <div className="flex items-center">{children}</div>}
    </section>
  );
}
