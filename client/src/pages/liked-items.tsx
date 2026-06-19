import Back from '../assets/back.svg'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/context'
import { useItemLike } from '../hooks/handle-like'
import HeartDefault from '../assets/Heart.svg'
import HeartClicked from '../assets/clickedHeart.svg'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'



function ItemCard({item_id, title, price, status, seller_name, likes}: {
  item_id: string,
  title: string,
  price: number,
  status: string,
  seller_name: string,
  likes: number
}){

  const navigate = useNavigate()

  const {isLiked, likesCount, handleLikeClick} = useItemLike(item_id, likes)
  const handleItemClick = () => {
    navigate(`/item/${item_id}`)
  }

  return(
    <div 
      onClick={handleItemClick} 
      className='item-entry bg-bg-surface p-2 gap-2 rounded-md flex flex-row m-0'>

      <div className='image-entry min-h-20 min-w-20 bg-bg-inverse rounded-md'>
        {/* Image */}
      </div>
      <div className='data-entry flex flex-col w-full gap-1 text-primary-text'>

        <div className='flex flex-row justify-between items-center'>
          <h1 className='font-semibold'>@{seller_name}</h1>
          <p className='font-light text-sm'>{status}</p>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='font-light line-clamp-1'>{title}</h1>
        
        </div>
        <div className='last-message items-center flex flex-row justify-between'>
          <h1 className='font-semibold'>PHP {price.toLocaleString('en-US')}</h1>  
          <div className='flex flex-row gap-2'>
            <img onClick={handleLikeClick} src={isLiked ? HeartClicked : HeartDefault} alt="heart" />
            {likesCount}
          </div>
        </div>
      </div>
    </div>
   
  )
}





function LikedItems() {
  const {likedItems, getSellerName} = useAppContext()
  const navigate = useNavigate()
  const [copyItems, setCopyItems] = useState([])

  useEffect(() => { // NOTE: TEMP might remove until a better solution
    if(copyItems.length === 0 && likedItems.length > 0){
      setCopyItems(likedItems)
    }
    
  }, [likedItems])
  const handleBackClick = () => {
    navigate(-1)
  }
  
  return(
    <div className="mx-5 p-0 m-0 min-h-screen pb-5"> 
      <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
        
        <img onClick={handleBackClick} src={Back} alt="back" />
        
        Liked Items
      </div>

      <div className='items-section mt-5 flex flex-col gap-3'>
        {copyItems?.length === 0 ? 
        (<div className='text-primary-text text-center mt-10 justify-center font-light'>You don't have any liked items</div>)
        : (copyItems?.map((item: any) => (
          <ItemCard 
            key={item._id}
            item_id={item._id}
            title={item.title}
            price={item.price}
            status={item.status}
            seller_name={getSellerName(item.seller_id)}
            likes={item.likes}
            />
            
        )))}
            
      </div>

    </div>
  )
} 


export default LikedItems