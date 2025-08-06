import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  total: number;
  isLoading?: boolean;
  newItems: number;
  subtitle?: string;
}

export function StatCard({ title, total, isLoading, newItems, subtitle }: StatCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{isLoading ? <Skeleton className="h-5 w-48" /> : `Number of ${title}`}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {isLoading ? <Skeleton className="h-10 w-24" /> : total}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {isLoading ? (
            <Skeleton className="h-5 w-40" />
          ) : (
            <>
              +{newItems} new {title.toLowerCase()} this month
            </>
          )}
        </div>
        <div className="text-muted-foreground">{isLoading ? <Skeleton className="h-4 w-44" /> : subtitle}</div>
      </CardFooter>
    </Card>
  );
}
