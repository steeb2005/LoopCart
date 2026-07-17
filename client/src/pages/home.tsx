import { useEffect, useState } from "react"
import { useAppContext } from "../context/context"
import Category from "../assets/category.svg"
import Filter from "../assets/filter.svg"
import ArrowDown from "../assets/arrow_down.svg"
import Heart from "../assets/Heart.svg"
import HeartClicked from "../assets/clickedHeart.svg"
import { useScrollDirection } from "../hooks/scrollDirection.tsx"
import { Link } from "react-router-dom"
import { useItemLike } from "../hooks/handle-like.tsx" 
import { Skeleton } from "../components/ui/skeleton.tsx"


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
  
  const {items, getUsername, load_items, load_users} = useAppContext()
    
  const [pageLoading, setPageLoading] = useState(true)
  
  useEffect(() => {
    const loadItems = async() =>{
      setPageLoading(true)
      await load_items()
      await load_users()
      setPageLoading(false) 
    }

    loadItems()
  }, [])


 

  const scrollDirection = useScrollDirection();
  const isHidden = scrollDirection === 'down';

  

  return(
    <>
      {/* Sidebar */}
   
        
        {/* SEARCH BAR
        <div className={`search-bar sticky ${isHidden ? 'top-2' : 'top-14'} z-50 transition-all duration-300 ease-in-out`}>
          <img src={Search} alt="searchsvg" className="absolute left-5 top-3"/>
          <input 
            type="text" 
            className="pl-14 text-sm items-center text-primary-text bg-bg-surface py-3 w-full rounded-md decoration-none outline-0" 
            placeholder="search"  
          />
        </div> */}

      <div className="top-section flex flex-col mx-5">
        
        <div className="flex flex-row text-primary-text mt-2 items-center gap-3 justify-between">
          <button className="cursor-pointer bg-bg-surface px-2 py-1 rounded-md flex flex-row items-center gap-2">
            <img src={Category} alt="category" className="filter-(--icon-filter)"/>
            Category
            <img src={ArrowDown} alt="arrow_down" className="filter-(--icon-filter)"/>
          </button>

          <div className="flex flex-row gap-3">
            <button className="cursor-pointer bg-bg-surface px-2 py-1 rounded-md flex flex-row items-center gap-1">
              <img src={Filter} alt="filter" className="filter-(--icon-filter)"/>
              Filter
            </button>
          </div>
        </div>


        <div className=" rounded-md py-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          
          {/* Item Entry */}
          
          {pageLoading &&
            Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))

          }

          {
            items.map((item: any) => (
              item.status === 'available' && (
                <ItemCard 
                  key={item._id}
                  item_id={item._id}
                  title={item.title}
                  price={item.price}
                  seller_name={getUsername(item.seller_id)}
                  likes={item.likes}
                  
                />
              )
            ))
          }


        </div>
      </div>
    </>
  )
}

export default Home