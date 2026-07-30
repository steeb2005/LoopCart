import { Link } from "react-router-dom"
import {useEffect, useState} from 'react'
import { useAppContext } from "../context/context";
import { Skeleton } from "../components/ui/skeleton";
import InboxIcon from "../assets/inbox.svg"
import { useSearchParams } from "react-router-dom";

// TODO
// - Implement a soft deletion in the backend
// - Add a delete button in the inbox
// - Add a delete button in the conversation


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


function InboxEntry({itemId, otherId, unreadCount, lastMessage, lastSender, read} : {key: string, itemId: string, otherId: string, unreadCount: number, lastMessage: string, lastSender: string, read: boolean}){

  const {items, getUsername, user} = useAppContext()
  const [item, setItem] = useState<Item | null>(null)
  const [otherUsername, setOtherUsername] = useState('')
  const [lastSenderUsername, setLastSenderUsername] = useState('')

  useEffect(() => {
    const foundItem = items?.find(item => item._id === itemId)
    setItem(foundItem || null) // If the item is not found, set the item to null
    setOtherUsername(getUsername(otherId))
    setLastSenderUsername(getUsername(lastSender))

  }, [items, itemId, otherId, getUsername, lastSender])

  if(!item){
    return(
      <div className='item-entry bg-bg-surface p-2 gap-2 rounded-md flex flex-row shrink-0 opacity-50'>
        <div className='image-entry min-h-20 min-w-20 bg-bg-inverse rounded-md' />
        <div className='data-entry w-full min-w-0 space-y-1 flex flex-col flex-1 justify-center text-primary-text'>
          <h1 className="font-bold text-secondary-text">Item no longer available</h1>
          <h1 className="font-light text-sm text-secondary-text">@{otherUsername}</h1>
          <p className="text-secondary-text text-sm line-clamp-1 font-light">
            This item has been removed
          </p>
        </div>
    </div>
    )
  }

  return(
    <Link 
      to={`/chat/${itemId}/${otherId}`}
      className='cursor-pointer item-entry bg-bg-surface p-2 gap-2 rounded-md flex flex-row shrink-0'>
      <div className='image-entry w-20 h-20 overflow-hidden border border-border-color bg-bg-canvas rounded-md flex items-center justify-center'>
        {item?.image ? (
          <img src={item?.image} alt="image" className="max-h-full max-w-full h-auto w-auto object-fill"/>
        ) : (
          <div className="h-full text-xs flex justify-center items-center">No image</div>
        )}
      </div>
      <div className='data-entry w-full min-w-0 space-y-1 flex flex-col flex-1 justify-center text-primary-text'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className="font-bold line-clamp-1">{item?.title}</h1>
          <h1 className="font-semibold">₱{item?.price.toLocaleString('en-US')}</h1>
        </div>
        <div className='flex flex-row justify-between'>
          <h1 className="font-light text-sm">@{otherUsername}</h1>
          <div className="px-2 rounded-full bg-bg-gray-surface flex items-center">
            <p className='font-light text-sm'>{item?.deleted ? 'Deleted' : item?.status.charAt(0).toUpperCase() + item?.status.slice(1)}</p>
          </div>
        </div>
        <div className='last-message items-center'>
          <p className={`text-secondary-text text-sm line-clamp-1 ${lastSender ===  user?._id ? 'font-light' : read ? 'font-light ' : 'font-bold'}`}>
            {unreadCount > 2 ? `${unreadCount} new messages` : `${lastSenderUsername}: ${lastMessage}`} 
          </p>
        </div>
      </div>
    </Link>
  )
}






function InboxSkeleton(){
  return(
    <Skeleton className="rounded-lg flex flex-row bg-bg-surface gap-1 items-center overflow-hidden p-2">
      <Skeleton className="h-20 w-20 bg-border-color"/>
      <div className="p-2 space-y-3 flex-1 flex flex-col">
        <Skeleton className="h-4 w-3/4 bg-border-color" />
        <Skeleton className="h-4 w-1/2 bg-border-color" />
        <Skeleton className="h-4 w-2/3 bg-border-color" />
      </div>
    </Skeleton>
  )
}














function Inbox(){
  const [searchParams, setSearchParams] = useSearchParams()
  const {inbox, items, user, dataLoading} = useAppContext()
  const [clickedFilter, setClickedFilter] = useState(searchParams.get('tab') ||'all')
  
  if(!user){
    console.error('no user id found');
    return
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
    b.unread_count! - a.unread_count! 
  )


  
  return(
    <div className="mx-5 py-2 lg:mx-30"> 

      <div className='head flex flex-row gap-5 pt-3 text-primary-text font-semibold'>
        <img src={InboxIcon} alt="inbox_svg" className="filter-(--icon-filter)" />
        Inbox
      </div>

      <div className='overflow-y-auto pr-1 grow normal-scrollbar items-section gap-2 flex flex-col mt-3'>
        <div className="flex flex-row justify-start gap-1 font-semibold mt-2 text-primary-text ">

          <div onClick={() => handleFilter('all')} className={` border-b ${clickedFilter === 'all' ? 'border-bg-inverse' :'border-transparent' } gap-2 flex flex-row justify-center text-center py-2 cursor-pointer items-center text-sm shrink-0 px-4`}> 
            All
            {allUnreadCount > 0 && 
            <div className='bg-bg-surface text-primary-text font-bold w-6 h-5 rounded-full text-center justify-center flex items-center text-xs '>
              {allUnreadCount > 9 ? '9+' : allUnreadCount}
            </div>}
          </div>

          <div onClick={() => handleFilter("buying")} className={`border-b ${clickedFilter === 'buying' ? 'border-bg-inverse' :'border-transparent' } gap-2 flex flex-row justify-center shrink-0 text-center py-2 px-4 cursor-pointer items-center text-sm`}>
            Buying 
            {buyingUnreadCount > 0 && 
            <div className='bg-bg-surface text-primary-text w-6 h-5 rounded-full text-center justify-center flex items-center text-xs font-bold '>
              {buyingUnreadCount > 9 ? '9+' : buyingUnreadCount}
            </div>}
          </div>
           
            
          <div onClick={() => handleFilter('selling')} className={` border-b ${clickedFilter === 'selling' ? 'border-bg-inverse' :'border-transparent' } gap-2 flex flex-row justify-center text-center py-2 px-4 shrink-0 cursor-pointer items-center text-sm`}> 
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
              <div className='text-empty-state text-center mt-10 px-10 justify-center font-light'>You don't have any messages</div>
            )
            : (
                sortedInbox?.map((entry: any) => (
                <InboxEntry 
                  key={entry._id} 
                  itemId={entry.item_id} 
                  otherId={entry.other_user} 
                  unreadCount={entry.unread_count} 
                  lastMessage={entry.last_message.text} 
                  lastSender={entry.last_message.sender_id}
                  read={entry.last_message.read}
                />
            )))
          )
        }
       
        
        
      </div>



    </div>
  )
}

export default Inbox