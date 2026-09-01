import {Calendar} from './ui/calendar'
import {Popover, PopoverContent, PopoverTrigger} from './ui/popover'
import {Button} from './ui/button'
import { useState } from 'react'
import {format} from "date-fns"
import { useAppContext } from '../services'

export function DatePicker({ onSelect, error }: { onSelect: (date: string) => void, error: string }) {
  const {user} = useAppContext()
  const [date, setDate] = useState<Date | undefined>()
  const [open, setOpen] = useState(false)

  const handleSelect = (selected: Date | undefined) => {
    setDate(selected)
    if (selected) {
      onSelect(format(selected, 'yyyy-MM-dd'))
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
            
          className={`bg-bg-canvas hover:bg-bg-gray-surface  w-full cursor-pointer py-8 border ${error ? "border-red-500" : "border-border-color"}  text-secondary-text font-light justify-start`}
        >
          <div className='flex flex-col text-primary-text text-left'>
            <p className='text-secondary-text'>Month day year</p>
            <p className='font-semibold'>
              {date ? format(date, 'MMMM d, yyyy') : user?.birthdate ? format(new Date(user.birthdate), 'MMMM d, yyyy') : "Select a date"}

            </p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='bg-bg-canvas text-primary-text '
        >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          captionLayout="dropdown"        
          classNames={{
            dropdown: "bg-bg-surface text-primary-text",
            caption_label: 'bg-bg-surface text-primary-text hidden',
          }}
        />
      </PopoverContent>
    </Popover>
  )
}




