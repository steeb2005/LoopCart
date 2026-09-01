import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useAppContext } from "../services";
import InboxIcon from "../assets/inbox.svg"
import Chat from '../components/chat'
import { useNavigate, Link } from 'react-router-dom'
import { Skeleton } from '../components/ui/skeleton'
import Trash from '../assets/trash.svg'
import { MoreVerticalIcon } from "lucide-react"; 
import { toast } from "sonner";
import Close from '../assets/close.svg'
import { Spinner } from "../components/ui/spinner";
import { RelativeTime } from "../hooks/handle-relative-time";
import { InboxRelativeTime } from "../hooks/relative-time-inbox";
import Heart from '../assets/Heart.svg'
import Location from '../assets/location.svg'
import { useItemLike } from "../hooks/handle-like";
import HeartClicked from '../assets/clickedHeart.svg'



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

type Item = {
  _id?: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  description: string;
  created_at: string;
  status: string;
  sold_at?: string;
  seller_id: string;
  buyer_id?: string;
  image: string;
  likes: number;
  deleted?: boolean;
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





function InboxEntry({conversationId, currentItemId, currentOtherUserId, unreadCount, lastMessage, lastSender, read, onSelectChat, lastUpdated} : { 
  conversationId: string,
  currentItemId: string, 
  currentOtherUserId: string, 
  unreadCount: number, 
  lastMessage: string, 
  lastSender: string, 
  read: boolean,
  onSelectChat: (newItemId: string, newUserId: string) => void,
  lastUpdated: string
}){

  const {itemId, userId} = useParams()
  const {items, getUsername, user, users, load_items, delete_conversation} = useAppContext()
  const [item, setItem] = useState<Item | null>(null)
  const [otherUser, setOtherUser] = useState<User | null>(null) // Use this instead of using the get username fucntion
  const [otherUsername, setOtherUsername] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    const foundItem = items?.find(item => item._id === currentItemId)
    const foundUser = users.find(user => user._id === currentOtherUserId)
    setOtherUser(foundUser || null)
    setItem(foundItem || null) // If the item is not found, set the item to null

    setOtherUsername(getUsername(currentOtherUserId))
  }, [items, currentItemId, currentOtherUserId, getUsername, lastSender, users])

  const handleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete);
  }


  
  const handleDeleteConversation = async () => {
    try{
      if(!conversationId){
        setConfirmDelete(false)
        return
      } 
        
      await delete_conversation(conversationId)
      toast.success('Successfully deleted conversation', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: 'top-center'
      })
      await load_items()
      setConfirmDelete(false)
      navigate('/messages')
    }catch{
      toast.error('Failed to deleted conversation', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: 'top-center'
      })
      setConfirmDelete(false)
      console.error('error in deleting conversation');
    }
  }

  if(!item){
    return(
      <div className='item-entry  p-2  rounded-md flex flex-row shrink-0 items-center '>
        <div className="opacity-50 flex flex-row gap-2 items-center">

          <div className='image-entry h-15 w-15 bg-bg-inverse rounded-full '/>
          <div className='data-entry w-full min-w-0 space-y-1 flex flex-col flex-1 justify-center text-primary-text'>
            <h1 className="font-bold text-secondary-text text-sm">Item no longer available</h1>
            <p className="text-secondary-text text-sm line-clamp-1 font-light">
              This item has been removed
            </p>
          </div>
          <MoreVerticalIcon 
            className="cursor-pointer h-5" 
            onClick={handleConfirmDelete}
          />
        </div>
        {confirmDelete && (
          <div  className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-100">
            <div className="w-[90%] max-w-md bg-bg-canvas rounded-2xl shadow-2xl border border-border-color overflow-hidden">

              {/* Header with accent */}
              <div className="relative">
                <div className="px-6 pt-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <img src={Trash} alt="trash_svg" className="filter-(--icon-filter)"/>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary-text">Delete Conversation</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <h1 className="text-primary-text">Are you sure you want to delete this conversation?</h1>
              </div>

              <div className="flex flex-row justify-end p-4  border-t border-border-color">
                <button 
                  className="text-primary-text mr-3 border border-border-color px-4 py-2 rounded-xl cursor-pointer"
                  onClick={handleConfirmDelete}
                >
                  Cancel
                </button>
                <button 
                  className="cursor-pointer text-primary-text-inverse px-4 py-2 rounded-xl bg-button-color border border-border-color"
                  onClick={handleDeleteConversation}
                >
                  Delete
                </button>
              </div>
              
            </div>
          </div>
        )}
      </div>
    )
  }
  const handleSetChat = () => {
    onSelectChat(currentItemId, currentOtherUserId)
  }

  return(
    <div
      onClick={handleSetChat}
      className={`${currentItemId === itemId && currentOtherUserId === userId ? 'bg-bg-surface' : ''} cursor-pointer hover:bg-bg-surface duration-100 item-entry px-3 py-2  gap-2 rounded-md flex flex-row shrink-0 text-sm items-center`}>
      <div className="w-12 h-12 items-center justify-center overflow-hidden border bg-bg-inverse border-border-color rounded-full flex">
        {otherUser?.avatar_url ? (
          <img src={otherUser?.avatar_url} alt="avatar" referrerPolicy="no-referrer" className=" h-auto w-auto object-contain"/>
        ) : (
          <span className='text-primary-text-inverse text-xl font-bold justify-center flex items-center'>
            {otherUsername?.charAt(0).toUpperCase()}
          </span>
        )
        }
      </div>  
      
      <div className='data-entry w-full min-w-0 space-y-1 flex flex-col flex-1 justify-center text-primary-text'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className="font-bold line-clamp-1 text-ellipsis">{otherUsername}</h1>
        </div>
        <div className={`${lastSender ===  user?._id ? 'font-light' : read ? 'font-light ' : 'font-bold'} last-message items-center flex flex-row justify-between`}>
          <p className={`text-secondary-text text-xs line-clamp-1 text-ellipsis `}>
            {unreadCount > 2 ? `${unreadCount} new messages` : `${lastMessage}`} 
          </p>
          <p className="text-secondary-text text-xs whitespace-nowrap">
            {InboxRelativeTime(lastUpdated)}
          </p>
        </div>
        <div className='flex flex-row'>
          <div className="px-2 rounded-full border border-border-color flex items-center">
            <p className='font-light text-xs'>{item?.deleted ? 'Deleted' : item?.status.charAt(0).toUpperCase() + item?.status.slice(1)}</p>
          </div>
        </div>
      </div>

      <div className='image-entry max-w-15 max-h-15 overflow-hidden border border-border-color bg-bg-canvas rounded-md flex items-center justify-center'>
        {item?.image ? (
          <img src={item?.image} alt="image" className="max-h-full max-w-full h-auto w-auto object-contain"/>
        ) : (
          <div className="h-full text-xs flex justify-center items-center">No image</div>
        )}
      </div>

      
    </div>
  )
}


function InboxSkeleton(){
  return(
        <div className='item-entry p-2 gap-2 rounded-md flex flex-row shrink-0'>
      <Skeleton className='w-20 h-20 rounded-md shrink-0 bg-bg-surface'/>

      <div className='w-full min-w-0 space-y-2 flex flex-col flex-1 justify-center'>
        <div className='flex flex-row justify-between items-center gap-2'>
          <Skeleton className='h-4 w-2/5 bg-bg-surface'/>
          <Skeleton className='h-4 w-1/5 bg-bg-surface'/>
        </div>

        <div className='flex flex-row justify-between items-center gap-2'>
          <Skeleton className='h-3 w-1/4 bg-bg-surface'/>
          <Skeleton className='h-5 w-14 rounded-full bg-bg-surface'/>
        </div>

        <Skeleton className='h-3 w-3/4 bg-bg-surface'/>
      </div>
    </div>
  )
}



function Inbox({onSelectChat}:{
  onSelectChat: (itemId: string, userId: string) => void
}){
  const [searchParams, setSearchParams] = useSearchParams()
  const {inbox, items, user, dataLoading} = useAppContext()
  const [clickedFilter, setClickedFilter] = useState(searchParams.get('tab') ||'all')


  if(!user){
    console.error('no user id found');
    return null
  }
  
  useEffect(() => {
    const tab = searchParams.get('tab')
    if(tab){
      setClickedFilter(tab)
    }
  }, [searchParams])

  let buyingUnreadCount = 0
  let sellingUnreadCount = 0
  let allUnreadCount = 0
  


  const getUnreadCount = () => {
    const sellerFilter = inbox?.filter(entry => {
      const item = items?.find(i => i._id === entry.item_id)
      if(!item) return  // Guard for deleted items
      const isSeller = item.seller_id === user._id
      return isSeller
    })

    const buyerFilter = inbox?.filter(entry => {
      const item = items?.find(i => i._id === entry.item_id)
      if(!item) return // Guard for deleted items
      const isSeller = item.seller_id === user._id
      return !isSeller
    })

    sellerFilter.forEach(entry => {
      sellingUnreadCount += entry.unread_count!
    })

    buyerFilter.forEach(entry => {
      buyingUnreadCount += entry.unread_count!
    })

    inbox?.forEach(entry => {
      allUnreadCount += entry.unread_count!
    })

  }

  getUnreadCount()
    
  const getFilteredInbox = () => {
    if(!inbox){ // Empty inbox
      return []
    }
    if(clickedFilter === 'all'){
      return inbox    
    }

    return inbox?.filter(entry => {
      const item = items?.find(i => i._id === entry.item_id)
      if(!item) return  // Guard for deleted items
      const isSeller = item.seller_id === user._id

      if(clickedFilter === 'selling'){
        return isSeller
      }else if(clickedFilter === 'buying'){
        return !isSeller
      }
    })
  }


  const handleFilter = (id: string) => {
    setClickedFilter(id)
    setSearchParams({tab: id})
  }


  
  const filteredInbox = getFilteredInbox()

  // Sorts from most to least unread
  const sortedInbox = [...filteredInbox].sort((a, b) =>   
    new Date(b.last_updated!).getTime() - new Date(a.last_updated!).getTime()
  )


  return(
    <div className="bg-bg-canvas lg:rounded-xl col-span-1 h-full lg:py-2 flex flex-col min-h-0 lg:shadow-xl"> 
      <div className='head px-5 flex flex-row gap-5 pt-3 text-primary-text font-semibold '>
        <img src={InboxIcon} alt="inbox_svg" className="filter-(--icon-filter)" />
        Inbox
      </div>

      <div className='overflow-y-auto grow scrollbar-thin scrollbar-thumb-bg-surface scrollbar-track-bg-canvas items-section gap-2 flex flex-col mt-3'>
        <div className="flex px-3 flex-row justify-start gap-1 font-semibold mt-2 text-primary-text ">

          <div onClick={() => handleFilter('all')} className={` border-b ${clickedFilter === 'all' ? 'border-button-color' :'border-transparent' } gap-2 flex flex-row justify-center text-center py-2 cursor-pointer items-center text-sm shrink-0 px-4`}> 
            All
            {allUnreadCount > 0 && 
            <div className='bg-bg-surface text-primary-text font-bold w-6 h-5 rounded-full text-center justify-center flex items-center text-xs '>
              {allUnreadCount > 9 ? '9+' : allUnreadCount}
            </div>}
          </div>

          <div onClick={() => handleFilter("buying")} className={`border-b ${clickedFilter === 'buying' ? 'border-button-color' :'border-transparent' } gap-2 flex flex-row justify-center shrink-0 text-center py-2 px-4 cursor-pointer items-center text-sm`}>
            Buying 
            {buyingUnreadCount > 0 && 
            <div className='bg-bg-surface text-primary-text w-6 h-5 rounded-full text-center justify-center flex items-center text-xs font-bold '>
              {buyingUnreadCount > 9 ? '9+' : buyingUnreadCount}
            </div>}
          </div>
           
            
          <div onClick={() => handleFilter('selling')} className={` border-b ${clickedFilter === 'selling' ? 'border-button-color' :'border-transparent' } gap-2 flex flex-row justify-center text-center py-2 px-4 shrink-0 cursor-pointer items-center text-sm`}> 
            Selling 
            {sellingUnreadCount > 0 && 
            <div className='bg-bg-surface text-primary-text w-6 h-5 rounded-full text-center justify-center flex items-center text-xs font-bold '>
              {sellingUnreadCount > 9 ? '9+' : sellingUnreadCount}
            </div>}
          </div>
        </div>

        {/* Item Entry */}

        {dataLoading ? (
            Array.from({ length: 9 }).map((_, index) => (
              <InboxSkeleton key={index}/>
            ))
          ) : (
            filteredInbox.length === 0 ? (
              <div className='text-empty-state text-center mt-10 px-10 justify-center font-light text-sm'>You don't have any messages</div>
            )
            : (
                sortedInbox?.map((entry: any) => (
                <InboxEntry 
                  key={entry._id} 
                  conversationId={entry._id}
                  currentItemId={entry.item_id} 
                  currentOtherUserId={entry.other_user} 
                  unreadCount={entry.unread_count} 
                  lastMessage={entry.last_message.text} 
                  lastSender={entry.last_message.sender_id}
                  read={entry.last_message.read}
                  onSelectChat={onSelectChat}
                  lastUpdated={entry.last_updated}
                />
            )))
          )
        }

      </div>
    </div>
  )
}



function ItemDetails({itemId, item, otherUser, setOpenItemDetails}: {
  itemId: string,
  item: Item | null,
  otherUser: User | null,
  openItemDetails: boolean,
  setOpenItemDetails: React.Dispatch<React.SetStateAction<boolean>>
}){

  const {user, dataLoading} = useAppContext()
  const {isLiked, likesCount, handleLikeClick} = useItemLike(itemId, item?.likes || 0)

  const isSeller = item?.seller_id === user?._id

  if(dataLoading){
    return(
      <div className="flex flex-col h-full flex-1 col-span-2 rounded-xl p-3 bg-bg-canvas min-h-0 items-center justify-center">
        <Spinner/>
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
    <div className={`bg-bg-canvas rounded-xl col-span-1 h-dvh lg:py-2 overflow-y-auto flex flex-col lg:shadow-xl min-h-0 `}>
      <div className='head mb-5 flex flex-row pt-3 text-primary-text font-semibold px-5'>
        <div className="flex flex-row justify-between w-full">
          <h1>Details</h1>
          <div 
            className="bg-bg-surface p-1 rounded-full"
            onClick={() => setOpenItemDetails(false)}
            >
            <img src={Close} alt="close_svg" className="cursor-pointer h-4 w-4 filter-(--icon-filter)"/>
          </div>
        </div>
      </div>
      <div className="body overflow-y-auto scrollbar-thin scrollbar-thumb-bg-gray-surface px-5">

        <div className="flex flex-row justify-between w-full items-center mb-2">
          <div className="text-xs text-secondary-text font-light">
            {item?.created_at ? (
              RelativeTime(item?.created_at)
              ) : (
                'N/A'
              )
            }
          </div>
          <div className="border border-border-color px-2 rounded-2xl text-xs">
            {item?.status ? (
              item.status.charAt(0).toUpperCase() + item.status.slice(1)
            ) : ('N/A')}
          </div>
        </div>
        <div className="flex flex-row justify-between w-full items-center mb-2">
          <h1 
            className="font-semibold text-primary-text line-clamp-2 text-ellipsis"  
            >
            {item?.title}
            
          </h1>
          <h1 className='whitespace-nowrap font-semibold'>₱{item?.price.toLocaleString('en-US')}</h1>
        </div>
        <div className='border border-border-color f-full overflow-hidden bg-bg-canvas rounded-md flex justify-center flex-col items-center'>
          {item?.image ? (
              <img src={item.image} className="cursor-pointer w-full h-full object-contain" alt="image"/>
          ) : (
            <div className=" h-60 w-full text-sm flex-col text-center flex justify-center text-secondary-text">
              No Image
            </div>
          )}
        </div>
        <div className="text-sm flex flex-col gap-2 mt-5 max-h-full"> 

          <div className='flex flex-row items-center gap-2'>
            <img src={Location} alt="location" className='filter-(--icon-filter) h-6'/>
            <p className='text-secondary-text'>{otherUser?.address ? displayAddress.join(' ') : 'N/A' }</p>
          </div>

          <div className='flex flex-row gap-2 items-center'>
            <img onClick={handleLikeClick} src={isLiked ? HeartClicked : Heart} alt="heart" className='filter-(--icon-filter) cursor-pointer h-6'/>
            <h1 className='text-secondary-text'>{likesCount} Likes</h1>
          </div>

          <div className='flex flex-row gap-4 items-center'>
            <h1 className='text-secondary-text'>Condition</h1>
            <p className=''>{item?.condition}</p>
          </div>

          <div className='flex flex-col'>
            <h1 className='font-semibold text-lg gap-2'>Description</h1>
            <p>{item?.description}</p>
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold mb-3">Seller</h1>

            <Link  
              to={`${isSeller ? `/${user?.username}` : `/${otherUser?.username}`}`}
              className='flex flex-row gap-3 text-primary-text items-center mb-5 cursor-pointer'>
              <div className='bg-bg-inverse rounded-full  w-10 h-10 ring ring-border-color flex justify-center items-center overflow-hidden'>
                {isSeller ? (
                  user?.avatar_url ? (
                    <img src={user?.avatar_url} referrerPolicy="no-referrer" alt="avatar"/>
                  ) : (
                    <span className='text-primary-text-inverse text-xl font-semibold'>
                      {user?.username!.charAt(0).toUpperCase()}</span>
                  )
                ) : (
                 otherUser?.avatar_url ? (
                  <img src={isSeller ? user?.avatar_url! : otherUser?.avatar_url} referrerPolicy="no-referrer" alt="avatar"/>
                  ) : (
                    <span className='text-primary-text-inverse text-xl font-semibold'>
                      {isSeller ? user?.username!.charAt(0).toUpperCase() : otherUser?.username.charAt(0).toUpperCase()}</span>
                  ) 
                )}
                {/* {otherUser?.avatar_url ? (
                  
                  <img src={isSeller ? user?.avatar_url! : otherUser?.avatar_url} referrerPolicy="no-referrer" alt="avatar"/>
                  ) : (
                    <span className='text-primary-text text-xl font-bold'>
                      {isSeller ? user?.username!.charAt(0).toUpperCase() : otherUser?.username.charAt(0).toUpperCase()}</span>
                  ) 
                } */}
              </div>
              <h1>{
                isSeller ? user?.username : otherUser?.username}
              </h1>
            </Link>
          </div>
        </div>
      </div>
     
    </div>
  )

}






export default function MessagesInterface(){
  const {inbox, dataLoading, items, users} = useAppContext()
  const navigate = useNavigate()
  const { itemId, userId } = useParams()

  const selectedItem = items.find(i => i._id === itemId) ?? null
  const selectedOtherUser = users.find(u => u._id === userId) ?? null  

  const [status, setStatus] = useState(selectedItem?.status || 'unavailable')

  // Default to true if the screen is wider than 1024px
  const [openItemDetails, setOpenItemDetails] = useState(() => {
    if(window.innerWidth >= 1024){
      return true
    }
    return false
  })

  useEffect(() => {
    if(selectedItem){
      setStatus(selectedItem.status)
    }
  }, [selectedItem])

  useEffect(() => {
    if(itemId && userId){
      setOpenItemDetails(window.innerWidth >= 1024)
    }
  }, [itemId, userId])


  useEffect(() => {
    if(itemId && userId) {
      return 
    }  // URL already has a selection

    if(dataLoading) return

    if(!inbox || inbox.length === 0){
      console.error('no inbox data')  
      return
    } 
    
    const mostRecent = [...inbox].sort((a, b) => new Date(b.last_updated!).getTime() - new Date(a.last_updated!).getTime())[0]
    if(mostRecent && window.innerWidth > 1024){
      navigate(`/messages/${mostRecent.item_id}/${mostRecent.other_user}`, {replace: true})
    }

  },[dataLoading, inbox, itemId, userId])

  
  const handleSelectChat = (newItemId: string, newUserId: string) => {
    navigate(`/messages/${newItemId}/${newUserId}`)
  }

  const hasSelection = itemId && userId
  const chatVisibleOnMobile = hasSelection && !openItemDetails
  const itemDetailsVisible = hasSelection && openItemDetails
  
  
  const inboxClass = hasSelection 
  ? 'hidden lg:flex lg:flex-col lg:min-h-0 lg:w-75 lg:shrink-0' 
  : 'flex flex-col min-h-0 flex-1'

  const chatClass = `
    ${chatVisibleOnMobile ? 'flex flex-col min-h-0' : 'hidden'} 
    ${hasSelection ? 'lg:flex lg:flex-col lg:min-h-0' : 'lg:hidden'}
    flex-1 min-w-0
  `
  return(
    <div className="flex bg-bg-root flex-col flex-1 min-h-0 lg:mt-10 lg:p-2">
      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">

        <div className={inboxClass}>
          <Inbox
            onSelectChat={handleSelectChat}
          />
        </div>

        <div className={chatClass}>

          <Chat
            itemId={itemId ?? '' }
            userId={userId ?? ''}
            status={status}
            setStatus={setStatus}
            otherUser={selectedOtherUser}
            item={selectedItem}
            dataLoading={dataLoading}
            openItemDetails={openItemDetails}
            setOpenItemDetails={setOpenItemDetails}
          />
        </div>
        <div 
          className={`
            ${hasSelection ? 'hidden lg:block' : 'hidden'} 
            overflow-hidden transition-all duration-300 ease-in-out shrink-0
            ${itemDetailsVisible ? 'lg:w-80 lg:opacity-100' : 'lg:w-0 lg:opacity-0'}
          `}
        >
          <div className={`w-80 h-full flex flex-col min-h-0`}>

            <ItemDetails
              itemId={itemId ?? ''}
              item={selectedItem}
              otherUser={selectedOtherUser}
              openItemDetails={openItemDetails}
              setOpenItemDetails={setOpenItemDetails}
            />
          </div>
        </div>

        {/* Mobile only */}
        <div className={itemDetailsVisible ? 'flex flex-col min-h-0 lg:hidden' : 'hidden'}>
          <ItemDetails
              itemId={itemId ?? ''}
              item={selectedItem}
              otherUser={selectedOtherUser}
              openItemDetails={openItemDetails}
              setOpenItemDetails={setOpenItemDetails}
            />
        </div>
      </div>
    </div>
  )

}

