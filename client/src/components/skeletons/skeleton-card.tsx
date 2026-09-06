import { Skeleton } from "../ui/skeleton"


export default function SkeletonCard(){
  return(
    <Skeleton className="rounded-lg bg-bg-surface overflow-hidden p-3">
      <Skeleton className="h-48 bg-border-color" />
      <div className="p-2 space-y-3">
        <Skeleton className="h-4 w-3/4 bg-border-color" />
        <Skeleton className="h-4 w-1/2 bg-border-color" />
        <Skeleton className="h-4 w-2/3 bg-border-color" />
      </div>
    </Skeleton>
  )
}