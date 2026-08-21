import { useParams } from "react-router-dom"
import Back from '../assets/back.svg'
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/context"
import { useEffect, useState } from "react"
import Items from '../assets/items.svg' 
import { format } from "date-fns"
import { Skeleton } from "../components/ui/skeleton"
import Close from '../assets/close.svg'
import { ChevronDown } from "lucide-react"
import ItemsGrid from "../components/items-grid"
import Edit from '../assets/edit.svg'



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
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  join_date?: string;
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





export default function Likes(){
  const navigate = useNavigate()
  const {dataLoading, get_user, get_user_liked_items, user, likedItems} = useAppContext()
  const {username} = useParams() 

  const [sellerLoading, setSellerLoading] = useState(true)
  const [openPersonalInfo, setOpenPersonalInfo] = useState(false)

  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [displayImage, setDisplayImage] = useState(false)
  const [userLikes, setUserLikes] = useState<Item[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      try{
        const sellerProfile = await get_user(username!)
        if(sellerProfile?._id){
          setProfileUser(sellerProfile)
          if(sellerProfile._id === user?._id){
            if(userLikes.length === 0 && likedItems.length > 0){
              setUserLikes(likedItems)
            }
          }else{
            const items = await get_user_liked_items(sellerProfile._id)
            setUserLikes(items ?? [])
          }
        }else{
          setUserLikes([])
          setProfileUser(null)
        }      
        
      }catch{
        console.log('error in fetching user');
        setUserLikes([])
        setProfileUser(null)

      }finally{
        setSellerLoading(false)
      }
    }
    
    fetchUserData()
    
  }, [username, get_user_liked_items, get_user, likedItems])

  const date = new Date(profileUser?.join_date!) // sure there is a date
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  if(displayImage){
    return(
      <div className='fixed inset-0 z-100 bg-black/50 backdrop-blur-sm'>
        <img onClick={() => setDisplayImage(false)} src={Close} alt="close_svg" className='absolute top-3 right-3 cursor-pointer h-7 w-7'/>
        <div className='h-dvh w-full p-30 flex items-center justify-center'>
          {
            profileUser?.avatar_url ? (
              <img src={profileUser?.avatar_url} alt="avatar" referrerPolicy="no-referrer" className='object-contain h-full w-full' />
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
    profileUser?.address?.building,
    profileUser?.address?.street,
    profileUser?.address?.road,
    profileUser?.address?.neighbourhood,
    profileUser?.address?.suburb,
    profileUser?.address?.quarter,
    profileUser?.address?.village,
    profileUser?.address?.city,
    profileUser?.address?.city_district,
    profileUser?.address?.municipality,
    profileUser?.address?.state_district,
    profileUser?.address?.state,
  ].filter(Boolean)
  
  return(
    <>
      <div className="pb-2 lg:mt-10"> 
        <div className="flex flex-col gap-3 ">
          <div className='flex flex-col gap-5 mt-2 rounded-md p-5'>
            <div className="flex flex-row flex-1 gap-5 px-3  text-primary-text">
              <div className='relative group w-25 h-25 lg:w-30 lg:h-30 shrink-0'>
                <div className="w-full h-full bg-bg-inverse ring ring-border-color rounded-full overflow-hidden items-center justify-center flex">
                  {
                    profileUser?.avatar_url ? (
                    <img onClick={() => setDisplayImage(true)} src={profileUser.avatar_url} alt="avatar" referrerPolicy="no-referrer" className='cursor-pointer w-full h-full object-cover'/>
                    ) : (
                      <span className='text-primary-text-inverse text-5xl font-semibold'>
                        {
                          profileUser?.username ? (
                            profileUser?.username.charAt(0).toUpperCase()
                          ) : (
                            "U"
                          )
                        }
                      </span>
                    )
                  }
                </div>
              </div>
                
              <div className="flex flex-col justify-center line-clamp-1">
                <div className="flex flex-row items-center gap-2">
                  <h1 className="font-bold lg:text-2xl text-xl">
                    {capitalizeName(profileUser?.firstname)} {capitalizeName(profileUser?.lastname)}
                  </h1>
                  {user?._id === profileUser?._id && (
                    <img onClick={() => navigate(`/edit-profile/${user?._id}`)} src={Edit} alt="edit_svg" className="cursor-pointer filter-(--icon-filter)"/>
                  )}

                </div>
                <h1 className="text-secondary-text text-sm lg:text-lg">@{profileUser?.username}</h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col text-primary-text px-3 rounded-md mx-5">
            {profileUser?.bio && (
              <div className="flex flex-col mb-5">
                <h1 className="font-bold text-xl">About</h1>
                <p className="text-secondary-text text-sm">{profileUser?.bio || 'No bio yet'}</p>
              </div>
            )}
            <div 
              className="flex flex-row items-center gap-3 cursor-pointer"
              onClick={() => setOpenPersonalInfo(!openPersonalInfo)}
            >
              <h1 className="text-lg font-bold">Personal Details</h1>
              <ChevronDown 
                className={`transition-transform duration-300 ${
                  openPersonalInfo ? 'rotate-180' : ''
                }`}
              />
            </div>

            <div 
              className={`grid transition-all duration-300 ease-in-out ${
                openPersonalInfo 
                  ? 'grid-rows-[1fr] opacity-100 mt-5' 
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col text-primary-text">

                  <div className="flex flex-col">
                    <h1 className="font-semibold ">Join Date</h1>
                    <p className="text-secondary-text text-sm">{formattedDate}</p>
                  </div>

                  {profileUser?.birthdate && (  
                    <div className="flex flex-col">
                      <h1 className="font-semibold mt-5">Birthdate</h1>
                      <p className="text-secondary-text text-sm">{format(new Date(profileUser?.birthdate), 'MMMM d, yyyy')}</p>
                    </div>
                  )}

                  {profileUser?.gender && (
                    <div className="flex flex-col">
                      <h1 className="font-semibold mt-5">Gender</h1>
                      <p className="text-secondary-text text-sm">
                        {profileUser?.gender.charAt(0).toUpperCase() + profileUser?.gender.slice(1).toLowerCase()}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col">
                    <h1 className="font-semibold mt-5">Address</h1>
                    <p className="text-secondary-text text-sm">
                      {profileUser?.address ? displayAddress.join(' ') : 'No address yet'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={` w-full flex px-9 font-light border-b border-border-color/40 flex-row items-center  `}>
              <div 
                onClick={() => navigate(`/${profileUser?.username}`)}
                className={`cursor-pointer py-2 px-4 border-b-2 border-bg-canvas hover:text-primary-text/60`}>
                Items
              </div>
              <div 
                className={`cursor-pointer py-2 px-4 border-b-2 font-semibold border-button-color hover:text-primary-text/60 `}>
                Likes
              </div>
          </div>
          <div className="text-primary-text mx-5 mt-5">
            <div className="flex flex-row gap-3 mb-5">
              <img src={Items} alt="items-svg" className="filter-(--icon-filter)" />
              <h1 className="font-bold lg:text-lg text-md">{profileUser?.username}'s Likes</h1>
            </div>
            
            {/* Loads the grids  */}
            <ItemsGrid items={userLikes}/>
        
          </div>

        </div>

        
      </div>
    </>
  )
}