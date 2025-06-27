import FullPageSkeleton from "@/components/skeltons/FullPageSkeleton";

export default function Loading() {
  return (
    <main className="flex-1 p-8 space-y-10">
      <FullPageSkeleton />
    </main>
  );
}
