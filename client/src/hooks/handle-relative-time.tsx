
export function RelativeTime(date: string){
  
  const timestamp = new Date(date)
  const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })
  const now = new Date()

  const diffInMs = timestamp.getTime() - now.getTime()
  const diffInHrs = Math.round(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24))

  if(Math.abs(diffInHrs) < 24){
    return rtf.format(diffInHrs, 'hour')
  }
  if(Math.abs(diffInDays) <= 7){
    return rtf.format(diffInDays, 'day')
  }

  const includeYear = timestamp.getFullYear() !== now.getFullYear()
  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: includeYear ? 'numeric' : undefined
  })
}