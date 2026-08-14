import Back from '../assets/back.svg'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Search from '../assets/search.svg'
import { useAppContext } from '../context/context'
import Erase from '../assets/close.svg'
import React, { useState, useRef, useEffect } from 'react'
import { useScrollDirection } from "../hooks/scrollDirection.tsx"
import ItemCard from '../components/item-card'
import UserCard from '../components/user-card'







export default function SearchPage(){
  
  const navigate = useNavigate()
  const {items, getUsername, users} = useAppContext()

  const [searchResults, setSearchResults] = useState<(typeof items[0] | typeof users[0])[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  
  const inputRef = useRef<HTMLInputElement>(null)
  const [prefill, setPrefill] = useState(true)

  const category = searchParams.get('tab') || 'Items'
  const query = searchParams.get('query') || ''
  
  useEffect(() => {
    setSearchInput(query)
    getSearchResults(category, query)
  },[category, query, items, users])


  const handleBackClick = () => {
    navigate(-1)
  }


  const handleErase = (e: any) => {
    inputRef.current?.focus()
    e.preventDefault()
    setSearchInput('')
    setPrefill(true)
    setSearchResults([])
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('query')
    setSearchParams(newParams, {replace: true})
  }

  const getSearchResults = (category: string, searchQuery: string) => {
    if(searchQuery.length > 0){
      if(category === 'Items'){
        const searchRes = items?.filter(item => 
          item.deleted === false && item.status === 'available' && item.title.toLowerCase().includes(searchQuery.toLowerCase())        
        )
        setSearchResults(searchRes)
        setPrefill(false)
      }else{
        const searchRes = users?.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
        setSearchResults(searchRes)
        setPrefill(false)
      }
    }else{
      setPrefill(true)
      setSearchResults([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const newParams = new URLSearchParams(searchParams)
      if(searchInput.length > 0){
        newParams.set('query', searchInput)
      }else{
        newParams.delete('query')
      }
      setSearchParams(newParams, {replace: true})
      getSearchResults(category, searchInput)
    }
  }


  const handleClickCategory = (newCategory: string) => {
    const newParams =  new URLSearchParams(searchParams)
    newParams.set('tab', newCategory)
    setSearchParams(newParams, {replace: true}) // This overwrites the url in the same stack
   
  }



  const scrollDirection = useScrollDirection();
  const isHidden = scrollDirection === 'down';

  return(
    <div className="p-0 m-0 h-dvh flex flex-col">
      <div className={`px-5 fixed ${isHidden ? '-translate-y-full' : 'translate-y-0'} top-0 left-0 z-100 transition-transform duration-300 ease-in-out bg-bg-canvas head flex flex-row gap-3 py-2 text-primary-text font-semibold items-center w-full`}>
        <img onClick={handleBackClick} src={Back} alt="back" className='h-6 cursor-pointer filter-(--icon-filter)'/>
        
        <div className={`search-bar sticky flex flex-row justify-between top-0 w-full z-50  transition-all duration-300 ease-in-out `}>
          <img src={Search} alt="searchsvg" className="absolute left-4 top-2.5 filter-(--icon-filter) h-5"/>
          <input 
            ref={inputRef}
            type="text" 
            className="pl-13 text-sm items-center text-secondary-text bg-bg-surface py-2 px-13 w-full rounded-full outline-0" 
            placeholder="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}  
            onKeyDown={handleKeyDown}
          />
          
          <div onClick={handleErase} className={`${searchInput.length > 0 ? 'flex' : 'hidden'} cursor-pointer absolute right-2 top-1.5 items-center p-1 bg-bg-gray-surface rounded-full`}>
            <img src={Erase} alt="Erase" className='h-4 filter-(--icon-filter)'/>
          </div>
        </div>
      </div>

      <div className={`fixed w-full ${isHidden ? 'top-0' : 'top-13'} px-5 py-3 border-t border-border-color bg-bg-canvas shadow-md flex flex-row items-center gap-3  z-50 transition-all duration-300 ease-in-out`}>
        <div onClick={() => handleClickCategory('Items')} className={`${category === 'Items' ? 'bg-bg-inverse text-primary-text-inverse' : 'bg-bg-surface'} cursor-pointer font-semibold px-3 py-1 rounded-full text-sm`}>
          Items
        </div>
        <div onClick={() => handleClickCategory('Sellers')} className={`${category === 'Sellers' ? 'bg-bg-inverse text-primary-text-inverse' : 'bg-bg-surface'} cursor-pointer font-semibold px-3 py-1 rounded-full text-sm`}>
          Sellers
        </div>
      </div>
      
      
      <div className={`mx-5  py-2 mt-28 rounded-md ${(searchResults.length === 0 && !prefill) ? 'flex flex-col' : `${category === 'Sellers' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'}`}`}>
        {
        (prefill && searchResults.length === 0 && category === 'Items') && (
          items.map(item => (
            (item.status === 'available' && item.deleted === false && (
              <ItemCard 
                key={item._id} 
                image={item.image}
                item_id={item._id!} 
                title={item.title} 
                price={item.price} 
                seller_name={getUsername(item.seller_id)} 
                likes={item.likes}
              />
            ))
          ))    
        )
        }

        {
          prefill && searchResults.length === 0 && category === 'Sellers' && (
            users.map(user => (
              <UserCard 
                key={user._id} 
                userId={user._id} 
                username={user.username}
                firstname={user.firstname} 
                lastname={user.lastname} 
                avatar_url={user.avatar_url ?? null}
              />
              
            ))
          )
        }
         
        {
          (searchResults.length === 0 && !prefill) ? (
            <div className='flex items-center justify-center text-empty-state '>
              No results found
            </div>
          ) : (    
          category === 'Items' ? (
            (searchResults as typeof items).map(item => (       
              <ItemCard 
                key={item._id} 
                image={item.image}
                item_id={item._id!} 
                title={item.title} 
                price={item.price} 
                seller_name={getUsername(item.seller_id)} 
                likes={item.likes}
              />
              
            ))
          ) : (
            (searchResults as typeof users).map(user => (
              <UserCard 
                key={user._id} 
                userId={user._id} 
                username={user.username}
                firstname={user.firstname} 
                lastname={user.lastname} 
                avatar_url={user.avatar_url ?? null}
              />
            ))
          )
        )
        }
      </div>
     

    </div>
  )
}

// grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3