import { useParams } from "react-router-dom"
import Back from '../assets/back.svg'
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/context"
import { useEffect, useState } from "react"
import Items from '../assets/items.svg' 
import { format } from "date-fns"
import { Skeleton } from "../components/ui/skeleton"
import Close from '../assets/close.svg'
import ItemCard from "../components/item-card"

type AddressDetails = { 
  country?: string,
  country_code?: string,
  city?: string,
  suburb?: string,
  neighbourhood?: string,
  street?: string,
  road?: string,
  state_district?: string,
  postcode?: string,
  state?: string,
  city_district?: string,
  building?: string,
  municipality?: string,
  county?: string,
  amenity?: string, 
  landuse?: string,
  region?: string,
  village?: string,
  quarter?: string
}


type User = {
  _id?: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  join_date: string;
  avatar_url?: string | null;
  address?: AddressDetails | null 
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





export default function SellerProfile(){
  const navigate = useNavigate()
  const {users, items, getUsername, dataLoading} = useAppContext()
  const {userId} = useParams() 

  const [sellerLoading, setSellerLoading] = useState(true)

  const [user, setUser] = useState<User | null>(null)
  const [sellerItems, setSellerItems] = useState<Item[]>([])
  const [displayImage, setDisplayImage] = useState(false)

  useEffect(() => {
    const findUser = () => {
    
      const foundUser = users.find(user => user._id === userId)
      const filteredItems = items?.filter(item => item.seller_id === userId)
      setSellerItems(filteredItems)
      setUser(foundUser ?? null)
    }    
    findUser()
    setSellerLoading(false)
  }, [users, items])

  const handleBackClick = () => {
    navigate(-1)
  }

  const date = new Date(user?.join_date!) // sure there is a date
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  if(displayImage){
    return(
      <div className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'>
        <img onClick={() => setDisplayImage(false)} src={Close} alt="close_svg" className='absolute top-3 right-3 cursor-pointer h-7 w-7'/>
        <div className='h-dvh w-full p-30 flex items-center justify-center'>
          {
            user?.avatar_url ? (
              <img src={user?.avatar_url} alt="avatar" referrerPolicy="no-referrer" className='object-contain h-full w-full' />
            ) : (
              <span>No Image</span>
            )
          } 
        </div>
      </div>
    )
  }

  const capitalizeName = (name?: string) => {
    if(!name) return ' '
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
  
  
  if(sellerLoading || dataLoading){
    return(
      <div> 
        <div className='mx-5 head flex flex-row gap-8 pt-3 text-primary-text font-semibold '>
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

 
  const displayAddress = [
    user?.address?.building,
    user?.address?.street,
    user?.address?.road,
    user?.address?.neighbourhood,
    user?.address?.suburb,
    user?.address?.quarter,
    user?.address?.village,
    user?.address?.city,
    user?.address?.city_district,
    user?.address?.municipality,
    user?.address?.state_district,
    user?.address?.state,
  ].filter(Boolean)
  
  return(
    <div className="pb-2"> 
      <div className='mx-5 head flex flex-row gap-8 pt-3 text-primary-text font-semibold cursor-pointer'>
        <img onClick={handleBackClick} src={Back} alt="back" className="filter-(--icon-filter)"/>
        Seller Profile
      </div>
      <div className="flex flex-col gap-5">
        <div className="bg-bg-canvas flex flex-col gap-5 mt-5 mx-5 p-5 rounded-xl shadow-md">

          <div className="flex flex-row gap-5 text-primary-text ">
            <div className="w-25 h-25 lg:w-30 lg:h-30 ring ring-border-color bg-bg-inverse rounded-full items-center flex justify-center overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} onClick={() => setDisplayImage(true)} alt="avatar" referrerPolicy="no-referrer" className="h-full w-full cursor-pointer object-cover"/>
                ) : (
                <span className='text-primary-text-inverse text-3xl font-bold'>
                  {user?.username.charAt(0).toUpperCase()}
                </span>) }

            </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-bold text-2xl">
                {capitalizeName(user?.firstname)} {capitalizeName(user?.lastname)}
              </h1>
              <h1 className="text-secondary-text">@{user?.username}</h1>
            </div>
          </div>

          <div className="flex flex-col text-primary-text mt-5">
            <h1 className="text-xl font-bold mb-2">About</h1>
            <p className="text-secondary-text text-sm">{user?.bio || 'No bio yet'}</p>
          </div>
        </div>

        <div className="flex flex-col text-primary-text bg-bg-canvas p-5 rounded-xl shadow-md mx-5">
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
            <p className="text-secondary-text">{user?.address ? displayAddress.join(' ') : 'No address yet'}</p>
          </div>
        </div>

        <div className="text-primary-text mx-5 mt-5">
          <div className="flex flex-row gap-3 mb-5">
            <img src={Items} alt="items-svg" className="filter-(--icon-filter)" />
            <h1 className="font-bold text-xl">{user?.username}'s Items</h1>
          </div>

          <div className={`${sellerItems.length === 0 ? 'flex justify-center ' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'}`}>

            {sellerItems.length === 0 ? <div className="mb-2 text-center text-empty-state font-light mt-auto">No items yet</div> : sellerItems?.map(i => (
              <ItemCard
                key={i._id}
                item_id={i?._id!}
                image={i.image}
                title={i.title}
                price={i.price}
                seller_name={getUsername(i.seller_id)}
                likes={i.likes}/>
            ))}
          </div>

        </div>

      </div>

      
    </div>
  )
}