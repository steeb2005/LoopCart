import {useAppContext} from '../context/context'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Back from '../assets/back.svg'
import Goto from '../assets/goto.svg'
import Heart from '../assets/Heart.svg'
import Location from '../assets/location.svg'
import Message from '../assets/message.svg'
import { useItemLike } from '../hooks/handle-like'
import HeartClicked from '../assets/clickedHeart.svg'
import { useNavigate } from 'react-router-dom'




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

function ItemDetails(){
  const naviagte = useNavigate()
  const {id} = useParams() 
  const {items, user, getUsername} = useAppContext()
  
  const [item, setItem] = useState<Item | null>(null)
  const [sellerUsername, setSellerUsername] = useState('')
  
  
  useEffect(() => {
    const foundItem = items?.find(item => item._id === id)
    setItem(foundItem)
    setSellerUsername(getUsername(foundItem?.seller_id || 'Unkown Seller'))
  }, [items, id, getUsername])

  
  const isUserItem = item?.seller_id === user?._id

  const {isLiked, likesCount, handleLikeClick} = useItemLike(item?._id, item?.likes || 0)

  const handleBackClick = () => {
    naviagte(-1)
  }

  const handleChatClick = () => {
    naviagte(`/chat/${item?._id}/${item?.seller_id}`)
  }

  
  // Error handler if item is not found
  if(!item){
    return(
      <div className="mx-5 p-0 m-0 min-h-screen pb-5 flex justify-center items-center">
        <div className='text-primary-text gap-2 flex flex-col'>
          <h1>Item not Found</h1>
          <Link to={'/home'}>
            <button className='rounded-md p-2 bg-bg-inverse text-primary-text-inverse font-semibold'>Back</button>
          </Link>
        </div>
      </div>
    )
  }
  return(
    <>
        <div className="mx-5 p-0 m-0 pb-5 min-h-screen flex flex-col"> 
          

          <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
          
            <img onClick={handleBackClick} src={Back} alt="back" />
            
            Item details
          </div>
          <div className='text-primary-text flex flex-col px-2 py-3 border-border-color border rounded-md mt-7'>
            
            <div className='min-h-50 bg-bg-inverse border-2 rounded-md '>
              {/* Add image here */}
            </div>

            <h1 className='font-semibold text-xl mt-2'>{item.title}</h1>
            <h1 className='font-semibold text-xl mt-2'>PHP {item.price.toLocaleString('en-US')}</h1>
            <h1 className='font-semibold text-xl mt-3'>Condition</h1>
            <p className='mt-1'>{item.condition}</p>
            <h1 className='font-semibold text-xl mt-3'>Description</h1>
            <p className='mt-1'>{item.description}</p>
          </div>
          
          
          <div className='items-center flex flex-row text-primary-text text-xl justify-between font-semibold mt-5'>
            <div className='flex'>
              <h1>Seller</h1>
              <img src={Goto} alt="goto" className='h-8'/>
            </div>
            <div className='flex flex-row gap-3 mr-4'>
              <img onClick={handleLikeClick} src={isLiked ? HeartClicked : Heart} alt="heart" />
              <h1>{likesCount}</h1>
            </div>
          </div>

          <div className='flex flex-row gap-2 mt-2 text-primary-text items-center'>
            <div className='bg-bg-inverse rounded-full w-8 h-8'></div>
            <h1>@{sellerUsername}</h1>
          </div>

          <div className='text-primary-text mt-5 mb-5'>
            <h1 className='text-xl font-semibold'>Location</h1>
            <div className='flex flex-row items-center gap-2 mt-2'>
              <img src={Location} alt="location" />
              <p>Butuan City</p>
            </div>
          </div>
          
          {isUserItem ? (
            <button className='justify-center flex mt-auto flex-row items-center bg-bg-surface rounded-md p-2 text-primary-text font-semibold w-full'>
              Edit Listing
            </button>
          ) : (
            <button onClick={handleChatClick} className='justify-center flex mt-auto flex-row items-center gap-2 bg-bg-surface rounded-md p-2 text-primary-text font-semibold w-full'>
              <img src={Message} alt="message" />
              Make an Offer/Buy now
            </button>
            )}
          
        </div>    

    </>
  )    
}

export default ItemDetails