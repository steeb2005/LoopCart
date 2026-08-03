import { useAppContext } from '../context/context'
import { useItemLike } from '../hooks/handle-like'
import HeartDefault from '../assets/Heart.svg'
import HeartClicked from '../assets/clickedHeart.svg'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Skeleton } from '../components/ui/skeleton'

function ItemCard({item_id, image, title, price, status, seller_name, likes, deleted}: {
  item_id: string,
  image: string,
  title: string,
  price: number,
  status: string,
  seller_name: string,
  likes: number,
  deleted: boolean
}){

  const {isLiked, likesCount, handleLikeClick} = useItemLike(item_id, likes)
 

  return(
    <Link 
      to={`/item/${item_id}`}
      className='item-entry p-2 gap-2 rounded-md hover:bg-bg-surface duration-100 flex flex-row m-0'>

      <div className='image-entry h-20 overflow-hidden border border-border-color w-20 bg-bg-canvas rounded-md shrink-0'>
        {image ? (
          <img src={image} alt="image" className="object-contain h-full w-full" />
        ) : (
          <div className="h-full text-xs flex justify-center items-center">No image</div>
        )}
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
            <p className='font-light text-sm'>{deleted ? 'Deleted' : status.charAt(0).toUpperCase() + status.slice(1)}</p>
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
  const [copyItems, setCopyItems] = useState<typeof likedItems>([])

  useEffect(() => { // NOTE: TEMP might remove until a better solution
    if(copyItems.length === 0 && likedItems.length > 0){
      setCopyItems(likedItems)
    }
    
  }, [likedItems])
 
  
  return(


    <div className='lg:mx-30 lg:mb-5 bg-bg-canvas h-full p-3 rounded-xl shadow-md min-h-0  flex flex-col'> 
      <div className='mx-5 head flex flex-row gap-5 pt-3 text-primary-text font-semibold'>
        <img src={HeartDefault} alt="heart_svg" className='filter-(--icon-filter)'/>
        Favorites
      </div>

      <div className='scrollbar-thin pr-3 scrollbar-thumb-bg-gray-surface items-section grow mt-5 gap-3 overflow-y-auto overflow-hidden'>
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
              image={item.image}
              item_id={item._id}
              title={item.title}
              price={item.price}
              status={item.status}
              seller_name={getUsername(item.seller_id)}
              likes={item.likes}
              deleted={item.deleted}
            />
              
          )))
        )}
      
        
      </div>
    </div>
  )
} 



export default LikedItems