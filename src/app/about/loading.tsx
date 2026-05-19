import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-6 py-20 space-y-8">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <Skeleton variant="image" className="aspect-4/5 w-full rounded-2xl" />
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton variant="paragraph" className="w-full" />
          <Skeleton className="h-14 w-48" />
        </div>
      </div>
    </div>
  );
}
