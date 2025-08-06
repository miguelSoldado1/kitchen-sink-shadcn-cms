"use client";

import { StatCard } from "@/components/stat-card";
import { trpc } from "../_trpc/client";

export default function Page() {
  const { data: stats, isLoading } = trpc.getDashboardStats.useQuery();

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-3 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <StatCard
        title="users"
        subtitle="Growth in the last 30 days"
        total={stats?.users.total ?? 0}
        newItems={stats?.users.lastMonth ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        title="products"
        subtitle="Growth in the last 30 days"
        total={stats?.products.total ?? 0}
        newItems={stats?.products.lastMonth ?? 0}
        isLoading={isLoading}
      />
    </div>
  );
}
