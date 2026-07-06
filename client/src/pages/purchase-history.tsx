import { useNavigate, Link } from 'react-router-dom'
import Back from '../assets/back.svg'
import { useState } from 'react'
import { useAppContext } from '../context/context'

//TODO 
// COMPLETE THSI SHIT
// Complete Item Entry
// Complete Skeletons
function ItemEntry(){
  return(
    <Link 
      to={`#`}
      className='cursor-pointer item-entry bg-bg-surface p-2 gap-2 rounded-md flex flex-row shrink-0'>
      <div className='image-entry min-h-20 min-w-20 bg-bg-inverse rounded-md'>
        {/* Image */}
      </div>
      <div className='data-entry w-full min-w-0 flex flex-col flex-1 justify-center text-primary-text'>
        <div className='flex flex-row '>
          <h1 className="font-semibold">Sold to: Username</h1>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <h1>Nike Shoes</h1>
          <h1 className="font-semibold">₱1,000</h1>
        </div>
      </div>
    </Link>
  )
}




export default function PurchaseHistory(){
  const navigate = useNavigate()
  const {user, items} = useAppContext()
  
  const [filter, setFilter] = useState('purchases')

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleFilter = (id: string) => {
    setFilter(id)
  }


  const getFilteredItems = () => {
    if(filter === 'purchases'){
      const purchaseItems = items.filter(item => item.buyer_id === user._id)
      return purchaseItems
    }else{
      const soldItems = items.filter(item => item.seller_id && (item?.buyer_id) === user._id)
      return soldItems
    }
  }
  

  return(
    <div className="mx-5 p-0 m-0 min-h-screen pb-5 flex flex-col">
       <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
        <img onClick={handleBackClick} src={Back} alt="back" className="cursor-pointer"/>
        History
      </div>

      <div className='overflow-y-auto pr-1 grow normal-scrollbar items-section gap-2 flex flex-col mt-3'>
        <div className="flex flex-row justify-start gap-1 font-semibold mt-2 text-primary-text ">
          <div onClick={() => handleFilter('purchases')} className={`${filter === 'purchases' ? 'border-bg-inverse' : 'border-transparent'}  border-b  gap-2 flex flex-row justify-center text-center py-2 cursor-pointer items-center text-sm shrink-0 px-4`}> 
            Purchases
          </div>
            
          <div onClick={() => handleFilter('sold')} className={`${filter === 'sold' ? 'border-bg-inverse' : 'border-transparent'} border-b gap-2 flex flex-row justify-center shrink-0 text-center py-2 px-4 cursor-pointer items-center text-sm`}>
            Sold 
          </div>
        </div>

        <ItemEntry/>
        

      </div>
    </div>
  )
}