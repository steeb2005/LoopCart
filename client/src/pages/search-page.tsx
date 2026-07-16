import Back from '../assets/back.svg'
import { useNavigate, Link } from 'react-router-dom'
import Search from '../assets/search.svg'
import { useAppContext } from '../context/context'
import Erase from '../assets/close.svg'
import React, { useState, useRef } from 'react'
import { Skeleton } from '../components/ui/skeleton'
import Heart from '../assets/Heart.svg'
import HeartClicked from '../assets/clickedHeart.svg'
import { useItemLike } from '../hooks/handle-like'
import { useScrollDirection } from "../hooks/scrollDirection.tsx"
type Item = {
  _id?: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  description: string;
  created_at: string;
  status: string;
  sold_at: string;
  seller_id: string;
  buyer_id: string;
  image: string;
  likes: number;
}


function SkeletonCard(){
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


function ItemCard({item_id, title, price, description, seller_name, likes}: {
  item_id: string,
  title: string,
  price: number,
  description: string,
  seller_name: string,
  likes: number
}
){
  const {isLiked, likesCount, handleLikeClick} = useItemLike(item_id, likes)
 
  return(
    <Link  
      to={`/item/${item_id}`}
      className="bg-bg-surface rounded-md p-3 cursor-pointer"
    >
      <div className="img-section bg-bg-inverse w-full min-h-37 rounded-md">
        {/* Image goes here */}
      </div>
      <div className="title-section text-primary-text mt-2">
        <h1 className="line-clamp-1 font-bold">{title}</h1>
        <h1 className="font-semibold">₱{price.toLocaleString('en-US')}</h1>
        <p className="text-sm line-clamp-1">{description}</p>
        <div className="flex flex-row items-center justify-between mt-2">
          <h1 className="text-sm font-light">@{seller_name}</h1>
          <div className="flex flex-row gap-2">
            <img 
              onClick={(e) => {
                handleLikeClick(e)
                e.preventDefault()
                e.stopPropagation()
              }}  
              src={isLiked ? HeartClicked : Heart} 
              alt="heart" className="filter-(--icon-filter)"/>
            {likesCount}
          </div>
        </div>
      </div>
    </Link>
  )
}



export default function SearchPage(){
  
  const navigate = useNavigate()
  const {items, getUsername} = useAppContext()

  const [searchResults, setSearchResults] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [prefill, setPrefill] = useState(true)
  const [category, setCategory] = useState('Items')
  // TODO
  // - add items or sellers in the top and category section (if possible)
  // - implement the loading skeleton
  // - make the seller category function

  
  const inputRef = useRef<HTMLInputElement>(null)

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleErase = (e: any) => {
    inputRef.current?.focus()
    e.preventDefault()
    setSearchInput('')
    setPrefill(true)
    setSearchResults([])
  }

  const getSearchResults = () => {
    if(searchInput.length > 0){
      const searchRes = items?.filter(item => item.title.toLowerCase().includes(searchInput.toLowerCase()))
      setSearchResults(searchRes)
      setPrefill(false)
    }else{
      setPrefill(true)
      setSearchResults([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      getSearchResults()
    }
  }


  const handleClickCategory = (category: string) => {
    setCategory(category)
    setSearchInput('')
    setPrefill(true)
    setSearchResults([])
  }

  const scrollDirection = useScrollDirection();
  const isHidden = scrollDirection === 'down';

  return(
    <div className="p-0 m-0 h-dvh flex flex-col">
      <div className={`px-5 fixed ${isHidden ? '-translate-y-full' : 'translate-y-0'} top-0 left-0 z-100 transition-transform duration-300 ease-in-out bg-bg-canvas head flex flex-row gap-3 py-2 border-b border-border-color text-primary-text font-semibold items-center w-full`}>
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

      <div className={`fixed w-full ${isHidden ? 'top-0' : 'top-13'} px-5 py-3 bg-bg-canvas flex flex-row items-center gap-3  z-50 transition-all duration-300 ease-in-out`}>
        <div onClick={() => handleClickCategory('Items')} className={`${category === 'Items' ? 'bg-bg-inverse text-primary-text-inverse' : 'bg-bg-gray-surface'} cursor-pointer font-semibold px-3 py-1 rounded-full text-sm`}>
          Items
        </div>
        <div onClick={() => handleClickCategory('Sellers')} className={`${category === 'Sellers' ? 'bg-bg-inverse text-primary-text-inverse' : 'bg-bg-gray-surface'} cursor-pointer font-semibold px-3 py-1 rounded-full text-sm`}>
          Sellers
        </div>
      </div>
      
      
      <div className="mx-5 px-2 py-2 mt-30 rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {
        (prefill && searchResults.length === 0 ) && (
          items.map(item => (
            <ItemCard 
              key={item._id} 
              item_id={item._id} 
              title={item.title} 
              price={item.price} 
              description={item.description} 
              seller_name={getUsername(item.seller_id)} 
              likes={item.likes}
            />
          ))    
        )}

        {
          loading ? (
            <>
              <SkeletonCard/>
              <SkeletonCard/>
              <SkeletonCard/>
              <SkeletonCard/>
            </>
          ) : (
          (searchResults.length === 0 && !prefill) ? (
            <div className='flex items-center justify-center text-empty-state '>
              No results found
            </div>
          ) : (    
            searchResults.map(item => (
              <ItemCard 
                key={item._id} 
                item_id={item._id} 
                title={item.title} 
                price={item.price} 
                description={item.description} 
                seller_name={getUsername(item.seller_id)} 
                likes={item.likes}/>
            ))
          )
        )
      }
      </div>
     

    </div>
  )
}

