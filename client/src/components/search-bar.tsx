import Search from '../assets/search.svg'
import Erase from '../assets/close.svg'
import { useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export default function SearchBar(){
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const urlQuery = searchParams.get('query') || ''
  const [query, setQuery] = useState(urlQuery)
  const currentLocation = useLocation().pathname
  
  const inputRef = useRef<HTMLInputElement>(null)
  
  const handleErase = (e: any) => {
    inputRef.current?.focus()
    e.preventDefault()
    setQuery('')
  }

  const handleSearchSubmit = (query: string) => {
    navigate(`/search?query=${encodeURIComponent(query)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault()
      handleSearchSubmit(query)
    }
  }

  
  return(
    <div className={` relative ${currentLocation === '/search' ? 'flex' : 'hidden lg:flex'} flex-row flex-1 justify-between w-full transition-all duration-200 ease-in-out `}>
      <img src={Search} alt="searchsvg" className="absolute left-4 top-2.5 filter-(--icon-filter) h-5"/>
        <input 
          ref={inputRef}
          type="text" 
          className="pl-13 text-sm items-center text-secondary-text bg-bg-surface py-2 px-13 w-full rounded-full outline-0 border border-border-color" 
          placeholder="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}  
          onKeyDown={handleKeyDown}
        />
      <div onClick={handleErase} className={`${query.length > 0 ? 'flex' : 'hidden'} cursor-pointer absolute right-2 top-1.5 items-center p-1 bg-bg-gray-surface rounded-full`}>
        <img src={Erase} alt="Erase" className='h-4 filter-(--icon-filter)'/>
      </div>
    </div>
  )
}