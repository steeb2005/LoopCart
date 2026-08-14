import More from '../assets/more_horiz.svg'
import Trash from '../assets/trash.svg'
import { toast } from 'sonner'
import Back from '../assets/back.svg'
import Send from '../assets/send.svg'
import TextareaAutosize from "react-textarea-autosize";
import CheckCircle from '../assets/check_circle.svg'
import ArrowRight from '../assets/ArrowRight.svg'
import { useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { useAppContext } from '../context/context'
import { Spinner } from './ui/spinner'
import { MoreVerticalIcon } from 'lucide-react'

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



function Message({isOwn, message}: {
  isOwn: boolean,
  message: string
}){

  const [onHover, setOnHover] = useState(false)
  const handleOnHover = () => {
    setOnHover(!onHover)
  }


  
  return(
    <div
      onMouseEnter={handleOnHover}
      onMouseLeave={handleOnHover} 
      className={`message-box flex flex-row ${isOwn ? 'justify-end' : 'justify-start'} items-center text-primary-text gap-3`}>
      {isOwn && (
        <MoreVerticalIcon            
          className={` bg-bg-surface rounded-full p-0.5 cursor-pointer ${onHover ? 'flex' : 'hidden'}`}/>
      )}
      <div    
        className={`flex cursor-pointer flex-row gap-2 break-all items-center w-fit max-w-[70%] bg-bg-surface p-3 rounded-md ${isOwn ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
        {message}
      </div>
      {!isOwn && (
        <MoreVerticalIcon 
          className={` bg-bg-surface rounded-full p-0.5 cursor-pointer ${onHover ? 'flex' : 'hidden'}`}/>
      )}
      
    </div>
  )
}





export default function Chat({userId, itemId, item, otherUser, dataLoading, status, setStatus, openItemDetails, setOpenItemDetails}: {
  userId: string, 
  itemId: string,
  item: Item | null,
  otherUser: User | null,
  dataLoading: boolean,
  status: string,
  setStatus: React.Dispatch<React.SetStateAction<string>>,
  openItemDetails: boolean,
  setOpenItemDetails: React.Dispatch<React.SetStateAction<boolean>>
}){

  const navigate = useNavigate()

  const {user, users, load_messages, send_message, fetch_conversation_id, read_messages, inbox, load_inbox, update_item_sold, load_items, delete_conversation} = useAppContext()
   
  const [lineCount, setLineCount] = useState(1);
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState('')
  const [soldConfirmation, setSoldConfirmation] = useState(false)
  const [revertSold, setRevertSold] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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
        await Promise.all([loadMessages()])
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
        setStatus(data.status)
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

  
  const isSold = status === 'sold'
  const role = userId === item?.seller_id ? 'buyer' : 'seller' 

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleSetToSold = async () => {
    if (!itemId || !userId || !item) {
      console.error("Missing required item data or route parameters.");
      return 
    }

    if(status === 'unavailable'){
      console.error('item status is unavailable')
      return
    }
    const prev = item?.status
    setSoldConfirmation(false)
    setRevertSold(false)
    try{
      setStatus(isSold ? 'available' : 'sold')

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
      setStatus(prev)
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


  if(dataLoading){
    return(
      <div className="flex flex-col h-full flex-1 col-span-2 rounded-xl p-3 bg-bg-canvas min-h-0 items-center justify-center">
        <Spinner/>
      </div>
    )
  }

  if(!userId && !itemId && inbox.length === 0 && !isLoading ){
    return(
      <div className="flex flex-col h-full flex-1 col-span-2 rounded-xl p-3 bg-bg-canvas min-h-0 items-center justify-center">
        <h1 className="text-secondary-text text-sm">No Conversations</h1>
      </div>
    )
  }
    
  if(!item){
    return (
      <div className="flex flex-col h-full flex-1 col-span-2 rounded-xl p-3 bg-bg-canvas min-h-0 items-center justify-center">
        Item not found
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
                    <img src={otherUser.avatar_url} alt="avatar" referrerPolicy="no-referrer"/>
                    ) : (
                    <span className='text-primary-text text-sm justify-center items-center font-bold'>
                      {otherUser?.username.charAt(0).toUpperCase()}</span>
                    ) 
                  }
                </div>
                <h1>{otherUser?.username}</h1>
              </div>
              <div className='lg:flex flex-row gap-3 items-center hidden '>
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
                      role === 'seller' && (
                        <div 
                          className={`${isSold ? 'border border-border-color text-primary-text' : 'bg-button-color text-primary-text-inverse'} cursor-pointer rounded-xl py-2 px-3 text-xs `}
                          onClick={() => isSold ? setRevertSold(true): setSoldConfirmation(true)}
                        >
                          {isSold ? 'Item Sold' : 'Mark as Sold'}
                        </div>
                      )
                    )
                  )
                }  

                <div onClick={() => setOpenItemDetails(true)} className={`${openItemDetails ? 'hidden' : 'flex'} flex-row gap-1 items-center bg-bg-surface  cursor-pointer rounded-full py-2 px-3 text-xs `}>
                  <p>View item</p>
                  <img src={ArrowRight} alt="arrow_right_svg" className="h-3 filter-(--icon-filter)"/>
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
              
            </div>
            
            {/**/}
            <div className='lg:hidden item-entry border-border-color border-b border-t pt-2 pb-2 '>
               <div className="flex flex-row px-5 gap-2 items-center">
                <div className='image-entry max-w-20 max-h-20 overflow-hidden border border-border-color bg-bg-canvas rounded-md flex items-center justify-center'>
                  {item?.image ? (
                    <img src={item?.image} alt="image" className="max-h-full max-w-full h-auto w-auto object-contain"/>
                  ) : (
                    <div className="h-full text-xs flex justify-center items-center">No image</div>
                  )}
                </div>

                <div className='data-entry flex flex-col gap-1 w-full text-primary-text'>
                  
                  <div className="flex flex-row justify-between items-center">
                    <h1>₱{item?.price?.toLocaleString('en-US') ?? 'Unavailable'}</h1>
                    <div className="font-light flex border rounded-md justify-center items-center grow-0 text-xs px-2 py-1">
                      {(item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1)) || 'Unavailable'}
                    </div>  
                  </div>
                  <h1 className="font-light line-clamp-1 text-sm">{item?.title}</h1>
                  <div className="flex flex-row gap-2">
                                    
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
                          role === 'seller' && (
                            <div 
                              className={`${isSold ? 'border border-border-color text-primary-text' : 'bg-button-color text-primary-text-inverse'} cursor-pointer rounded-xl py-2 px-3 text-xs `}
                              onClick={() => isSold ? setRevertSold(true): setSoldConfirmation(true)}
                            >
                              {isSold ? 'Item Sold' : 'Mark as Sold'}
                            </div>
                          )
                        )
                      )
                    }
                    <div onClick={() => setOpenItemDetails(true)} className={`flex flex-row gap-1 items-center  bg-bg-surface  cursor-pointer rounded-full py-1.5 px-3 text-xs `}>
                      <p>View item</p>
                      <img src={ArrowRight} alt="arrow_right_svg" className="h-3 filter-(--icon-filter)"/>
                    </div>
                  </div>
                </div>
              </div> 
            </div> 
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
              <h1 className="text-secondary-text text-sm">Start a conversation</h1>
            </div>
          )}

          {isLoading && (
            <div className="text-primary-text text-sm mt-auto text-center flex flex-row items-center justify-center gap-3 "> 
              <Spinner/>
              <div className="text-secondary-text">
                Loading messages...
              </div>
            </div>
          )}
          {
            status === 'unavailable' && (
              <div className="mt-auto">
                <div className="text-primary-text mt-5 text-center text-sm ">Item is no longer available</div>
              </div>
            )
          }
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
            disabled={isSold || item?.deleted || !otherUser?._id || !item?._id || status === 'unavailable'}
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
                        <img src={otherUser?.avatar_url} alt="avatar" referrerPolicy="no-referrer" className="object-contain"/>
                      ) : (
                      <span className="text-accent font-semibold text-sm">
                        {otherUser?.username?.charAt(0).toUpperCase() || '?'}
                      </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-primary-text">Buyer</p>
                      <p className="text-primary-text font-medium">{otherUser?.username}</p>
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


