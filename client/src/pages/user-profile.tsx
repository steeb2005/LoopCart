import Back from '../assets/back.svg'
import {useAppContext} from '../context/context'
import ItemBox from '../assets/items.svg'
import HeartClicked from '../assets/clickedHeart.svg'
import HeartDefault from '../assets/Heart.svg'
import { useNavigate, Link } from 'react-router-dom'
import { useItemLike } from '../hooks/handle-like'
import Edit from '../assets/edit.svg'
import {format} from "date-fns"
import { Skeleton } from '../components/ui/skeleton'
import { useEffect, useState } from 'react'
import Camera from '../assets/camera.svg'
import { useRef } from 'react'

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
            src={isLiked ? HeartClicked : HeartDefault} 
            alt="heart" className="filter-(--icon-filter) h-6"/>
          {likesCount}
        </div>
        
      </div>
    </Link>
  )
}








export default function UserProfile() {
  const navigate = useNavigate()
  const {user, items, getUsername, dataLoading, upload_avatar} = useAppContext()
  const [loadingAvatar, setLoadingAvatar] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [userItems, setUserItems] = useState<Item[]>([])
  const handleBackClick = () => {
    navigate(-1)
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getUserItems = () => {
      const filteredItems = items.filter(item => {
        return item.deleted === false && item.seller_id === user._id
      })
      setUserItems(filteredItems)
    }

    getUserItems()
  }, [user, items])

  const joinDate = new Date(user?.join_date)
  const formattedJoinDate = joinDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const username = getUsername(user?._id)

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
    user.address?.building,
    user.address?.street,
    user.address?.road,
    user.address?.neighbourhood,
    user.address?.suburb,
    user.address?.quarter,
    user.address?.village,
    user.address?.city,
    user.address?.city_district,
    user.address?.municipality,
    user.address?.state_district,
    user.address?.state,
  ].filter(Boolean)

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setLoadingAvatar(true)
    const file = e.target.files?.[0]
    if(!file.type.startsWith('image/')){
      setError('Please select a png, jpeg, webp file')
      return
    } 

    if(file.size > 2 * 1024 * 1024){
      setError('Please select a file less than 2mb')
      return
    }

    if(file){
      if(file.type.startsWith('image/')){
        setAvatarFile(file)
        setPreviewImageUrl(URL.createObjectURL(file))
      }else{
        setPreviewImageUrl(null)
      }
    }
    setLoadingAvatar(false)
  }

  const handleCancelPreview = () => {
    setError('')
    setAvatarFile(null)
    setPreviewImageUrl(null)
  }

  const handleSetAvatar = async () => {
    setLoadingAvatar(true)
    try{
      if(avatarFile){
        await upload_avatar(user._id, avatarFile)
      } 
    }catch{
      console.error('something went wrong in uploading file');
    }finally{
      setLoadingAvatar(false)
      setAvatarFile(null)
      setPreviewImageUrl(null)
    }
  }

  return (
    <div className='pb-2'> 
      <div className='head mx-5 flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
        <img onClick={handleBackClick} src={Back} alt="back" className='cursor-pointer filter-(--icon-filter)' />
        User Profile
      </div>

      

      <div className=" flex flex-row mt-5 gap-5 text-primary-text mx-5">
        <div className='relative group w-25 h-25'>
          <input 
            ref={fileInputRef}
            className='hidden'
            type="file" 
            onChange={handleFileChange}
            accept='image/png, image/jpeg, image/webp'
          />
            
          <div className="w-full h-full bg-bg-inverse ring ring-border-color rounded-full overflow-hidden items-center justify-center flex">
            { loadingAvatar ? (
              <div className='animate-spin h-6 w-6 rounded-full border-b border-border-color'></div>
            ) : (
              previewImageUrl ? (
              <img src={previewImageUrl} alt="avatar"/>
              ) : (
                user?.avatar_url ? (
                <img src={user.avatar_url} alt="avatar"/>) : (
                <span className='text-primary-text-inverse text-3xl font-bold'>
                  {user?.username.charAt(0).toUpperCase()}
                </span>)
              )
            )
            }
          </div>
          
          <button
            type="button" 
            onClick={handleTriggerFileInput}
            className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs gap-1 cursor-pointer "
          >
            <img src={Camera} alt="camera_svg" className="h-5 w-5" />
            <span>Edit</span>
          </button>
        </div>
        

        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-2xl">
            {user?.firstname.charAt(0).toUpperCase() + user?.firstname.slice(1)} {user?.lastname.charAt(0).toUpperCase() + user?.lastname.slice(1)}
          </h1>
          <h1 className="text-secondary-text">@{user?.username}</h1>
          
        </div>
      </div>
      {previewImageUrl && (
        <div className='flex flex-row gap-2 mx-5 mt-3 text-sm'>
          <button onClick={handleCancelPreview} className='cursor-pointer border border-border-color text-primary-text px-3 py-1 rounded-md '>
            Cancel
          </button>

          <button onClick={handleSetAvatar} className='cursor-pointer bg-bg-inverse border border-border-color text-primary-text-inverse px-3 py-1 rounded-md '>
            Save
          </button>
        </div>
      )}
      {error && (
        <div className='text-sm font-normal text-red-500 flex flex-row'>{error}</div>
      )}
       
      <div className="flex flex-col text-primary-text px-5 mt-5">
        <h1 className="text-xl font-bold mb-2">About</h1>
        <p className="text-secondary-text text-sm">{user?.bio || 'No bio yet'}</p>
      </div>

      <div className="flex flex-col text-primary-text mt-5 pb-3">
        <div className="mx-5">
          <div className='flex flex-row gap-6 items-center'>
            <h1 className="text-xl font-bold">Personal Details</h1>
            <Link
              to={`/edit-profile/${user?._id}`}>
              <img src={Edit} alt="edit" className='cursor-pointer filter-(--icon-filter)'/>
            </Link>
          </div>
          
          <div className="flex flex-col">
            <h1 className="font-semibold mt-5">Email Address</h1>
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


      <div className='flex flex-col text-primary-text pt-5 border-t border-border-color'>
        <div className='mx-5'>

          <div className="flex flex-row gap-3 mb-5">
            <img src={ItemBox} alt="items-svg" className='filter-(--icon-filter)'/>
            <h1 className="font-bold text-xl">My Items</h1>
          </div>
          <div className={`${userItems.length === 0 ? ' ' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'}`}>

            {(() => {
              
              if(userItems.length === 0){
                return(<div className="flex flex-row text-empty-state text-center justify-center font-light mb-5">You don't have any items</div>)
              }
              return(
                userItems.map((item: any) => (
                  <ItemCard 
                    key={item._id}
                    item_id={item._id}
                    title={item.title}
                    price={item.price}
                    seller_name={username}
                    likes={item.likes}
                  />
                )))
              })()
            }
          
          </div>
        </div>
      </div>

         
    </div>

  )
}