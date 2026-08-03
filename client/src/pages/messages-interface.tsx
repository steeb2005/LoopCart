import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { useAppContext } from "../context/context";
import InboxIcon from "../assets/inbox.svg"
import Send from '../assets/send.svg'
import TextareaAutosize from "react-textarea-autosize";
import CheckCircle from '../assets/check_circle.svg'
import ArrowRight from '../assets/ArrowRight.svg'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '../components/ui/skeleton'
import More from '../assets/more_horiz.svg'
import Trash from '../assets/trash.svg'
import { toast } from 'sonner'
import Back from '../assets/back.svg'



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

type ChatMessage = {
  sender_id: string;
  text: string;
}

type MessageData = {
  sender_id: string,
  receiver_id: string,
  item_id: string,
  text: string
}

      


function Message({isOwn, message}: {
  isOwn: boolean,
  message: string
}){
  return(
    <div className={`message-box flex flex-row ${isOwn ? 'justify-end' : 'justify-start'} text-primary-text`}>
      <div className={`flex flex-row gap-2 break-all items-center w-fit max-w-[70%] bg-bg-surface p-3 rounded-md ${isOwn ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
        {message}
      </div>
    </div>
  )
}




function InboxEntry({currentItemId, currentOtherUserId, unreadCount, lastMessage, lastSender, read, onSelectChat} : {
  key: string, 
  currentItemId: string, 
  currentOtherUserId: string, 
  unreadCount: number, 
  lastMessage: string, 
  lastSender: string, 
  read: boolean,
  onSelectChat: (newItemId: string, newUserId: string) => void
}){

  const {itemId, userId} = useParams()

  const {items, getUsername, user} = useAppContext()
  const [item, setItem] = useState<Item | null>(null)
  const [otherUsername, setOtherUsername] = useState('')
  const [lastSenderUsername, setLastSenderUsername] = useState('')

  useEffect(() => {
    const foundItem = items?.find(item => item._id === currentItemId)
    setItem(foundItem || null) // If the item is not found, set the item to null
    setOtherUsername(getUsername(currentOtherUserId))
    setLastSenderUsername(getUsername(lastSender))
  }, [items, currentItemId, currentOtherUserId, getUsername, lastSender])

  if(!item){
    return(
      <div className='item-entry  p-2 gap-2 rounded-md flex flex-row shrink-0 opacity-50'>
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
  const handleSetChat = () => {
    onSelectChat(currentItemId, currentOtherUserId)
  }

  return(
    <div
      onClick={handleSetChat}
      className={`${currentItemId === itemId && currentOtherUserId === userId ? 'bg-bg-surface' : ''} cursor-pointer hover:bg-bg-surface duration-100 item-entry p-2 gap-2 rounded-md flex flex-row shrink-0 text-sm`}>
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
    <div className="bg-bg-canvas rounded-xl lg:p-3 px-5 col-span-1 h-full flex flex-col min-h-0 lg:shadow-xl"> 
      <div className='head flex flex-row gap-5 pt-3 text-primary-text font-semibold '>
        <img src={InboxIcon} alt="inbox_svg" className="filter-(--icon-filter)" />
        Inbox
      </div>

      <div className='overflow-y-auto pr-5 grow scrollbar-thin scrollbar-thumb-bg-surface scrollbar-track-bg-canvas items-section gap-2 flex flex-col mt-3'>
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
              <div className='text-empty-state text-center mt-10 px-10 justify-center font-light text-sm'>You don't have any messages</div>
            )
            : (
                sortedInbox?.map((entry: any) => (
                <InboxEntry 
                  key={entry._id} 
                  currentItemId={entry.item_id} 
                  currentOtherUserId={entry.other_user} 
                  unreadCount={entry.unread_count} 
                  lastMessage={entry.last_message.text} 
                  lastSender={entry.last_message.sender_id}
                  read={entry.last_message.read}
                  onSelectChat={onSelectChat}
                />
            )))
          )
        }
      </div>
    </div>
  )
}





function Chat({userId, itemId}: {userId: string, itemId: string}){

  const navigate = useNavigate()

  const {getUsername, user, users, load_messages, send_message, fetch_conversation_id, read_messages, inbox, load_inbox, update_item_sold, load_items, get_item, delete_conversation} = useAppContext()
   
  const [item, setItem] = useState<Item | null>(null)
  const [otherUsername, setOtherUsername] = useState('')
  const [lineCount, setLineCount] = useState(1);
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState('')
  const [soldConfirmation, setSoldConfirmation] = useState(false)
  const [revertSold, setRevertSold] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [openDropdown, setOpenDropdown] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const chatWsRef = useRef<WebSocket | null>(null)
  const chatWsIntentionalClose = useRef(false)


  const messageEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null)
  
  const isSendingRef = useRef(false)
  const WS_URL = import.meta.env.VITE_WS_URL

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


  const isMobile = () => navigator.maxTouchPoints > 0 // checks if its mobile

  const scrollToBottom = () => {
    if(isMobile()){
       
      setTimeout(() => {        
        messageEndRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 50);
    }else{
      messageEndRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'});
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({block: 'end'});
      }, 300)
    }
  }

  useEffect(() => { // Scrolls to bottom upon opening
    const read_upon_bottom = async () => {
      if(!conversationId || !user?._id) return
      await read_messages(conversationId, user?._id)
      await load_inbox(user?._id)
    }
    
    scrollToBottom()
    read_upon_bottom()
  }, [messageList])

  
  useEffect(() => {
    setConversationId('')
    setMessageList([])
    setItem(null)
    const otheruser = users?.find(user => user._id === userId)
    setOtherUser(otheruser ?? null) 
    setOtherUsername(getUsername(userId ?? 'Unkown User'))   // Gets the username of the other person
   

    const findItem = async () => {
      if(!itemId) return

      const res = await get_item(itemId)
      if(res){
        setItem(res)
      }
    }
    

    const loadMessages = async () => {
      if(!user?._id || !itemId) return
      
      if(!userId){
        console.error('Sellers user id not found');
        return
      }
     
      if(!userId){
        console.error('Sellers user id not found');
        return
      }

      let conv_id = ''
      const result = await fetch_conversation_id(userId, itemId)
      if(result?.conversation_id){
        conv_id = result.conversation_id
        setConversationId(conv_id)          
        connectChatSocket(conv_id) // connects to chat socket
      }else{
        console.log('no conversation yet');
        setMessageList([])
        return
      }
      
      
      const msg = await load_messages(conv_id)
      setMessageList(msg?.messages || [])
      const hasUnreadMessages = inbox.some(entry => entry._id === conv_id && (entry?.unread_count ?? 0)  > 0)
      if(hasUnreadMessages){
        await read_messages(conv_id, user._id)
        await load_inbox(user._id)        
      }
    }

    const load = async () => {
      setIsLoading(true)
      try{
        await Promise.all([loadMessages(), findItem()])
      }finally{
        setIsLoading(false)
      }
    }
    
    load()
  }, [itemId, users, userId])


  const connectChatSocket = (conv_id: string) => {

    // Dont reconnect if already connected
    if(
      chatWsRef.current && chatWsRef.current.url.endsWith(conv_id) && (
      chatWsRef.current.readyState === WebSocket.OPEN ||
      chatWsRef.current.readyState === WebSocket.CONNECTING)
    ) return 
    
    // Close existing socket if open
    if(chatWsRef.current && chatWsRef.current.readyState !== WebSocket.CLOSED){
      chatWsRef.current.close()
    }  

    chatWsIntentionalClose.current = false

    const ws = new WebSocket(`${WS_URL}/ws/chat/${conv_id}`) // Change the URL in production
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if(data.type === 'new_message'){
        if(isSendingRef.current) return
        setMessageList(prev => [...prev, data.message])
      }
      if(data.type === "update_status"){
        setItem(prev => prev ? {...prev, status: data.status} : prev)
      }
    }
    console.log('connected to chat socket')
    ws.onclose = () => {
      if(chatWsIntentionalClose.current) return
      if(chatWsRef.current !== ws) return
      setTimeout(() => connectChatSocket(conv_id), 3000)
    }
    
    
    chatWsRef.current = ws
  }

  // Closes the websocket when leaving the chatroom
  useEffect(() => {
    return () => {
      console.log('closing chat socket')
      chatWsIntentionalClose.current = true
      
      if(chatWsRef.current){
        chatWsRef.current?.close()
        chatWsRef.current = null
      }
    }
  }, [itemId])
  
  
  const isOwn = (id: string) => {
    return id === user?._id
  }

  const handleSendMessage = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    messageInputRef.current?.focus();
    if(isSendingRef.current){
      console.error('messge still sending')
      return
    } 
    isSendingRef.current = true

    if(isSold) return // if the item is sold, do not allow sending messages
    
    setMessage('')

    const messageData = {
      sender_id: user?._id,
      receiver_id: userId,
      item_id: itemId,
      text: message.trim(),
    }

    
    const prev = messageList // rollback
    const optimisticMessage: ChatMessage = {
      sender_id: user!._id!,
      text: message.trim()
    }

    setMessageList((prev) => [...prev, optimisticMessage])

  
    try{
      const res = await send_message(messageData as MessageData) 
      if(res.success){
        if(res.conversation_id && !conversationId){
          setConversationId(res.conversation_id)
          connectChatSocket(res.conversation_id)
        }
        
        // NOTE: this is for updating the message list
        //const reset_msg = await load_messages(res.conversation_id || conversationId)
        //setMessageList(reset_msg.messages)
      }else{
        setMessageList(prev)
      }
    }catch{
      console.error('error in sending message: client')
      setMessageList(prev)
    }finally{
      isSendingRef.current = false
    }


  }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if(isMobile()) return

      e.preventDefault(); 
      
      if (message.trim().length > 0) {  
        handleSendMessage(e as any); 
      }
    }
  }
  
  
  const isSold = item?.status === 'sold'
  const role = userId === item?.seller_id ? 'buyer' : 'seller' 

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleSetToSold = async () => {
    if (!itemId || !userId || !item) {
      console.error("Missing required item data or route parameters.");
      return; 
    }
    const prev = item
    setSoldConfirmation(false)
    setRevertSold(false)
    try{
      setItem((prevItem) => {

        if(!prevItem) return null
        return {
          ...prevItem,
          status: isSold ? 'available' : 'sold'
        }
      })

      await update_item_sold(itemId, userId, item?.status, conversationId)
      toast.success('Updated item status', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: 'top-center'
      })
      await load_items()
    }catch{
      toast.error('Failed to update status', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: 'top-center'
      })
      setItem(prev)
      console.error('error in updating item status');
    }
  }

  const preventKeyboardDismiss = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
  }

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown)
  }

  const handleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete)
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
        }
      })
      await load_items()
      navigate('/inbox')
    }catch{
      toast.error('Failed to deleted conversation', {
        action: {
          label: '✕',

          onClick: () => {
            toast.dismiss
          }
        }
      })
      console.error('error in deleting conversation');
    }
  }


  if(inbox.length === 0 && !isLoading){
    return(
      <div className="flex flex-col h-full flex-1 col-span-2 rounded-xl p-3 bg-bg-canvas min-h-0 items-center justify-center">
        <h1 className="text-secondary-text text-sm">No Conversations</h1>
      </div>
    )
  }
    
  if(!item){
    return (
      <div className="flex flex-col h-full flex-1 col-span-2 rounded-xl p-3 bg-bg-canvas min-h-0 items-center justify-center">
        Loading Chat...
      </div>
    )
  }

 

  return (
    <>
      <div className="flex flex-col h-full flex-1 col-span-2 rounded-xl lg:p-3 bg-bg-canvas min-h-0 lg:shadow-xl">
        
        <div className={`top-0 sticky bg-bg-canvas m-0 `}>
          <div className='head flex flex-col text-primary-text font-semibold'>
            
            <div className="mx-5 pt-2 flex flex-row justify-between mb-3">
              <div className="flex flex-row gap-3 items-center">
                <img onClick={handleBackClick} src={Back} alt="back" className="lg:hidden cursor-pointer h-5 filter-(--icon-filter)"/>
                
                <div className="h-7 w-7 rounded-full bg-bg-canvas border border-border-color flex justify-center items-center overflow-hidden">
                  {
                    otherUser?.avatar_url ? (
                    <img src={otherUser.avatar_url} alt="avatar"/>
                    ) : (
                    <span className='text-primary-text text-sm justify-center items-center font-bold'>
                      {otherUser?.username.charAt(0).toUpperCase()}</span>
                    ) 
                  }
                </div>
                <h1>{otherUsername}</h1>
              </div>
              <div className='relative' ref={dropDownRef}>
                <img src={More} alt="more_svg" onClick={handleDropdown} className='filter-(--icon-filter) h-8 cursor-pointer'/>
                {openDropdown && (
                  <div className='absolute w-40 flex flex-row justify-center top-7 p-2 right-0 rounded-md bg-bg-canvas border border-border-color text-sm'>
                    <p className='cursor-pointer' onClick={handleConfirmDelete}>Delete Conversation</p>
                  </div>
                )}
              </div>
              
            </div>
            
            {/**/}
            <div className='item-entry border-border-color border-b border-t pt-2 pb-2 '>
               <div className="flex flex-row px-5 gap-2 items-center">
                <div className='image-entry flex justify-center items-center overflow-hidden border border-border-color h-20 w-20 shrink-0 bg-bg-canvas rounded-md'>
                  {item?.image ? (
                    <img src={item?.image} alt="image" className="object-contain" />
                  ) : (
                    <div className="h-full text-xs flex justify-center items-center">No image</div>
                  )}
                </div>

                <div className='data-entry flex flex-col w-full gap-1 text-primary-text'>
                  
                  <h1>₱{item?.price?.toLocaleString('en-US') ?? 'Unavailable'}</h1>
                  <h1 className="font-light line-clamp-1 text-sm">{item?.title}</h1>
                  <div className="flex flex-row gap-2">
                    <div className="font-light  bg-bg-surface rounded-md justify-center items-center py-2 px-3 text-xs">Status: {(item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1)) || 'Unavailable'}</div>                  
                    {
                      !otherUser?._id ? (
                        <div 
                          className={`bg-bg-surface text-secondary-text rounded-md py-2 px-3 text-xs `}          
                        >
                          {isSold ? 'Item Sold' : 'Mark as Sold'}
                        </div>
                      ) : (
                        item?.deleted ? (
                          <div className="font-light bg-bg-surface rounded-full justify-center items-center py-2 px-3 text-xs">Item Deleted</div>
                        ) : (
                          role === 'seller' ? (
                            <div 
                              className={`${isSold ? 'bg-bg-inverse text-primary-text-inverse' : 'bg-bg-surface text-primary-text'} cursor-pointer rounded-md py-2 px-3 text-xs `}
                              onClick={() => isSold ? setRevertSold(true): setSoldConfirmation(true)}
                            >
                              {isSold ? 'Item Sold' : 'Mark as Sold'}
                            </div>
                          ): (
                            <Link to={`/item/${itemId}`}>
                              <div className={`flex flex-row gap-1 items-center ml-2 border border-border-color  cursor-pointer rounded-full py-2 px-3 text-xs `}>
                                <p>View item</p>
                                <img src={ArrowRight} alt="arrow_right_svg" className="h-3 filter-(--icon-filter)"/>
                              </div>
                            </Link>
                          )
                        )
                      )
                    }
                  </div>
                </div>
              </div> 
            </div> {/**/}
          </div>
        </div>

        <div onMouseDown={preventKeyboardDismiss} className="px-3 scrollbar-thin scrollbar-track-bg-canvas scrollbar-thumb-bg-surface  chat-body grow overflow-y-auto overscroll-y-none items-section gap-1 pb-5 flex flex-col mt-3 ">
          
              
          {!isLoading && messageList.length > 0 ? (
            
            messageList.map((message) => (
            <Message  
              isOwn={isOwn(message.sender_id)} // Flips the message if its not the users
              message={message.text} 
            />
            ))
          ) : (
            <div className="flex flex-row justify-center items-center h-full">
              <h1 className="text-secondary-text">Start a conversation</h1>
            </div>
          )}

          {isLoading && (
            <div className="text-primary-text text-sm mt-auto text-center flex flex-row items-center justify-center gap-3 "> 
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-bg-inverse "></div>
              <div className="text-secondary-text">
                Loading messages...
              </div>
            </div>
          )}

          {
            !otherUser?._id ? (
              <div className="mt-auto">
                <div className="text-primary-text mt-5 text-center text-sm ">User has been deleted</div>
              </div>
            ) : (
              item?.deleted ? (
                <div className="mt-auto">
                  <div className="text-primary-text mt-5 text-center text-sm ">This item has been deleted. <br />conversation is closed.</div>
                </div>
              ) : (
                isSold && 
                <div className="mt-auto">
                  <div className="text-primary-text mt-5 text-center text-sm ">This item has been sold. <br />conversation is closed.</div>
                </div>
              )
            )
          }


          

          <div ref={messageEndRef}/>
        </div>

        <form
          onSubmit={handleSendMessage} 
          className="shrink-0 flex flex-row gap-2 items-center py-2 px-5 bg-bg-canvas"
        >
          <TextareaAutosize 
            ref={messageInputRef}
            rows={1}
            maxRows={5}
            value={message}
            placeholder="message"
            className={`scrollbar-none resize-none flex-1 bg-bg-surface text-primary-text px-4 py-2 ${lineCount > 1 ? 'rounded-2xl' : 'rounded-4xl'} duration-200 transition-all outline-0`}
            enterKeyHint="send"
            onChange={(e) => setMessage(e.target.value)}
            onHeightChange={(height) => setLineCount(height > 50 ? 2 : 1)}
            onKeyDown={handleKeyDown}
            disabled={isSold || item?.deleted || !otherUser?._id || !item?._id}
          />
          <button 
            type="submit"
            onClick={(e) => handleSendMessage(e as any)}
            className={`
              p-1 transition-all duration-200 ease-in-out
              ${message.length > 0 
                ? 'w-10' 
                : 'w-0 -ml-3'
              }
              overflow-hidden shrink-0
              cursor-pointer z-100
            `}  
            disabled={message.length === 0}
          >
            <img src={Send} alt="send" className="filter-(--icon-filter)"/> 
          </button>
        </form>

  
        {revertSold && (
          <div  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[90%] max-w-md bg-bg-canvas rounded-2xl shadow-2xl border border-border-color overflow-hidden">

              {/* Header with accent */}
              <div className="relative">
                <div className="px-6 pt-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <img src={CheckCircle} alt="check" className="filter-(--icon-filter)"/>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary-text">Revert Sale</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <h1 className="text-primary-text">Are you sure you want to revert this sale?</h1>
              </div>

              <div className="flex flex-row justify-end p-4 border-t border-border-color">
                <button 
                  className="text-primary-text mr-3 border border-border-color px-4 py-2 rounded-xl cursor-pointer"
                  onClick={() => setRevertSold(false)}
                >
                  Cancel
                </button>
                <button 
                  className="cursor-pointer text-primary-text-inverse px-4 py-2 rounded-xl bg-button-color border border-border-color"
                  onClick={handleSetToSold}
                >
                  Revert
                </button>
              </div>
              
            </div>
          </div>
        )}

        {soldConfirmation && (
          <div  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div 
              className="w-[90%] max-w-md bg-bg-canvas rounded-2xl shadow-2xl border border-border-color/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with accent */}
              <div className="relative">
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <img src={CheckCircle} alt="check" className="filter-(--icon-filter)"/>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary-text">Confirm Sale</h3>
                      </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 pb-4">
                <p className="text-primary-text text-sm mb-4">
                  Are you sure you want to mark this item as sold?
                </p>
                
                {/* Buyer info card */}
                <div className="p-4 bg-bg-canvas/50 rounded-xl border border-border-color/50">
                  <div className="flex items-center gap-3">
                    <div className="w-15 h-15 rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-bg-inverse">
                      {otherUser?.avatar_url ? (
                        <img src={otherUser?.avatar_url} alt="avatar" className="object-contain"/>
                      ) : (
                      <span className="text-accent font-semibold text-sm">
                        {otherUsername?.charAt(0).toUpperCase() || '?'}
                      </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-primary-text">Buyer</p>
                      <p className="text-primary-text font-medium">{otherUsername}</p>
                    </div>
                  </div>
                </div>

                {/* Item preview */}
                {item && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-bg-surface rounded-xl border border-border-color/30">

                    <div className="w-15 h-15 bg-bg-canvas border border-border-color justify-centeritems-center rounded-lg shrink-0 overflow-hidden">
                      {item?.image ? (
                        <img src={item?.image} alt="item" className="object-contain"/>
                      ) : (
                        <div className="h-full flex justify-center items-center text-xs text-secondary-text">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-light text-primary-text">{item.title}</p>
                      <p className="text-primary-text font-semibold text-sm">₱{item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4  flex flex-row gap-3 border-t border-border-color/50">
                <button
                  onClick={() => setSoldConfirmation(false)}
                  className="cursor-pointer flex-1 py-2.5 px-4 rounded-xl border border-border-color text-primary-text "
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetToSold}
                  className="cursor-pointer flex-1 py-2.5 px-4 rounded-xl border border-border-color bg-button-color text-primary-text-inverse font-medium flex items-center justify-center gap-2"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

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
    </>
  )
}




export default function MessagesInterface(){
  const {inbox, dataLoading} = useAppContext()
  const navigate = useNavigate()

  const { itemId, userId } = useParams()

  
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
      console.log('redirecting to most recent');
      navigate(`/messages/${mostRecent.item_id}/${mostRecent.other_user}`, {replace: true})
    }

  },[dataLoading, inbox, itemId, userId])

  const handleSelectChat = (newItemId: string, newUserId: string) => {
    navigate(`/messages/${newItemId}/${newUserId}`)
  }

  const hasSelection = itemId && userId

  return(
    <div className="flex flex-col flex-1 min-h-0 lg:p-2">
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-5 lg:mx-10 flex-1 min-h-0">
        <div className={hasSelection ? 'hidden lg:flex lg:flex-col lg:min-h-0' : 'flex flex-col min-h-0'}>
          <Inbox
            onSelectChat={handleSelectChat}
          />
        </div>

        <div className={hasSelection ? 'col-span-1 lg:col-span-2 flex flex-col min-h-0' : 'hidden lg:flex lg:col-span-2 lg:flex-col lg:min-h-0'}>

          <Chat
            itemId={itemId ?? '' }
            userId={userId ?? ''}
          />
        </div>
      </div>
    </div>
  )

}