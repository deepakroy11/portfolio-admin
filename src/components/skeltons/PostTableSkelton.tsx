import { Skeleton } from "@heroui/react";

export default function PostsTableSkeleton() {
  const rows = Array.from({ length: 4 }); // simulate 8 rows

  return (
    <div className="space-y-2">
      {rows.map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-7 gap-4 items-center p-4 border rounded-md bg-white shadow-sm"
        >
          <Skeleton className="h-4 w-6 rounded" /> {/* ID */}
          <Skeleton className="h-4 w-32 rounded" /> {/* Title */}
          <Skeleton className="h-4 w-48 rounded" /> {/* Summary */}
          <Skeleton className="h-4 w-24 rounded" /> {/* Category */}
          <Skeleton className="h-4 w-24 rounded" /> {/* Author */}
          <Skeleton className="h-4 w-32 rounded" /> {/* Tags */}
          <Skeleton className="h-8 w-10 rounded-full" /> {/* Actions */}
        </div>
      ))}
    </div>
  );
}
