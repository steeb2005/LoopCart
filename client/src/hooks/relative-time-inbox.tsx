import { format } from "date-fns"


export function InboxRelativeTime(date: string){
  
  const timestamp = new Date(date)
  const now = new Date()

  const diffInMs = timestamp.getTime() - now.getTime()
  const diffInHrs = Math.round(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24))

  if(Math.abs(diffInHrs) < 24){
    return format(timestamp, 'h:m aa')
  }

  if(Math.abs(diffInDays) <= 7){
    return format(timestamp, 'eee')
  }

  const includeYear = timestamp.getFullYear() !== now.getFullYear()
  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: includeYear ? 'numeric' : undefined
  })
}