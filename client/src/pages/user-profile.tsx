import Back from '../assets/back.svg'
import {useAppContext} from '../context/context'
import ItemBox from '../assets/items.svg'
import { useNavigate, Link } from 'react-router-dom'
import Edit from '../assets/edit.svg'
import {format} from "date-fns"
import { Skeleton } from '../components/ui/skeleton'
import { useEffect, useState } from 'react'
import Close from '../assets/close.svg'
import ItemCard from '../components/item-card'


// TODO
// - Adjust pages for the root background.
// - Remove the repeatable components from pages and put them in the components folder
// - Test the pages for mobile responsiveness


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







export default function UserProfile() {
  const navigate = useNavigate()
  const {user, items, dataLoading} = useAppContext()
  const [userItems, setUserItems] = useState<Item[]>([])
  const [displayImage, setDisplayImage] = useState(false)
  const handleBackClick = () => {
    navigate(-1)
  }


  useEffect(() => {
    const getUserItems = () => {
      const filteredItems = items.filter(item => {
        return item.deleted === false && item.seller_id === user?._id
      })
      setUserItems(filteredItems)
    }

    getUserItems()
  }, [user, items])

  const joinDate = new Date(user?.join_date!)
  const formattedJoinDate = joinDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const capitalizeName = (name?: string) => {
    if(!name) return ' '
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  if(displayImage){
    return(
      <div className='fixed inset-0 z-100 bg-black/50 backdrop-blur-sm'>
        <img onClick={() => setDisplayImage(false)} src={Close} alt="close_svg" className='absolute top-3 right-3 cursor-pointer h-7 w-7'/>
        <div className='h-dvh w-full p-10 flex items-center justify-center'>
          {
            user?.avatar_url ? (
              <img src={user?.avatar_url} alt="avatar"  className='object-contain h-full w-full' />
            ) : (
              <div className="h-full flex justify-center items-center text-secondary-text">
                No Image
              </div>
            )
          }
        </div>
      </div>
    )
  }

  if(dataLoading){
    return(
      <div className="p-0 m-0 min-h-screen pb-5 flex flex-col "> 
        

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

 

  return (
    <div className='pb-2'> 

      <div className='head mx-5 flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
        <img onClick={handleBackClick} src={Back} alt="back" className='cursor-pointer filter-(--icon-filter)' />
        User Profile
      </div>
      <div className='flex flex-col gap-5 mt-5'>

        <div className='flex flex-col gap-5 shadow-md rounded-md bg-bg-canvas mx-5 p-5'>
          <div className="flex flex-row flex-1 gap-5 text-primary-text  ">
            <div className='relative group w-25 h-25 lg:w-30 lg:h-30 shrink-0'>
              <div className="w-full h-full bg-bg-inverse ring ring-border-color rounded-full overflow-hidden items-center justify-center flex">
                {
                  user?.avatar_url ? (
                  <img onClick={() => setDisplayImage(true)} src={user.avatar_url} alt="avatar" referrerPolicy="no-referrer" className='cursor-pointer w-full h-full object-cover'/>
                  ) : (
                    <span className='text-primary-text-inverse text-5xl font-semibold'>
                      {
                        user?.username ? (
                          user?.username.charAt(0).toUpperCase()
                        ) : (
                          "U"
                        )
                      }
                    </span>
                  )
                }
              </div>
            </div>
              
            <div className="flex flex-col justify-center">
              <h1 className="font-bold text-2xl">
                {capitalizeName(user?.firstname)} {capitalizeName(user?.lastname)}
              </h1>
              <h1 className="text-secondary-text ">@{user?.username}</h1>
            </div>
          </div>
          
        </div>




        <div className='flex flex-col bg-bg-canvas mx-5 rounded-md p-5 shadow-md'>
          
          <div className="flex flex-col text-primary-text  pb-3">
            <div className="flex flex-col text-primary-text ">
              <h1 className="text-xl font-bold mb-2">About</h1>
              <p className="text-secondary-text text-sm">{user?.bio || 'No bio yet'}</p>
            </div>
            <div className='flex flex-row gap-6 items-center mb-3 mt-5'>
              <h1 className="text-xl font-bold">Personal Details</h1>
              <Link
                to={`/edit-profile/${user?._id}`}>
                <img src={Edit} alt="edit" className='cursor-pointer filter-(--icon-filter)'/>
              </Link>
            </div>
            
            <div className="flex flex-col">
              <h1 className="font-semibold">Email Address</h1>
              <p className="text-secondary-text">{user?.email}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Join Date</h1>
              <p className="text-secondary-text">{formattedJoinDate}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Birthdate</h1>
              <p className="text-secondary-text">{user?.birthdate ? format(new Date(user?.birthdate), 'MMMM d, yyyy')  : 'No birthdate yet'}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Gender</h1>
              <p className="text-secondary-text">{user?.gender ? (user?.gender.charAt(0).toUpperCase() + user?.gender.slice(1)) : 'No gender yet'}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Address</h1>
              <p className="text-secondary-text">{user?.address ? displayAddress.join(' ') : 'No address'}</p>
            </div>
          </div>
        </div>

        <div className='p-3 rounded-md flex flex-col text-primary-text pt-5'>
          <div className='mx-5'>

            <div className="flex flex-row gap-3 mb-5">
              <img src={ItemBox} alt="items-svg" className='filter-(--icon-filter)'/>
              <h1 className="font-bold text-xl">My Items</h1>
            </div>
            <div className={`${userItems.length === 0 ? ' ' : ' grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'}`}>

              {(() => {
                
                if(userItems.length === 0){
                  return(<div className="flex flex-row text-empty-state text-center justify-center font-light mb-5">You don't have any items</div>)
                }
                return(
                  userItems.map((item: any) => (
                    <ItemCard 
                      key={item._id}
                      image={item.image}
                      item_id={item._id}
                      title={item.title}
                      price={item.price}
                      seller_name={user?.username ?? 'Unknown Seller'}
                      likes={item.likes}
                    />
                  )))
                })()
              }
            
            </div>
          </div>
        </div>


      </div>
     
      



         
    </div>

  )
}