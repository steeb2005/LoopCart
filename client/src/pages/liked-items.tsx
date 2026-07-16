import Back from '../assets/back.svg'
import { useAppContext } from '../context/context'
import { useItemLike } from '../hooks/handle-like'
import HeartDefault from '../assets/Heart.svg'
import HeartClicked from '../assets/clickedHeart.svg'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Skeleton } from '../components/ui/skeleton'

function ItemCard({item_id, title, price, status, seller_name, likes}: {
  item_id: string,
  title: string,
  price: number,
  status: string,
  seller_name: string,
  likes: number
}){

  const {isLiked, likesCount, handleLikeClick} = useItemLike(item_id, likes)
 

  return(
    <Link 
      to={`/item/${item_id}`}
      className='item-entry bg-bg-surface p-2 gap-2 rounded-md flex flex-row m-0'>

      <div className='image-entry h-20 min-w-20 bg-bg-inverse rounded-md shrink-0'>
        {/* Image */}
      </div>

      <div className='data-entry flex flex-col w-full text-primary-text space-y-1'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='font-bold line-clamp-1'>{title}</h1>
          <h1 className='font-semibold'>₱{price.toLocaleString('en-US')}</h1>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='font-light text-secondary-text text-sm'>@{seller_name}</h1>
          
        </div>
          
        <div className='last-message items-center flex flex-row justify-between'>
          <div className='px-2 rounded-full bg-bg-gray-surface flex items-center'>
            <p className='font-light text-sm'>{status.charAt(0).toUpperCase() + status.slice(1)}</p>
          </div>
          <div className='flex flex-row gap-2'>
            <img 
              onClick={(e) => {
                handleLikeClick(e)
                e.preventDefault()
                e.stopPropagation()
                }} 
              src={isLiked ? HeartClicked : HeartDefault} 
              alt="heart" className='filter-(--icon-filter)'/>
            {likesCount}
          </div>
        </div>
      </div>
    </Link>
   
  )
}



function EntrySkeleton(){
  return(
    <Skeleton className="rounded-lg flex flex-row bg-bg-surface gap-1 items-center overflow-hidden p-2">
      <Skeleton className="h-20 w-20 bg-bg-gray-surface"/>
      <div className="p-2 space-y-3 flex-1 flex flex-col">
        <Skeleton className="h-4 w-3/4 bg-bg-gray-surface" />
        <Skeleton className="h-4 w-1/2 bg-bg-gray-surface" />
        <Skeleton className="h-4 w-2/3 bg-bg-gray-surface" />
      </div>
    </Skeleton>
  )
}




function LikedItems() {
  const {likedItems, getUsername, dataLoading} = useAppContext()
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


    <div className='mx-5 lg:mx-30 py-2'> 
      <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
        <img onClick={handleBackClick} src={Back} alt="back" className='cursor-pointer filter-(--icon-filter)'/>
        Favorites
      </div>

      <div className='items-section mt-5 flex flex-col gap-3'>
        {dataLoading ? (
          <>
            <EntrySkeleton/>
            <EntrySkeleton/>
            <EntrySkeleton/>
            <EntrySkeleton/>
            <EntrySkeleton/>
            <EntrySkeleton/>
          </>
        ) : (
          copyItems?.length === 0 ? 
          (<div className='text-empty-state text-center mt-10 justify-center font-light'>You don't have any liked items</div>)
          : (copyItems?.map((item: any) => (
            <ItemCard 
              key={item._id}
              item_id={item._id}
              title={item.title}
              price={item.price}
              status={item.status}
              seller_name={getUsername(item.seller_id)}
              likes={item.likes}
            />
              
          )))
        )}
      
        
      </div>
    </div>
  )
} 



export default LikedItems