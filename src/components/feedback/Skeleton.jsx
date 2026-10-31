/**
 * Fluent Design System Skeleton Loaders
 * Matches exact card radii (15px), KPI metric dimensions (130px height), and chart tracks (10px)
 */
export function Skeleton({ className = '', rounded = 'rounded-[7px]' }) {
  return (
    <div
      className={`animate-pulse bg-[#EDF2F9] ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton placeholder for the 4 KPI Summary Metric Cards (130px height, 15px radius)
 */
export function MetricCardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="fluent-card flex h-[130px] flex-col justify-between p-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" rounded="rounded-[4px]" />
            <Skeleton className="h-6 w-6" rounded="rounded-[5px]" />
          </div>
          <Skeleton className="h-9 w-40" rounded="rounded-[5px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" rounded="rounded-[21px]" />
            <Skeleton className="h-3.5 w-24" rounded="rounded-[4px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton placeholder for Analytical Bar/Donut Chart Cards (350px height, 15px radius)
 */
export function ChartCardSkeleton({ height = 'h-[350px]' }) {
  return (
    <div className={`fluent-card flex ${height} flex-col justify-between p-4`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" rounded="rounded-[4px]" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" rounded="rounded-[5px]" />
          <Skeleton className="h-6 w-16" rounded="rounded-[5px]" />
        </div>
      </div>
      <div className="my-3 flex flex-1 items-end justify-around gap-3 rounded-[10px] bg-[#F1F6FF] p-4">
        <Skeleton className="h-2/5 w-8 bg-[#DDE9FC]" rounded="rounded-t-[4px]" />
        <Skeleton className="h-4/5 w-8 bg-[#DDE9FC]" rounded="rounded-t-[4px]" />
        <Skeleton className="h-3/5 w-8 bg-[#DDE9FC]" rounded="rounded-t-[4px]" />
        <Skeleton className="h-full w-8 bg-[#DDE9FC]" rounded="rounded-t-[4px]" />
        <Skeleton className="h-1/2 w-8 bg-[#DDE9FC]" rounded="rounded-t-[4px]" />
        <Skeleton className="h-3/4 w-8 bg-[#DDE9FC]" rounded="rounded-t-[4px]" />
      </div>
      <div className="flex items-center justify-center gap-4">
        <Skeleton className="h-3.5 w-20" rounded="rounded-[4px]" />
        <Skeleton className="h-3.5 w-20" rounded="rounded-[4px]" />
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder for Transaction / Ranked Item List Rows
 */
export function TableRowSkeleton({ rows = 5 }) {
  return (
    <div className="fluent-card divide-y divide-black/10 p-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="flex h-[68px] items-center justify-between gap-4 px-2 py-2"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-[46px] w-[46px] shrink-0" rounded="rounded-[5px]" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" rounded="rounded-[4px]" />
              <Skeleton className="h-3 w-24" rounded="rounded-[4px]" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-24" rounded="rounded-[4px]" />
            <Skeleton className="h-7 w-14" rounded="rounded-[5px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;

