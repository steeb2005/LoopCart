import { Skeleton } from "../ui/skeleton"

export default function InboxSkeleton(){
  return(
    <div className='item-entry p-2 gap-2 rounded-md flex flex-row shrink-0'>
      <Skeleton className='w-20 h-20 rounded-md shrink-0 bg-bg-surface'/>

      <div className='w-full min-w-0 space-y-2 flex flex-col flex-1 justify-center'>
        <div className='flex flex-row justify-between items-center gap-2'>
          <Skeleton className='h-4 w-2/5 bg-bg-surface'/>
          <Skeleton className='h-4 w-1/5 bg-bg-surface'/>
        </div>

        <div className='flex flex-row justify-between items-center gap-2'>
          <Skeleton className='h-3 w-1/4 bg-bg-surface'/>
          <Skeleton className='h-5 w-14 rounded-full bg-bg-surface'/>
        </div>

        <Skeleton className='h-3 w-3/4 bg-bg-surface'/>
      </div>
    </div>
  )
}