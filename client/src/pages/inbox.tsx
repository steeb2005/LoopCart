import { useNavigate } from "react-router-dom"
import Back from '../assets/back.svg'
import {useEffect, useState} from 'react'
import { useAppContext } from "../context/context";

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


function InboxEntry({itemId, otherId, unreadCount, lastMessage, lastSender, read} : {key: string, itemId: string, otherId: string, unreadCount: number, lastMessage: string, lastSender: string, read: boolean}){

  const navigate = useNavigate()
  const {items, getUsername, user} = useAppContext()
  const [item, setItem] = useState<Item | null>(null)
  const [otherUsername, setOtherUsername] = useState('')
  const [lastSenderUsername, setLastSenderUsername] = useState('')

  useEffect(() => {
    const foundItem = items?.find(item => item._id === itemId)
    setItem(foundItem)
    setOtherUsername(getUsername(otherId))
    setLastSenderUsername(getUsername(lastSender))

  }, [items, itemId, otherId, getUsername, lastSender])

  const handleItemClick = () => {
    navigate(`/chat/${itemId}/${otherId}`)
  }

  return(
    <div onClick={handleItemClick} className='item-entry bg-bg-surface p-2 gap-2 rounded-md flex flex-row shrink-0'>
      <div className='image-entry min-h-20 min-w-20 bg-bg-inverse rounded-md'>
        {/* Image */}
      </div>
      <div className='data-entry w-full min-w-0 flex flex-col flex-1  text-primary-text'>
        <div className='flex flex-row justify-between'>
          <h1 className="font-semibold">@{otherUsername}</h1>
          <p className='font-light'>{item?.status.charAt(0).toUpperCase() + item?.status.slice(1)}</p>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <h1>{item?.title}</h1>
          <h1 className="font-semibold">PHP {item?.price.toLocaleString('en-US')}</h1>
        </div>
        <div className='last-message items-center'>
          <p className={`line-clamp-1 ${lastSender ===  user._id ? 'font-light' : read ? 'font-light': 'font-semibold'}`}>
            {unreadCount > 2 ? `${unreadCount} new messages` : `${lastSenderUsername}: ${lastMessage}`} 
          </p>
        </div>
      </div>
    </div>
  )
}



















function Inbox(){
  const navigate = useNavigate()
  
  const {inbox, items, user, load_inbox} = useAppContext()
  const [clickedFilter, setClickedFilter] = useState('buying')
  
  useEffect(() => {
    load_inbox(user._id)
  }, [])


  const getFilteredInbox = () => {
    if(!inbox){ // Empty inbox
      return []
    }

    return inbox.filter(entry => {
      const item = items.find(i => i._id === entry.item_id)
      const isSeller = item.seller_id === user._id

      if(clickedFilter === 'selling'){
        return isSeller
      }else if(clickedFilter === 'buying'){
        return !isSeller
      }
    })
  }

  
  const handleBackClick = () => {
    navigate(-1)
  }
  
  const handleFilter = (id: string) => {
    setClickedFilter(id)
  }

  const filteredInbox = getFilteredInbox()

  return(
    <div className="mx-5 p-0 m-0 min-h-screen pb-5 flex flex-col"> 

      <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
        <img onClick={handleBackClick} src={Back} alt="back" />
        Inbox
      </div>

      <div className='overflow-y-auto pr-1 grow normal-scrollbar items-section gap-2 flex flex-col mt-3'>
        <div className="flex flex-row justify-around font-semibold mt-2 text-primary-text ">
          <div onClick={() => handleFilter("buying")} className={` border-b ${clickedFilter === 'buying' ? 'border-bg-inverse' :'border-bg-surface' }  w-full text-center py-2 cursor-pointer`}>
            Buying
          </div>
          <div onClick={() => handleFilter('selling')} className={` border-b ${clickedFilter === 'selling' ? 'border-bg-inverse' :'border-bg-surface' } w-full text-center py-2 cursor-pointer`}> 
            Selling
          </div>
        </div>

        {/* Item Entry */}
        {filteredInbox.length === 0 ? 
          (
            <div className='text-primary-text text-center mt-10 justify-center font-light'>You don't have any messages</div>
          )
          : (
            filteredInbox?.map((entry: any) => (
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
        }
        
      </div>



    </div>
  )
}

export default Inbox