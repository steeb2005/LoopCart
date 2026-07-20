import Back from '../assets/back.svg'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import Search from '../assets/search.svg'
import { useAppContext } from '../context/context'
import Erase from '../assets/close.svg'
import React, { useState, useRef, useEffect } from 'react'
import { Skeleton } from '../components/ui/skeleton'
import Heart from '../assets/Heart.svg'
import HeartClicked from '../assets/clickedHeart.svg'
import { useItemLike } from '../hooks/handle-like'
import { useScrollDirection } from "../hooks/scrollDirection.tsx"


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


function ItemCard({item_id, title, price, seller_name, likes}: {
  item_id: string,
  title: string,
  price: number,
  seller_name: string,
  likes: number
}
){
  const {isLiked, likesCount, handleLikeClick} = useItemLike(item_id, likes)
 
  return(
    <Link  
      to={`/item/${item_id}`}
      className="border border-border-color rounded-md p-3 cursor-pointer max-h-100 flex flex-col space-y-1"
    >
      <div className="img-section bg-bg-inverse w-full min-h-50 rounded-md">
        {/* Image goes here */}
      </div>
      <div className="title-section text-primary-text mt-2 ">
        <h1 className="line-clamp-2 ">{title}</h1>
        <h1 className=" font-bold text-lg">₱{price.toLocaleString('en-US')}</h1>
      </div>
      <div className="flex flex-row items-center justify-between mt-auto">
        <h1 className="text-sm font-light">@{seller_name}</h1>
        <div className="flex flex-row gap-2">
          <img 
            onClick={(e) => {
              handleLikeClick(e)
              e.preventDefault()
              e.stopPropagation()
            }}  
            src={isLiked ? HeartClicked : Heart} 
            alt="heart" className="filter-(--icon-filter) h-6"/>
          {likesCount}
        </div>
        
      </div>
    </Link>
  )
}




function UserCard({userId, avatar_url, firstname, lastname, username }: {
  userId: string, 
  avatar_url: string, 
  firstname: string,
  lastname: string,
  username: string
}){
  return(
    <Link
      to={`/users/${userId}`}
      className="border border-border-color p-3 text-primary-text rounded-md flex flex-row justify-between cursor-pointer">
      <div className="flex flex-row items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-bg-inverse flex justify-center items-center">
          {avatar_url ? (<img src={avatar_url} alt="avatar"/>) : (<span className='text-primary-text-inverse text-xl font-bold'>{username.charAt(0).toUpperCase()}</span>) }
        </div>
        <div className="flex flex-col ">
          <p className="">{firstname} {lastname}</p>
          <p className="text-sm text-secondary-text font-light">{username}</p>
        </div>
      </div>

      <div className="flex items-center text-xs font-light">
        View profile
      </div>
    </Link>
  )
}




export default function SearchPage(){
  
  const navigate = useNavigate()
  const {items, getUsername, users} = useAppContext()

  const [searchResults, setSearchResults] = useState([])
  const [searchInput, setSearchInput] = useState('')
  
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [prefill, setPrefill] = useState(true)
  const [category, setCategory] = useState(searchParams.get('tab') || 'Items')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if(tab){
      setCategory(tab)
    }  
  }, [searchParams])

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

  const getSearchResults = (category: string) => {
    if(searchInput.length > 0){
      if(category === 'Items'){
        const searchRes = items?.filter(item => {
          if(item.deleted === false && item.status === 'available'){
            return item.deleted === false && item.status === 'available' && item.title.toLowerCase().includes(searchInput.toLowerCase())
          }
        })
        setSearchResults(searchRes)
        setPrefill(false)
      }else{
        const searchRes = users?.filter(user => user.username.toLowerCase().includes(searchInput.toLowerCase()))
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
      getSearchResults(category)
    }
  }


  const handleClickCategory = (newCategory: string) => {
    setCategory(newCategory)
    getSearchResults(newCategory)
    setSearchParams({tab: newCategory})
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
      
      
      <div className={`mx-5 px-2 py-2 mt-28 rounded-md ${(searchResults.length === 0 && !prefill) ? 'flex flex-col' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'}`}>


        {
        (prefill && searchResults.length === 0 && category === 'Items') && (
          items.map(item => (
            (item.status === 'available' && item.deleted === false && (
              <ItemCard 
                key={item._id} 
                item_id={item._id} 
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
                avatar_url={user.avatar_url}
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
            searchResults.map(item => (
             
              <ItemCard 
                key={item._id} 
                item_id={item._id} 
                title={item.title} 
                price={item.price} 
                seller_name={getUsername(item.seller_id)} 
                likes={item.likes}
              />
              
            ))
          ) : (
            searchResults.map(user => (
              <UserCard 
                key={user._id} 
                userId={user._id} 
                username={user.username}
                firstname={user.firstname} 
                lastname={user.lastname} 
                avatar_url={user.avatar_url}
              />
            ))
          )
        )
        
      }
      </div>
     

    </div>
  )
}

