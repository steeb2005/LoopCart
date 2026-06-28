import { useParams } from "react-router-dom"
import Back from '../assets/back.svg'
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/context"
import { useEffect, useState } from "react"
import Items from '../assets/items.svg' 
import { useItemLike } from "../hooks/handle-like"
import HeartDefault from '../assets/Heart.svg'
import HeartClicked from '../assets/clickedHeart.svg'

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
  const navigate = useNavigate()
  const handleItemClick = () => {
    navigate(`/item/${item_id}`)
  }

  return(
    <div  
      className="curor-pointer bg-bg-surface rounded-md p-3"
      onClick={handleItemClick}
    >
      <div className="img-section bg-bg-inverse w-100% min-h-37 rounded-md">
        {/* Image goes here */}
      </div>
      <div className="title-section text-primary-text mt-2">
        <h1 className="line-clamp-1 ">{title}</h1>
        <h1 className='font-bold'>₱{price.toLocaleString('en-US')}</h1>
        <p className="text-sm line-clamp-1">{description}</p>
        <div className="flex flex-row items-center justify-between mt-2">
          <h1 className="text-sm font-light">@{seller_name}</h1>
          <div className="flex flex-row gap-2">
            <img onClick={handleLikeClick}  src={isLiked ? HeartClicked : HeartDefault} alt="heart" />
            {likesCount}
          </div>
        </div>
      </div>
    </div>
  )
}




export default function SellerProfile(){
  const navigate = useNavigate()
  const {userId} = useParams() 
  const {users, items, getUsername} = useAppContext()

  const [user, setUser] = useState<User | null>(null)
  const [sellerItems, setSellerItems] = useState<Item[] | null>(null)

  useEffect(() => {
    const user = users.find(user => user._id === userId)
    const filteredItems = items?.filter(item => item.seller_id === userId)

    setSellerItems(filteredItems)
    setUser(user)
  }, [])

  const handleBackClick = () => {
    navigate(-1)
  }

  const date = new Date(user?.join_date)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });


  return(
    <div className="p-0 m-0 min-h-screen pb-5 flex flex-col"> 
      <div className='mx-5 head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
        <img onClick={handleBackClick} src={Back} alt="back" />
        Seller Profile
      </div>
      <div className="flex flex-col">
        <div className=" flex flex-row mt-5 gap-5 text-primary-text mx-5">
          <div className="w-20 h-20 bg-bg-inverse rounded-full"></div>
          <div className="flex flex-col justify-center">
            <h1 className="font-bold text-lg">
              {user?.firstname} {user?.lastname}
            </h1>
            <h1 className="text-gray-300">@{user?.username}</h1>
            
          </div>
        </div>


        <div className="flex flex-col text-primary-text px-5 mt-5">
          <h1 className="text-xl font-bold mb-2">About</h1>
          <p className="text-gray-300 text-sm">{user?.bio || 'No bio yet'}</p>
          

        </div>

        <div className="flex flex-col text-primary-text mt-5 border-b border-border-color pb-3">
          <div className="mx-5">

            <h1 className="text-xl font-bold">Personal Details</h1>
            
            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Email Address</h1>
              <p className="text-gray-300">{user?.email}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Join Date</h1>
              <p className="text-gray-300">{formattedDate}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Birthdate</h1>
              <p className="text-gray-300">{user?.birthdate || 'No birthdate yet'}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Gender</h1>
              <p className="text-gray-300">{user?.gender || 'No gender yet'}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Address</h1>
              <p className="text-gray-300">{user?.address || 'No address yet'}</p>
            </div>
          </div>
        </div>
        <div className="text-primary-text mx-5 mt-5">
          <div className="flex flex-row gap-3 mb-5">
            <img src={Items} alt="items-svg" />
            <h1 className="font-bold text-xl">{user?.username}'s Items</h1>
          </div>
          <div className="flex flex-col gap-3">

            {sellerItems?.map(i => (
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