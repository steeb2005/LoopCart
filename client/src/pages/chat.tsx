import { useParams } from "react-router-dom";
import Back from '../assets/back.svg'
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/context";
import Send from '../assets/send.svg'
import TextareaAutosize from "react-textarea-autosize";
import CheckCircle from '../assets/check_circle.svg'


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




type ChatMessage = {
  sender_id: string;
  text: string;
}




function useViewportHeight() {


  useEffect(() => {
    const setHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight
      document.documentElement.style.setProperty('--vh', `${height}px`)
      
      window.scrollTo(0, height)
    }
    setHeight()
    window.visualViewport?.addEventListener('resize', setHeight)
    window.visualViewport?.addEventListener('scroll', setHeight)

    return () => {
      window.visualViewport?.removeEventListener('resize', setHeight)
      window.visualViewport?.removeEventListener('scroll', setHeight)
    }
  }, [])
}


/*

  useEffect(() => {
    const setHeight = () => {
      document.documentElement.style.setProperty(
        '--vh', 
        `${window.visualViewport?.height ?? window.innerHeight}px`
      )
    }
    setHeight()
    window.visualViewport?.addEventListener('resize', setHeight)
    return () => window.visualViewport?.removeEventListener('resize', setHeight)
  }, []) */


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












function Chat(){

  const navigate = useNavigate()

  const {itemId, userId} = useParams(); // The item id and user id of the person you are chatting with
  const {items, getUsername, user, load_messages, send_message, fetch_conversation_id, read_messages, inbox, load_inbox, update_item_sold, load_items, get_item} = useAppContext()
   
  const [item, setItem] = useState<Item | null>(null)
  const [otherUsername, setOtherUsername] = useState('')
  const [lineCount, setLineCount] = useState(1);
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState('')
  const [soldConfirmation, setSoldConfirmation] = useState(false)
  const [revertSold, setRevertSold] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => { // Scrolls to bottom as messages are added
    scrollToBottom()
  }, [messageList])

  
  const handleBackClick = () => { 
    navigate(-1)
  }


  useEffect(() => {
    const foundItem = items?.find(item => item._id === itemId)
    setItem(foundItem)
    setOtherUsername(getUsername(userId || 'Unkown User'))   // Gets the username of the other person
    

    const findItem = async () => {
      setIsLoading(true)  
      const res = await get_item(itemId)
      if(res){
        setItem(res)
        setIsLoading(false)  
      }
    }

    
    const loadMessages = async () => {
      if(!user?._id || !itemId) return

      let conv_id = conversationId

      if(!conv_id){
        const result = await fetch_conversation_id(user._id, itemId)
        if(result?.conversation_id){
          conv_id = result.conversation_id
          setConversationId(conv_id)          
          connectChatSocket(conv_id) // connects to chat socket
        }else{
          console.log('no conversation yet');
          setMessageList([])
          return
        }
      }
  
      const msg = await load_messages(conv_id)
      setMessageList(msg?.messages || [])
      
      const hasUnreadMessages = inbox.some(entry => entry.conversation_id === conv_id && entry.unread_count > 0)
      if(hasUnreadMessages){
        await read_messages(conv_id, user._id)
        await load_inbox(user._id)        
      }
    }
    
    loadMessages() // loads messages
    findItem()
  }, [items, itemId, getUsername, get_item ])


  const chatWsRef = useRef<WebSocket | null>(null)
  const chatWsIntentionalClose = useRef(false)

  // TODO:
  // FIX SOCKET CONNECTION ERROR
  // socket closes before connecting

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

    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${conv_id}`) // Change the URL in production

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if(data.type === 'new_message'){
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

    if(isSold) return // if the item is sold, do not allow sending messages

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
      const res = await send_message(messageData) 
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
    }
    setMessage('')
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      
      if (message.trim().length > 0) {  
        e.currentTarget.form?.requestSubmit(); 
      }
    }
  }
  
  const role = userId === item?.seller_id ? 'buyer' : 'seller' 
  const isSold = item?.status === 'sold'

  const handleSetToSold = async () => {
    const prev = item
    setSoldConfirmation(false)
    setRevertSold(false)
    try{
      if(isSold){
        setItem({...prev, status: 'available'})
      }else{
        setItem({...prev, status: 'sold'})
      }
      await update_item_sold(itemId, userId, item?.status, conversationId)
      await load_items()
    }catch{
      setItem(prev)
      console.error('error in updating item status');
    }
  }

  











  return (
    <>
      <div className="flex flex-col h-dvh">

        <div className={`top-0 pt-5 sticky bg-bg-canvas m-0 `}>
          <div className='head flex flex-col text-primary-text font-semibold'>
            
            <div className="mx-5 flex flex-row gap-5 mb-3">
              <img onClick={handleBackClick} src={Back} alt="back" />
              <div className="flex flex-row gap-2 items-center">
                <div className="h-7 w-7 rounded-full bg-bg-inverse"></div>
                <h1>{otherUsername}</h1>
              </div>
            </div>
            
            <div className='item-entry border-b border-border-color-inverse border-t pt-2 pb-2 m-0'>
              <div className="flex flex-row px-5 gap-2 items-center">

                <div className='image-entry min-h-20 min-w-20 bg-bg-inverse rounded-md'>
                  {/* Image */}
                </div>

                <div className='data-entry flex flex-col w-full gap-1 text-primary-text'>
                  <h1>₱{item?.price.toLocaleString('en-US')}</h1>
                  <h1 className="font-light line-clamp-1">{item?.title}</h1>
                  <div className="flex flex-row ">
                    <div className="font-light ml-2 bg-bg-surface rounded-full py-1 px-3 text-sm">Status: {item?.status.charAt(0).toUpperCase() + item?.status.slice(1)}</div>                  
                    {role === 'seller' && 
                    <div 
                      className={` ml-2 ${isSold ? 'bg-bg-inverse text-primary-text-inverse' : 'bg-bg-surface text-primary-text'} cursor-pointer rounded-md py-1 px-3 text-sm`}
                      onClick={() => isSold ? setRevertSold(true): setSoldConfirmation(true)}
                      
                    >
                      {isSold ? 'Item Sold' : 'Mark as Sold'}
                    </div>}
                                      
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 chat-body grow overflow-y-auto overscroll-y-none items-section gap-1 pb-5 flex flex-col mt-3">

          {messageList.length === 0 ? (
            <div className="flex flex-row justify-center items-center h-full">
              <h1 className="text-primary-text">No messages yet</h1>
            </div>
          ) : (
            messageList.map((message) => (
            <Message  
              isOwn={isOwn(message.sender_id)} // Flips the message if its not the users
              message={message.text} 
            />
          )))}
          <div ref={messageEndRef}/>


          {isSold && 
            <div className="text-primary-text mt-auto mb-5 text-center ">This item has been sold. <br />This conversation is closed.</div>
          }

          {isLoading && (
            <div className="text-primary-text mt-auto mb-5 text-center flex flex-row items-center justify-center gap-3 "> 
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-bg-inverse"></div>
              Loading messages...
            </div>
          )}

        </div>

        <form 
          onSubmit={handleSendMessage}
          className="shrink-0 flex flex-row gap-2 items-end py-2 px-5 bg-bg-canvas"
        >
          <TextareaAutosize 
            rows={1}
            maxRows={5}
            value={message}
            placeholder="message"
            className={`touch-none scrollbar-none resize-none flex-1 bg-bg-surface text-primary-text px-4 py-3 ${lineCount > 1 ? 'rounded-2xl' : 'rounded-4xl'} duration-200 transition-all outline-0`}
            onChange={(e) => setMessage(e.target.value)}
            onHeightChange={(height) => setLineCount(height > 50 ? 2 : 1)}
            onKeyDown={handleKeyDown}
            disabled={isSold || isLoading}
          />
          <button className={`${message.length > 0 ? 'bg-bg-inverse' : 'bg-gray-400'}  p-2  rounded-full cursor-pointer`} disabled={message.length === 0}>
            <img src={Send} alt="send" />
          </button>

        </form>
            
            
          {revertSold && (
            <div  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="w-[90%] max-w-md bg-bg-surface rounded-2xl shadow-2xl border border-border-color/50 overflow-hidden">

                {/* Header with accent */}
                <div className="relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-accent to-accent/60" />
                  <div className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <img src={CheckCircle} alt="check" />
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

                <div className="flex flex-row justify-end p-4 border border-t border-border-color">
                  <button 
                    className="text-primary-text mr-3 border border-border-color px-4 py-2 rounded-xl"
                    onClick={() => setRevertSold(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="bg-accent text-primary-text-inverse px-4 py-2 rounded-xl bg-bg-inverse border border-border-color"
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
              className="w-[90%] max-w-md bg-bg-surface rounded-2xl shadow-2xl border border-border-color/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with accent */}
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-accent to-accent/60" />
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <img src={CheckCircle} alt="check" />
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
                <div className="p-4 bg-bg-canvas rounded-xl border border-border-color/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0 bg-bg-inverse">
                      <span className="text-accent font-semibold text-sm">
                        {otherUsername?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-primary-text">Buyer</p>
                      <p className="text-primary-text font-medium">{otherUsername}</p>
                    </div>
                  </div>
                </div>

                {/* Item preview */}
                {item && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-bg-canvas/50 rounded-xl border border-border-color/30">
                    <div className="w-12 h-12 bg-bg-inverse rounded-lg shrink-0" />
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
                  className="cursor-pointer flex-1 py-2.5 px-4 rounded-xl border border-border-color text-primary-text font-medium flex items-center justify-center gap-2"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        

      </div>
    </>
  )
}

export default Chat