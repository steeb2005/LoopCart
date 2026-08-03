import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAppContext } from '../context/context'
import {format} from "date-fns"
import { Skeleton } from '../components/ui/skeleton'
import History from '../assets/history.svg'



function ItemEntry({itemId, title, price, image, sold_at, isUserTheBuyer, username, seller_id }: {
  itemId: string,
  title: string,
  price: number,
  image: string,
  sold_at: string,
  isUserTheBuyer: boolean,
  username: string,
  seller_id: string
}){
  const {getUsername} = useAppContext()
  
  const setUsername = () => {
    if(isUserTheBuyer){
      return getUsername(seller_id)
    } 
    else{
      return username
    }
  } 

  const entryUsername = setUsername()

  return(
    <Link
      to={`/item/${itemId}`}
      className='text-primary-text cursor-pointer item-entry hover:bg-bg-surface duration-100 p-2 gap-3 rounded-md flex flex-col shrink-0'
      >
      <div className='date text-sm flex items-center'>
        <h1>{format(new Date(sold_at), 'MMMM d, yyyy h:mm a')}</h1>
      </div>

      <div className='flex flex-row shrink-0 gap-2'>
        <div className='image-entry max-w-20 max-h-20 overflow-hidden border border-border-color bg-bg-canvas rounded-md flex items-center justify-center'>
          {image ? (
            <img src={image} alt="image" className="max-h-full max-w-full h-auto w-auto object-fill"/>
          ) : (
            <div className="h-full text-xs flex justify-center items-center">No image</div>
          )}
        </div>
        <div className='data-entry w-full min-w-0 flex flex-col justify-center gap-1'>
          <h1 className='font-semibold line-clamp-2'>{title}</h1>  
          <h1 className='font-md'>₱{price.toLocaleString('en-US')}</h1>
        </div>
      </div>
      <div className='flex flex-row gap-4 items-center text-sm'>
        <h1 className='text-secondary-text'>@{entryUsername}</h1>
        <div className='font-light bg-bg-gray-surface py-1 px-3 text-xs rounded-xl text-secondary-text'>
          {isUserTheBuyer ? 'Purchased' : 'Sold'}
        </div>
      </div>
    </Link> 
  )
}


function EntrySkeleton(){
  return(
    <Skeleton className="rounded-lg flex flex-row bg-bg-surface items-center overflow-hidden p-2">
      <div className='flex-1 flex flex-col gap-2'>
        <Skeleton className="h-4 w-3/4 bg-bg-gray-surface"/>
        <div className='flex flex-row items-center'>
          <Skeleton className="h-20 w-20 bg-bg-gray-surface"/>
          <div className="p-2 space-y-3 flex flex-col flex-1">
            <Skeleton className="h-4 w-3/4 bg-bg-gray-surface" />
            <Skeleton className="h-4 w-1/2 bg-bg-gray-surface" />
            <Skeleton className="h-4 w-2/3 bg-bg-gray-surface" />
          </div>
        </div>
        <div className='flex-1 flex-row flex items-center gap-2'>
          <Skeleton className="h-8 w-8 rounded-full bg-bg-gray-surface"/>
          <Skeleton className="h-4 w-2/8 bg-bg-gray-surface"/>
          <Skeleton className="h-4 w-2/8 bg-bg-gray-surface"/>
        </div>
      </div>
    </Skeleton>
  )
}



export default function PurchaseHistory(){
  const {user, items, getUsername, dataLoading} = useAppContext()
  
  const [filter, setFilter] = useState('purchases')
  const [isUserTheBuyer, setIsUserTheBuyer] = useState(true)

  

  const handleFilter = (id: string) => {
    setFilter(id)
  }


  const getFilteredItems = () => {
    if(!user?._id){
      console.error('User not found')
      return
    }
    if(filter === 'purchases'){
      const purchasedItems = items.filter(item => item.buyer_id === user._id)
      return purchasedItems
    }else{
      const soldItems = items.filter(item => item.seller_id && item.buyer_id && item.seller_id === user._id)
      return soldItems
    }
  }
  
  const itemHistory = getFilteredItems() ?? []



  return(
    <div className='lg:mx-30 bg-bg-canvas h-dvh rounded-xl shadow-md lg:m-2'>
      <div className='head mx-5 flex flex-row gap-5 pt-3 text-primary-text font-semibold items-center'>
        <img src={History} alt="history_svg" className="filter-(--icon-filter) h-6"/>
        History
      </div>

      <div className='mx-5 overflow-y-auto pr-1 grow normal-scrollbar items-section gap-2 flex flex-col mt-3'>
        <div className="flex flex-row justify-start gap-1 font-semibold mt-2 text-primary-text ">
          <div 
            onClick={() => {
              handleFilter('purchases')
              setIsUserTheBuyer(true)
            }} 
            className={`${filter === 'purchases' ? 'border-bg-inverse' : 'border-transparent'}  border-b  gap-2 flex flex-row justify-center text-center py-2 cursor-pointer items-center text-sm shrink-0 px-4`}> 
            Purchases
          </div>
            
          <div 
            onClick={() => {
              handleFilter('sold')
              setIsUserTheBuyer(false)
            }} 
            className={`${filter === 'sold' ? 'border-bg-inverse' : 'border-transparent'} border-b gap-2 flex flex-row justify-center shrink-0 text-center py-2 px-4 cursor-pointer items-center text-sm`}>
            Sold 
          </div>
        </div>
        
        <div className='flex flex-col gap-3'>
          
          
          {dataLoading ? (
            <>
              <EntrySkeleton/>
              <EntrySkeleton/>
              <EntrySkeleton/>
              <EntrySkeleton/>
            </>
          ): (
            itemHistory?.length === 0 ? 
            (<div className='text-empty-state text-center mt-20 px-20 justify-center font-light '>{filter === 'purchases' ? 'You have not made any purchases yet' : 'You have not sold any items yet'}</div>) : 
              itemHistory.map(
                (item: any) => (
                  <ItemEntry 
                    key={item._id}
                    itemId={item._id}
                    title={item.title}
                    price={item.price}
                    isUserTheBuyer={isUserTheBuyer}
                    username={getUsername(item.buyer_id)}
                    image={item.image} // SET LATER
                    sold_at={item.sold_at}
                    seller_id={item.seller_id}
                  />
                )
            )
          )
          }
          
          

        </div>
        

      </div>
    </div>
  )
}