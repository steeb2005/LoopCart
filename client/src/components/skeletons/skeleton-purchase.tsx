import { Skeleton } from "../ui/skeleton"

export default function PurchaseSkeleton(){
  return(
    <div className="rounded-lg flex flex-row items-center overflow-hidden p-2">
      <div className='flex-1 flex flex-col gap-2'>
        <Skeleton className="h-4 w-3/4 bg-bg-gray-surface"/>
        <div className='flex flex-row items-center'>
          <Skeleton className="h-20 w-20 bg-bg-gray-surface"/>
          <div className="p-2 space-y-3 flex flex-col flex-1">
            <Skeleton className="h-4 w-3/4 bg-bg-gray-surface" />
            <Skeleton className="h-4 w-1/2 bg-bg-gray-surface" />
            <Skeleton className="h-4 w-2/3 bg-bg-gray-surface" />
          </div>
        </div>
        <div className='flex-1 flex-row flex items-center gap-2'>
          <Skeleton className="h-8 w-8 rounded-full bg-bg-gray-surface"/>
          <Skeleton className="h-4 w-2/8 bg-bg-gray-surface"/>
          <Skeleton className="h-4 w-2/8 bg-bg-gray-surface"/>
        </div>
      </div>
    </div>
  )
}

