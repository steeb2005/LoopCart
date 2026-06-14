import {motion, AnimatePresence} from 'framer-motion'
import { useEffect, useState } from "react"
import Close from '../assets/close.svg'

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


export default function Inbox({closeInbox, isOpen}: {
  closeInbox: () => void, 
  isOpen: boolean
}){

  const [clickedFilter, setClickedFilter] = useState('buying')

  const handleFilter = (id: string) => {
    setClickedFilter(id)
  }

  useEffect(() => { // Disable scroll when modal is active
    if(isOpen){
      document.body.style.overflow = "hidden"

    }else{
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])
  return(
    <>
      <AnimatePresence>
        {isOpen && (
          <div 
            className={`fixed z-100 inset-0 `}
            onClick={closeInbox}
            
          >
            <motion.div 
              className={`flex flex-col px-5 fixed h-[80%] max-h-[80%] border-t border-border-color-inverse w-full bottom-0 text-primary-text bg-bg-canvas rounded-t-2xl`}
              initial={{y: "100%"}}
              animate={{y: 0}}
              exit={{y: "100%"}}
              transition={{type: "spring", damping: 25, stiffness: 200}}
              onClick={(e) => e.stopPropagation()} // Stops closing the modal on click
            >

              <div className='head flex flex-row justify-between pt-3 text-primary-text font-semibold'>
                Inbox
                <img onClick={closeInbox} src={Close} alt="close" />
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

              
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>  
    
  )
}