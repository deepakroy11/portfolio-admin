import { Skeleton } from "@heroui/react";

export default function PostFormSkeleton() {
  return (
    <div className="flex-1 p-8 space-y-10">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-7 h-7 rounded" />
        <Skeleton className="h-6 w-1/3 rounded" />
      </div>

      {/* Form Skeleton */}
      <div className="space-y-6 max-w-4xl">
        {/* Title & Slug */}
        <div className="flex gap-4">
          <Skeleton className="h-10 w-1/2 rounded" />
          <Skeleton className="h-10 w-1/2 rounded" />
        </div>

        {/* Summary */}
        <Skeleton className="h-20 w-full rounded" />

        {/* Description */}
        <Skeleton className="h-40 w-full rounded" />

        {/* Dropdowns */}
        <div className="flex gap-4">
          <Skeleton className="h-10 w-1/5 rounded" />
          <Skeleton className="h-10 w-1/5 rounded" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}
