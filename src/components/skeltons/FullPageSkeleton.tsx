"use client";

import { Skeleton } from "@heroui/react";

export default function FullPageSkeleton() {
  return (
    <main className="flex-1 p-8 space-y-8 animate-pulse">
      {/* Page Title */}
      <Skeleton className="h-10 w-1/3" />

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Section Header */}
      <Skeleton className="h-6 w-1/4" />

      {/* Content Blocks */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </main>
  );
}
