import {useAppContext} from '../context/context'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Back from '../assets/back.svg'
import Goto from '../assets/goto.svg'
import Heart from '../assets/Heart.svg'
import Location from '../assets/location.svg'
import { useItemLike } from '../hooks/handle-like'
import HeartClicked from '../assets/clickedHeart.svg'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '../components/ui/skeleton'
import More from '../assets/more_horiz.svg'
import Trash from '../assets/trash.svg'
import Tag from '../assets/Tag.svg'
import Time from '../assets/clock.svg'
import { format } from 'date-fns'
import Close from '../assets/close.svg'
import { toast } from 'sonner'


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
  deleted: boolean;
}

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
  _id: string;
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


function ItemDetails(){
  const naviagte = useNavigate()
  const {id} = useParams() 
  const {items, user, getUsername, users, dataLoading, delete_item} = useAppContext()
  
  const [item, setItem] = useState<Item | null>(null)
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [sellerUsername, setSellerUsername] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [displayImage, setDisplayImage] = useState(false)
  const dropDownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if(dataLoading){
      setPageLoading(true)
      return
    }

    if(items.length === 0 && !dataLoading){
      setItem(null)
      setOtherUser(null)
      setPageLoading(false)
      setSellerUsername('Unknown Seller')
      return
    }

    const foundItem = items?.find(item => item._id === id)
    
    if(foundItem){
      setSellerUsername(getUsername(foundItem?.seller_id || 'Unkown Seller'))
      setItem(foundItem)

      const founduser = users?.find(user => user._id === foundItem?.seller_id)
      if(founduser){
        setOtherUser(founduser)
      }else{
        setOtherUser(null)
        console.error('User not found')
      }
      setPageLoading(false)

    }else{
      setItem(null)
      setOtherUser(null)
      setSellerUsername('Unknown Seller')
      console.error('Item not found')
    }
    
  }, [items, id, getUsername, users])


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(dropDownRef.current && !dropDownRef.current.contains(e.target as Node)){
        setOpenDropdown(false)
      }
    }

    if(openDropdown){
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  const isUserItem = item?.seller_id === user?._id

  const {isLiked, likesCount, handleLikeClick} = useItemLike(item?._id!, item?.likes || 0)

  const handleBackClick = () => {
    naviagte(-1)
  }
  

  const handleEditListing = () => {
    naviagte(`/sell-item`, {
      state: {
        id: item?._id,
        item: item,
        mode: 'edit'
      }
    })
  }

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown)
  }

  const handleDeleteItem = async () => {
    try{
      await delete_item(item?._id || '')
      toast.success('Successfully deleted item', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: "top-center"
      })
    }catch{
      toast.error('Failed to delete item', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: "top-center"
      })
    }finally{
      naviagte(-1)
    }
  }

  
  if(dataLoading || pageLoading){
    return(
      <div className="mx-5 p-0 m-0 pb-5 h-dvh flex flex-col lg:mx-30"> 
          <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
            <img src={Back} alt="back" className='cursor-pointer'/>
            Item details
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 h-full'>
            
            <Skeleton className='bg-bg-surface w-full h-full min-h-90'/>
            
            <div className='flex flex-col flex-1 h-full space-y-2'>
              <Skeleton className='bg-bg-surface w-3/4 h-5 mt-2'/>
              <Skeleton className='bg-bg-surface w-2/6 h-5 mt-2'/>
              <Skeleton className='bg-bg-surface w-3/4 h-5 mt-2'/>
              <Skeleton className='bg-bg-surface w-2/3 h-5 mt-2'/>
              <Skeleton className='bg-bg-surface w-2/3 h-5 mt-2'/>
              <Skeleton className='bg-bg-surface w-2/4 h-5 mt-2'/>
              <Skeleton className='bg-bg-surface w-2/6 h-5 mt-2'/>
              <Skeleton className='bg-bg-surface w-2/4 h-5 mt-2'/>
              <Skeleton className='bg-bg-surface w-2/4 h-5 mt-2'/>
              <Skeleton className='bg-bg-surface w-2/4 h-5 mt-2'/>
              <Skeleton className='bg-bg-surface w-2/6 h-5 mt-2'/>
              <Skeleton className='bg-bg-surface w-2/4 h-5 mt-2'/>
              <Skeleton className='bg-bg-surface w-2/3 h-10  mt-auto'/>
            </div>
            
          </div>
        </div>
    )
  }

  
  if(!item){
    return(
      <div className="mx-5 p-0 m-0 h-dvh pb-5 flex justify-center items-center">
        <div className='text-primary-text gap-2 flex flex-col'>
          <h1>Error 404 Item not found</h1>
          
          <div className='flex flex-row justify-start'>
            <Link to={'/home'} className='rounded-md p-2 cursor-pointer bg-bg-inverse text-primary-text-inverse font-semibold'>Back</Link>
          </div>
        </div>
      </div>
    )
  }


  if(item.deleted === true){
    return(
      <div className="mx-5 p-0 m-0 h-dvh pb-5 flex justify-center items-center">
        <div className='text-secondary-text gap-2 flex flex-col'>
          <h1>Item has been deleted</h1>
          <Link to={'/home'}>
            <button className='cursor-pointer rounded-md px-3 py-2 bg-bg-inverse text-primary-text-inverse font-semibold'>Back</button>
          </Link>
        </div>
      </div>
    )
  }

  if(displayImage){
    return(
      <div className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'>
        <img onClick={() => setDisplayImage(false)} src={Close} alt="close_svg" className='absolute top-3 right-3 cursor-pointer h-7 w-7'/>
        <div className='h-dvh w-full p-10 flex items-center justify-center'>
          <img src={item.image} alt="image" className='object-contain h-full w-full' />
        </div>
      </div>
    )
  }

  const displayAddress = [
    otherUser?.address?.building,
    otherUser?.address?.street,
    otherUser?.address?.road,
    otherUser?.address?.neighbourhood,
    otherUser?.address?.suburb,
    otherUser?.address?.quarter,
    otherUser?.address?.village,
    otherUser?.address?.city,
    otherUser?.address?.city_district,
    otherUser?.address?.municipality,
    otherUser?.address?.state_district,
    otherUser?.address?.state,
  ].filter(Boolean)

  return(
    <>
        <div className='mx-5 py-2 lg:mx-30'> 
          <div className='head items-center flex flex-row justify-between text-primary-text font-semibold'>
            <div className='flex flex-row gap-8'>
              <img onClick={handleBackClick} src={Back} alt="back" className='cursor-pointer filter-(--icon-filter)'/>
              Item details
            </div>

            {isUserItem && (    // Only allows the user to delete their own item
              <div className='relative' ref={dropDownRef}>
                <img src={More} alt="more_svg" onClick={handleDropdown} className='filter-(--icon-filter) h-8 cursor-pointer'/>
                {openDropdown && (
                  <div className='absolute w-30 flex flex-row justify-center top-7 p-2 right-0 rounded-md bg-bg-canvas border border-border-color text-sm'>
                    <p className='cursor-pointer' onClick={() => setConfirmDelete(true)}>Delete item</p>
                  </div>
                )}
              </div>
            )}
          </div>
          

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
            <div className='border border-border-color f-full overflow-hidden bg-bg-canvas rounded-md flex justify-center flex-col items-center'>
              {item?.image ? (
                <img onClick={() => setDisplayImage(true)} src={item.image} className="cursor-pointer w-full h-full object-contain" alt="image"/>
              ) : (
                <div className=" h-full flex justify-center items-center text-secondary-text">
                  No Image
                </div>
              )}
            </div>

              
            <div className='flex flex-col gap-3 '>   

              <h1 className='font-semibold text-xl'>{item.title}</h1>

              <div className='flex flex-row'>
                <div className='bg-bg-surface rounded-md text-primary-text px-3 py-1 text-sm'>
                  {item?.status ?? 'N/A'}
                </div>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <img src={Tag} alt="tag_svg" className='filter-(--icon-filter) h-5'/>
                <h1 className='font-semibold text-xl'>₱{item.price.toLocaleString('en-US')}</h1>
              </div>

              <div className='flex flex-row items-center gap-2'>
                <img src={Time} alt="time_svg" className='filter-(--icon-filter) h-6'/>
                <h1 className='text-secondary-text'>{format(item.created_at, 'MMMM, d, yyyy')}</h1> {/* Replace with actual time */}
              </div>

              <div className='flex flex-row gap-2'>
                <img onClick={handleLikeClick} src={isLiked ? HeartClicked : Heart} alt="heart" className='filter-(--icon-filter) cursor-pointer'/>
                <h1 className='text-secondary-text'>{likesCount} Likes</h1>
              </div>

              <div className='flex flex-row items-center gap-2'>
                <img src={Location} alt="location" className='filter-(--icon-filter) h-6'/>
                <p className='text-secondary-text'>{otherUser?.address ? displayAddress.join(' ') : 'N/A' }</p>
              </div>

              <div className='flex flex-row gap-4 items-center'>
                <h1 className='text-secondary-text text-lg'>Condition</h1>
                <p className=''>{item.condition}</p>
              </div>

 
              <div className='flex flex-col'>
                <h1 className='font-semibold text-xl gap-2'>Description</h1>
                <p className=''>{item.description}</p>
              </div>


              <div className='items-center flex flex-row text-primary-text text-xl justify-between font-semibold mt-5'>
                <div className='flex items-center'>
                  <h1>Seller</h1>
                  <img src={Goto} alt="goto" className='h-8 filter-(--icon-filter)'/>
                </div>
              </div>
                

              <Link  
                to={`${isUserItem ? `/user-profile` : `/users/${item.seller_id}`} `}
                className='flex flex-row gap-3 text-primary-text items-center mb-5 cursor-pointer'>
                <div className='bg-bg-inverse rounded-full w-10 h-10 ring ring-border-color flex justify-center items-center overflow-hidden'>
                  {otherUser?.avatar_url ? (<img src={otherUser.avatar_url} alt="avatar"/>) : (<span className='text-primary-text-inverse text-xl font-bold'>{otherUser?.username.charAt(0).toUpperCase()}</span>) }
                </div>
                <h1>@{sellerUsername}</h1>
              </Link>
              
              {isUserItem ? (
                <button onClick={handleEditListing} className='cursor-pointer justify-center flex mt-auto flex-row items-center bg-button-color rounded-md p-2 text-primary-text-inverse font-semibold w-full'>
                  Edit Listing
                </button>
              ) : (item?.sold_at ? (
                <button className='cursor-pointer justify-center flex mt-auto flex-row items-center bg-button-color rounded-md p-2 text-primary-text-inverse font-semibold w-full'>
                  Item Sold
                </button>
              ) : (
                <Link
                  to={`/chat/${item?._id}/${item?.seller_id}`}  
                >
                  <button className='justify-center cursor-pointer flex mt-auto flex-row bg-button-color rounded-md p-2 text-primary-text-inverse font-semibold w-full'> 
                    Make an Offer
                  </button>
                </Link>
                
                )
              )}
            </div>
          </div>

          
          

          {confirmDelete && (
          <div  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[90%] max-w-md bg-bg-canvas rounded-2xl shadow-2xl border border-border-color overflow-hidden">

              {/* Header with accent */}
              <div className="relative">
                <div className="px-6 pt-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <img src={Trash} alt="trash_svg" className="filter-(--icon-filter)"/>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary-text">Delete Item</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <h1 className="text-primary-text">Are you sure you want to delete this item?</h1>
              </div>

              <div className="flex flex-row justify-end p-4  border-t border-border-color">
                <button 
                  className="text-primary-text mr-3 border border-border-color px-4 py-2 rounded-xl cursor-pointer"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
                <button 
                  className="cursor-pointer text-primary-text-inverse px-4 py-2 rounded-xl bg-button-color border border-border-color"
                  onClick={handleDeleteItem}
                >
                  Delete
                </button>
              </div>
              
            </div>
          </div>
        )}
          
        </div>    

    </>
  )    
}

export default ItemDetails