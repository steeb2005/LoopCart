import Back from '../assets/back.svg'
import { useNavigate } from 'react-router-dom'
import { useItemLike } from '../hooks/handle-like'
import HeartDefault from '../assets/Heart.svg'
import HeartClicked from '../assets/clickedHeart.svg'
import { useAppContext } from '../context/context'
import { useState, useEffect } from 'react'


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


function ItemCard({item_id, title, price, description, seller_name, likes}: {
  item_id: string,
  title: string,
  price: number,
  description: string,
  seller_name: string,
  likes: number
}
){
  const {isLiked, likesCount, handleLikeClick} = useItemLike(item_id, likes)
  const navigate = useNavigate()
  const handleItemClick = () => {
    navigate(`/item/${item_id}`)
  }

  return(
    <div  
      className="curor-pointer bg-bg-surface rounded-md p-3"
      onClick={handleItemClick}
    >
      <div className="img-section bg-bg-inverse w-100% min-h-37 rounded-md">
        {/* Image goes here */}
      </div>
      <div className="title-section text-primary-text mt-2">
        <h1 className="line-clamp-1 ">{title}</h1>
        <h1 className='font-bold'>₱{price.toLocaleString('en-US')}</h1>
        <p className="text-sm line-clamp-1">{description}</p>
        <div className="flex flex-row items-center justify-between mt-2">
          <h1 className="text-sm font-light">@{seller_name}</h1>
          <div className="flex flex-row gap-2">
            <img onClick={handleLikeClick}  src={isLiked ? HeartClicked : HeartDefault} alt="heart" />
            {likesCount}
          </div>
        </div>
      </div>
    </div>
  )
}



export default function MyItems(){
  const navigate = useNavigate()
  const [myItems, setMyItems] = useState<Item[]>([])
  const {items, getUsername, user} = useAppContext()


  useEffect(() => {
    const filteredItems = items?.filter(item => item.seller_id === user._id)
    setMyItems(filteredItems)
  }, [items])
  
  const myUsername = getUsername(user._id)
  const handleBackClick = () => {
    navigate(-1)
  }

  return(
    <div className="mx-5 p-0 m-0 min-h-screen pb-5 flex flex-col">
      <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
        <img onClick={handleBackClick} src={Back} alt="back" />
        My Items
      </div>

      <div className='items-section mt-5 flex flex-col gap-3'>
        {myItems?.length === 0 ? 
        (<div className='text-primary-text text-center mt-10 justify-center font-light'>You don't have any items</div>) :
        (myItems?.map((item: any) => (
          <ItemCard 
            key={item._id}
            item_id={item._id}
            title={item.title}
            price={item.price}
            description={item.description}
            seller_name={myUsername}
            likes={item.likes}
          />
        )))}
      </div>
      
      {myItems?.length !== 0 && <p className="mt-10 text-center text-primary-text font-light">No more items to show</p>}
        
    </div>
  )
}