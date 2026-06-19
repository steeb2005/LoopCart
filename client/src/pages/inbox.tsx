import { useNavigate } from "react-router-dom"
import Back from '../assets/back.svg'
import {useState} from 'react'


function InboxEntry(){
  return(
    <div className='item-entry bg-bg-surface p-2 gap-2 rounded-md flex flex-row shrink-0'>
      <div className='image-entry min-h-20 min-w-20 bg-bg-inverse rounded-md'>
        {/* Image */}
      </div>
      <div className='data-entry w-full min-w-0  text-primary-text'>
        <div className='flex flex-row justify-between'>
          <h1>@username</h1>
          <p className='font-light'>Available</p>
        </div>
        <div className='flex flex-row justify-between items-center'>
          <h1>Title</h1>
          <h1>PHP 52000</h1>
        </div>
        <div className='last-message items-center'>
          <p className='line-clamp-1'>User: Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat laboriosam excepturi </p>
        </div>
      </div>
    </div>
  )
}


function Inbox(){
  const [clickedFilter, setClickedFilter] = useState('buying')

  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1)
  }

  
  const handleFilter = (id: string) => {
    setClickedFilter(id)
  }


  return(
    <div className="mx-5 p-0 m-0 min-h-screen pb-5 flex flex-col"> 

      <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
        <img onClick={handleBackClick} src={Back} alt="back" />
        Inbox
      </div>

      <div className='overflow-y-auto pr-1 grow normal-scrollbar items-section gap-2 flex flex-col mt-3'>
        <div className="flex flex-row justify-around font-semibold mt-2 text-primary-text ">
          <div onClick={() => handleFilter("buying")} className={` border-b ${clickedFilter === 'buying' ? 'border-bg-inverse' :'border-bg-surface' }  w-full text-center py-2 cursor-pointer`}>
            Buying
          </div>
          <div onClick={() => handleFilter('selling')} className={` border-b ${clickedFilter === 'selling' ? 'border-bg-inverse' :'border-bg-surface' } w-full text-center py-2 cursor-pointer`}> 
            Selling
          </div>
        </div>

        {/* Item Entry */}
        <InboxEntry/>
        <InboxEntry/>
        <InboxEntry/>
        <InboxEntry/>
        <InboxEntry/>
        <InboxEntry/>
        
      </div>



    </div>
  )
}

export default Inbox