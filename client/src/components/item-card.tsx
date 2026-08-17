import { Link } from "react-router-dom"
import { useItemLike } from "../hooks/handle-like"
import Heart from "../assets/Heart.svg"
import HeartClicked from "../assets/clickedHeart.svg"

export default function ItemCard({item_id, image, title, price, likes}: {
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
      <div className="aspect-square bg-black/5 relative overflow-hidden w-full rounded-md flex items-center justify-center">
        {image ? (
          <>
            
            <img src={image} className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110" alt="bg-blur" />
            
            <img src={image} className="relative z-10 max-w-full max-h-full object-contain" alt="image"/>
          </>
        ) : (
          <div className="h-full flex justify-center items-center text-secondary-text">
            No Image
          </div>
        )}
      </div>
      <div className="title-section text-primary-text mt-5 flex flex-col gap-1">
        <h1 className="line-clamp-2 text-sm">{title}</h1>
        <div className="flex flex-row justify-between">
          <h1 className="font-bold">₱{price.toLocaleString('en-US')}</h1>
          <div className="flex flex-row items-center justify-end mt-auto">
            <div className="flex flex-row gap-2 items-center">
              <img 
                onClick={(e) => {
                  handleLikeClick(e)
                  e.preventDefault()
                  e.stopPropagation()
                }}  
                src={isLiked ? HeartClicked : Heart} 
                alt="heart" className="filter-(--icon-filter) h-5"/>
              {likesCount}
            </div>
            
          </div>
        </div>
      </div>
      
    </Link>
  )
}