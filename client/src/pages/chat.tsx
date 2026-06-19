import { useParams } from "react-router-dom";
import Back from '../assets/back.svg'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/context";
import HeartDefault  from '../assets/Heart.svg'
import Send from '../assets/send.svg'
import TextareaAutosize from "react-textarea-autosize";



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


type MessageStruct = {
  _id?: string;
  message: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

function useViewportHeight() {
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
  }, [])
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





function Chat(){
  const {itemId, sellerId} = useParams();
  const {items, getSellerName, user} = useAppContext()
   
  const [item, setItem] = useState<Item | null>(null)
  const [sellerUsername, setSellerUsername] = useState('')
  const [lineCount, setLineCount] = useState(1);
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState<MessageStruct[]>([])
  
  const navigate = useNavigate()


  useEffect(() => {
    const foundItem = items?.find(item => item._id === itemId)
    setItem(foundItem)

    setSellerUsername(getSellerName(sellerId || 'unkown Seller'))  

  }, [items, itemId, getSellerName])

  const handleBackClick = () => {
    navigate(-1)
  }

  const isOwn = (id: string) => {
    return id === user?._id
  }

  // NOTE: NOT FINAL
  const handleSendMessage = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const messageData = {
      _id: Date.now().toString(),
      message: message.trim(),
      sender_id: user?._id,
      receiver_id: item?.seller_id,
      created_at: Date.now().toString()
    }

    setMessageList((messageList) => [...messageList, messageData])
    setMessage('')
  }
  
  useViewportHeight()
  return (
    <>
      <div className="flex flex-col min-h-screen">

        <div className={`top-0 pt-5 sticky bg-bg-canvas m-0 pb-3`}>
          <div className='head flex flex-col text-primary-text font-semibold'>
            
            <div className="mx-5 flex flex-row gap-5 mb-3">
              <img onClick={handleBackClick} src={Back} alt="back" />
              <div className="flex flex-row gap-2 items-center">
                <div className="h-7 w-7 rounded-full bg-bg-inverse"></div>
                <h1>{sellerUsername}</h1>
              </div>
            </div>
            
            <div className='item-entry border-b border-border-color-inverse border-t pt-2 pb-2 m-0'>
              <div className="flex flex-row px-5 gap-2 items-center">

                <div className='image-entry min-h-20 min-w-20 bg-bg-inverse rounded-md'>
                  {/* Image */}
                </div>

                <div className='data-entry flex flex-col w-full gap-1 leading-tight text-primary-text'>
                  <h1>PHP {item?.price.toLocaleString('en-US')}</h1>
                  <h1 className="font-light line-clamp-1">{item?.title}</h1>
                  <div className="font-light bg-bg-surface rounded-full py-1 px-3 w-fit">{item?.status}</div>                  
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-5 chat-body pr-1 grow normal-scrollbar items-section gap-1 flex flex-col mt-3">

          {messageList.map((message) => (
            <Message  
            isOwn={isOwn(message.sender_id)} 
            message={message.message} />
          ))}

        </div>

        <form 
          onSubmit={handleSendMessage}
          className="flex flex-row gap-2 items-end py-2 px-5 bg-bg-canvas"
        >
          <TextareaAutosize 
            rows={1}
            maxRows={5}
            value={message}
            placeholder="message"
            className={`scrollbar-none resize-none flex-1 bg-bg-surface text-primary-text px-4 py-3 ${lineCount > 1 ? 'rounded-2xl' : 'rounded-4xl'} duration-100 transition-transform outline-0`}
            onChange={(e) => setMessage(e.target.value)}
            onHeightChange={(height) => setLineCount(height > 50 ? 2 : 1)}
          />
          <button className={`${message.length > 0 ? 'bg-bg-inverse' : 'bg-gray-400'}  p-2  rounded-full cursor-pointer`} disabled={message.length === 0}>
            <img src={Send} alt="send" />
          </button>

        </form>



      </div>
    </>
  )
}

export default Chat