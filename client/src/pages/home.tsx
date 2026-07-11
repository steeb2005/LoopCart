import { useEffect, useState } from "react"
import { useAppContext } from "../context/context"
import Category from "../assets/category.svg"
import Filter from "../assets/filter.svg"
import ArrowDown from "../assets/arrow_down.svg"
import Heart from "../assets/Heart.svg"
import HeartClicked from "../assets/clickedHeart.svg"
import { useScrollDirection } from "../hooks/scrollDirection.tsx"
import { Link, useSearchParams } from "react-router-dom"
import { useItemLike } from "../hooks/handle-like.tsx" 
import { Skeleton } from "../components/ui/skeleton.tsx"


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
        <h1 className="line-clamp-1 ">{title}</h1>
        <h1 className="font-bold">₱{price.toLocaleString('en-US')}</h1>
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
              alt="heart" />
            {likesCount}
          </div>
        </div>
      </div>
    </Link>
  )
}





function UserCard({userId, avatar_url, email}: {userId: string, avatar_url: string, email: string}){
  const {getUsername} = useAppContext()

  const username = getUsername(userId)
  return(
    <Link
      to={`/users/${userId}`}
      className="bg-bg-surface p-3 text-primary-text rounded-md flex flex-row justify-between cursor-pointer">
      <div className="flex flex-row items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-bg-inverse flex justify-center items-center">
          {avatar_url ? (<img src={avatar_url} alt="avatar"/>) : (<span className='text-primary-text-inverse text-xl font-bold'>{username.charAt(0).toUpperCase()}</span>) }

        </div>
        <div className="flex flex-col ">
          <p>{username}</p>
          <p className="text-gray-300 text-sm">{email}</p>
        </div>
      </div>

      <div className="flex items-center text-sm">
        View profile
      </div>
    </Link>
  )
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


function SkeletonUsers(){
  return(
    <Skeleton className="items-center rounded-lg bg-bg-surface flex flex-row gap-3 p-3">
      <Skeleton className="h-10 w-10 rounded-full bg-border-color" />
      <div className="flex flex-col space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4 bg-border-color" />
        <Skeleton className="h-4 w-1/2 bg-border-color" />
      </div>
    </Skeleton>
  )
}






function Home(){
  
  const {items, getUsername, users, user, load_items, load_users, dataLoading} = useAppContext()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [isClicked, setIsClicked] = useState(searchParams.get('tab') || 'Items')
  const [pageLoading, setPageLoading] = useState(true)
  
  
  
  useEffect(() => {
    const tab = searchParams.get('tab')
    if(tab && (tab === 'Items' || tab === 'Sellers')){
      setIsClicked(tab)
    }

  },[searchParams])

  useEffect(() => {
    const loadItems = async() =>{
      setPageLoading(true)
      await load_items()
      await load_users()
      setPageLoading(false) 
    }

    loadItems()
  }, [])


  const handleClick = (buttonId: string) =>{
    setIsClicked(buttonId)
    setSearchParams({tab: buttonId})
  } 


  const scrollDirection = useScrollDirection();
  const isHidden = scrollDirection === 'down';

  

  return(
    <>
      {/* Sidebar */}
      <div className=" mx-5 p-0 m-0 min-h-screen pb-5 pt-12 ">
        
        {/* SEARCH BAR
        <div className={`search-bar sticky ${isHidden ? 'top-2' : 'top-14'} z-50 transition-all duration-300 ease-in-out`}>
          <img src={Search} alt="searchsvg" className="absolute left-5 top-3"/>
          <input 
            type="text" 
            className="pl-14 text-sm items-center text-primary-text bg-bg-surface py-3 w-full rounded-md decoration-none outline-0" 
            placeholder="search"  
          />
        </div> */}

        <div className="top-section flex flex-col">
          
          <div className="flex flex-row justify-around font-semibold mt-2 text-primary-text ">
            <div onClick={() => handleClick("Items")} className={` border-b ${isClicked === 'Items' ? 'border-bg-inverse' : 'border-bg-surface'}  w-full text-center py-2 cursor-pointer`}>
              Items
            </div>
            <div onClick={() => handleClick("Sellers")} className={` border-b ${isClicked === 'Sellers' ? 'border-bg-inverse' : 'border-bg-surface'}  w-full text-center py-2 cursor-pointer`}> 
              Sellers
            </div>
          </div>

          <div className="flex flex-row text-primary-text mt-2 items-center gap-3 justify-between">
            <button className="cursor-pointer bg-bg-surface px-2 py-1 rounded-md flex flex-row items-center gap-2">
              <img src={Category} alt="category" />
              Category
              <img src={ArrowDown} alt="arrow_down" />
            </button>

            <div className="flex flex-row gap-3">
              <button className="cursor-pointer bg-bg-surface px-2 py-1 rounded-md flex flex-row items-center gap-1">
                <img src={Filter} alt="filter" />
                Filter
              </button>
            </div>
          </div>


          <div className="border px-2 py-2 border-border-color rounded-md mt-2 flex flex-col gap-2">
            
            {/* Item Entry */}
            
            {pageLoading && isClicked === 'Items' &&
            <>
              <SkeletonCard/>
              <SkeletonCard/>
              <SkeletonCard/>
              <SkeletonCard/>
              <SkeletonCard/>
            </>
            }

            {pageLoading && isClicked === 'Sellers' &&
            <>
              <SkeletonUsers/>
              <SkeletonUsers/>
              <SkeletonUsers/>
              <SkeletonUsers/>
              <SkeletonUsers/>
              <SkeletonUsers/>
              <SkeletonUsers/>
            </>
            }


            {isClicked === 'Items' &&
              items.map((item: any) => (
                item.status === 'available' && (
                  <ItemCard 
                    key={item._id}
                    item_id={item._id}
                    title={item.title}
                    price={item.price}
                    description={item.description}
                    seller_name={getUsername(item.seller_id)}
                    likes={item.likes}
                    
                  />
                )
              ))
            }

            {isClicked === 'Sellers' && 
            users
            .filter((u: any) => u._id !== user._id) // Removes the current loggedin user
            .map((user: any) => (
              <UserCard 
                key={user._id}
                userId={user._id}
                avatar_url={user.avatar_url}
                email={user.email}
              />
            ))}

          </div>
        </div>

      </div>
    </>
  )
}

export default Home