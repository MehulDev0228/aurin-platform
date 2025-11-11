// src/components/LoadingSkeleton.tsx - Loading skeleton components

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1600px] mx-auto px-8 py-16">
        {/* Hero Section Skeleton */}
        <div className="relative overflow-hidden rounded-[32px] bg-white/[0.02] border border-white/10 p-12 mb-12">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 rounded-3xl bg-white/[0.05] animate-pulse" />
              <div className="space-y-4">
                <div className="h-12 w-64 bg-white/[0.05] rounded-2xl animate-pulse" />
                <div className="h-6 w-48 bg-white/[0.05] rounded-xl animate-pulse" />
                <div className="h-4 w-96 bg-white/[0.05] rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/10 p-8">
              <div className="w-8 h-8 rounded-xl bg-white/[0.05] mb-4 animate-pulse" />
              <div className="h-10 w-20 bg-white/[0.05] rounded-xl mb-2 animate-pulse" />
              <div className="h-4 w-24 bg-white/[0.05] rounded-lg animate-pulse" />
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-10">
              <div className="h-8 w-48 bg-white/[0.05] rounded-xl mb-8 animate-pulse" />
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/10 p-6">
                    <div className="w-20 h-20 rounded-xl bg-white/[0.05] mx-auto mb-4 animate-pulse" />
                    <div className="h-4 w-full bg-white/[0.05] rounded-lg mb-2 animate-pulse" />
                    <div className="h-3 w-3/4 bg-white/[0.05] rounded-lg mx-auto animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-8">
              <div className="h-8 w-32 bg-white/[0.05] rounded-xl mb-6 animate-pulse" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-white/[0.05] rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-8 animate-pulse">
      <div className="h-6 w-3/4 bg-white/[0.05] rounded-xl mb-4" />
      <div className="h-4 w-full bg-white/[0.05] rounded-lg mb-2" />
      <div className="h-4 w-5/6 bg-white/[0.05] rounded-lg" />
    </div>
  );
}

export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/[0.05]" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 bg-white/[0.05] rounded-lg" />
              <div className="h-4 w-1/2 bg-white/[0.05] rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/10 p-8 animate-pulse">
          <div className="w-8 h-8 rounded-xl bg-white/[0.05] mb-4" />
          <div className="h-10 w-20 bg-white/[0.05] rounded-xl mb-2" />
          <div className="h-4 w-24 bg-white/[0.05] rounded-lg" />
        </div>
      ))}
    </div>
  );
}

