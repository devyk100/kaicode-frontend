import { Skeleton } from "@/components/ui/skeleton";

export default function CodeLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left panel - File explorer */}
        <div className="w-64 border-r p-4 space-y-2">
          <Skeleton className="h-6 w-24" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Main editor area */}
        <div className="flex-1 flex flex-col">
          {/* Editor tabs */}
          <div className="border-b p-2 flex space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>

          {/* Editor content */}
          <div className="flex-1 p-4 space-y-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" style={{ width: `${Math.random() * 40 + 60}%` }} />
            ))}
          </div>
        </div>

        {/* Right panel - Output */}
        <div className="w-80 border-l p-4 space-y-4">
          <Skeleton className="h-6 w-20" />
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
