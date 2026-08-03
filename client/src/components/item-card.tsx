import { Link } from "react-router-dom"
import { useItemLike } from "../hooks/handle-like"
import Heart from "../assets/Heart.svg"
import HeartClicked from "../assets/clickedHeart.svg"

export default function ItemCard({item_id, image, title, price, seller_name, likes}: {
  item_id: string,
  image: string,
  title: string,
  price: number,
  seller_name: string,
  likes: number
}
){
  const {isLiked, likesCount, handleLikeClick} = useItemLike(item_id, likes)
 
  return(
    <Link  
      to={`/item/${item_id}`}
      className="shadow-md rounded-md p-3 cursor-pointer max-h-100 flex flex-col space-y-1 bg-bg-canvas "
    >
      <div className="img-section bg-bg-canvas overflow-hidden w-full min-h-50 max-h-70 rounded-md">
        {image ? (
          <img src={image} className="w-full h-full object-contain" alt="image"/>
        ) : (
          <div className="h-full flex justify-center items-center text-secondary-text">
            No Image
          </div>
        )}
      </div>
      <div className="title-section text-primary-text mt-2 ">
        <h1 className="line-clamp-2 ">{title}</h1>
        <h1 className=" font-bold text-lg">₱{price.toLocaleString('en-US')}</h1>
      </div>
      <div className="flex flex-row items-center justify-between mt-auto">
        <h1 className="text-sm font-light">@{seller_name}</h1>
        <div className="flex flex-row gap-2">
          <img 
            onClick={(e) => {
              handleLikeClick(e)
              e.preventDefault()
              e.stopPropagation()
            }}  
            src={isLiked ? HeartClicked : Heart} 
            alt="heart" className="filter-(--icon-filter) h-6"/>
          {likesCount}
        </div>
        
      </div>
    </Link>
  )
}