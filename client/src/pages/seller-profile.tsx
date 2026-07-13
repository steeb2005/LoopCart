import { useParams } from "react-router-dom"
import Back from '../assets/back.svg'
import { useNavigate, Link } from "react-router-dom"
import { useAppContext } from "../context/context"
import { useEffect, useState } from "react"
import Items from '../assets/items.svg' 
import { useItemLike } from "../hooks/handle-like"
import HeartDefault from '../assets/Heart.svg'
import HeartClicked from '../assets/clickedHeart.svg'
import {format} from "date-fns"
import { Skeleton } from "../components/ui/skeleton"

type User = {
  username: string
  firstname: string
  lastname: string
  email: string
  join_date: string
  avatar_url?: string 
  address?: string 
  gender?: string 
  bio?: string 
  birthdate?: string 
}


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


// IF OWN PROFILE THEN GO TO USER PROFILE (FIX)

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
      className="curor-pointer bg-bg-surface rounded-md p-3"
    >
      <div className="img-section bg-bg-inverse w-100% min-h-37 rounded-md">
        {/* Image goes here */}
      </div>
      <div className="title-section text-primary-text mt-2">
        <h1 className="line-clamp-1 font-bold">{title}</h1>
        <h1 className='font-semibold'>₱{price.toLocaleString('en-US')}</h1>
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
              src={isLiked ? HeartClicked : HeartDefault} 
              alt="heart" className="filter-(--icon-filter)"/>
            {likesCount}
          </div>
        </div>
      </div>
    </Link>
  )
}




export default function SellerProfile(){
  const navigate = useNavigate()
  const {users, items, getUsername, dataLoading} = useAppContext()
  const {userId} = useParams() 

  const [user, setUser] = useState<User | null>(null)
  const [sellerItems, setSellerItems] = useState<Item[]>([])
  
  useEffect(() => {
    const findUser = () => {
    
      const user = users.find(user => user._id === userId)
      const filteredItems = items?.filter(item => item.seller_id === userId)
      setSellerItems(filteredItems)
      setUser(user)
    }
      
    findUser()
  }, [users, items])

  const handleBackClick = () => {
    navigate(-1)
  }

  const date = new Date(user?.join_date)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });


  if(dataLoading){
    return(
      <div className="p-0 m-0 min-h-screen pb-5 flex flex-col pt-15"> 
        <div className='mx-5 head flex flex-row gap-8 pt-3 text-primary-text font-semibold cursor-pointer'>
          <img src={Back} alt="back" />
          Seller Profile
        </div>

        <div className="mx-5">
          <div className="flex flex-row flex-1 mt-8 gap-2">
            <Skeleton className="w-20 h-20 bg-bg-surface rounded-full items-center flex justify-center"/>
            <div className="flex flex-col flex-1 justify-center space-y-2">
              <Skeleton className="h-4 w-1/2 bg-bg-surface items-center flex justify-center"/>
              <Skeleton className="h-4 w-2/3 bg-bg-surface items-center flex justify-center"/>
            </div>
          </div>  
        </div>
        <div className="border-b border-border-color py-5">
          <div className="flex flex-1 flex-col mx-5">
            <Skeleton className="h-4 w-7/10 mt-5 bg-bg-surface items-center flex justify-center"/>
            
            <div className="flex flex-col space-y-2 mt-5">
              <Skeleton className="h-4 w-3/10 bg-bg-surface items-center flex justify-center"/>
              <Skeleton className="h-4 w-6/10 bg-bg-surface items-center flex justify-center"/>
            </div>
            <div className="flex flex-col space-y-2 mt-5">
              <Skeleton className="h-4 w-4/10 bg-bg-surface items-center flex justify-center"/>
              <Skeleton className="h-4 w-5/10 bg-bg-surface items-center flex justify-center"/>
            </div>
            <div className="flex flex-col space-y-2 mt-5">
              <Skeleton className="h-4 w-5/10 bg-bg-surface items-center flex justify-center"/>
              <Skeleton className="h-4 w-7/10 bg-bg-surface items-center flex justify-center"/>
            </div>
            <div className="flex flex-col space-y-2 mt-5">
              <Skeleton className="h-4 w-3/10 bg-bg-surface items-center flex justify-center"/>
              <Skeleton className="h-4 w-4/10 bg-bg-surface items-center flex justify-center"/>
          
            </div>
          </div>
        </div>
        <div className="mx-5 mt-5">
          <Skeleton className="h-4 w-8/10 bg-bg-surface items-center flex justify-center"/>
          <div className="flex flex-col gap-3 mt-5">
            <Skeleton className="h-20 w-full bg-bg-surface rounded-md items-center flex justify-center"/>
            <Skeleton className="h-20 w-full bg-bg-surface rounded-md items-center flex justify-center"/>
            <Skeleton className="h-20 w-full bg-bg-surface rounded-md items-center flex justify-center"/>
          </div>

        </div>
      </div>
    )
  }


  return(
    <div className="p-0 m-0 min-h-screen pb-5 flex flex-col pt-15"> 
      <div className='mx-5 head flex flex-row gap-8 pt-3 text-primary-text font-semibold cursor-pointer'>
        <img onClick={handleBackClick} src={Back} alt="back" className="filter-(--icon-filter)"/>
        Seller Profile
      </div>
      <div className="flex flex-col">
        <div className=" flex flex-row mt-5 gap-5 text-primary-text mx-5">
          <div className="w-20 h-20 bg-bg-inverse rounded-full items-center flex justify-center">
            {user?.avatar_url ? (<img src={user.avatar_url} alt="avatar"/>) : (<span className='text-primary-text-inverse text-3xl font-bold'>{user?.username.charAt(0).toUpperCase()}</span>) }

          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-bold text-2xl">
              {user?.firstname} {user?.lastname}
            </h1>
            <h1 className="text-secondary-text">@{user?.username}</h1>
            
          </div>
        </div>


        <div className="flex flex-col text-primary-text px-5 mt-5">
          <h1 className="text-xl font-bold mb-2">About</h1>
          <p className="text-secondary-text text-sm">{user?.bio || 'No bio yet'}</p>
        </div>

        <div className="flex flex-col text-primary-text mt-5 border-b border-border-color pb-3">
          <div className="mx-5">

            <h1 className="text-xl font-bold">Personal Details</h1>
        

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Join Date</h1>
              <p className="text-secondary-text">{formattedDate}</p>
            </div>

            {user?.birthdate && (  
              <div className="flex flex-col">
                <h1 className="font-semibold mt-5">Birthdate</h1>
                <p className="text-secondary-text">{format(new Date(user?.birthdate), 'MMMM d, yyyy')}</p>
              </div>
            )}

            {user?.gender && (
            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Gender</h1>
              <p className="text-secondary-text">{user?.gender.charAt(0).toUpperCase() + user?.gender.slice(1).toLowerCase()}</p>
            </div>
            )}

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Address</h1>
              <p className="text-secondary-text">{user?.address || 'No address yet'}</p>
            </div>
          </div>
        </div>
        <div className="text-primary-text mx-5 mt-5">
          <div className="flex flex-row gap-3 mb-5">
            <img src={Items} alt="items-svg" />
            <h1 className="font-bold text-xl">{user?.username}'s Items</h1>
          </div>
          <div className="flex flex-col gap-3">


            {sellerItems.length === 0 ? <div className="mb-2 text-center text-empty-state font-light">No items yet</div> : sellerItems?.map(i => (
              <ItemCard
                key={i._id}
                item_id={i._id}
                title={i.title}
                price={i.price}
                description={i.description}
                seller_name={getUsername(i.seller_id)}
                likes={i.likes}/>
            ))}
          </div>

        </div>

      </div>

      
    </div>
  )
}