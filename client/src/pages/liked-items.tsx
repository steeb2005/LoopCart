import Back from '../assets/back.svg'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/context'
import { useEffect, useState } from 'react'
import { useItemLike } from '../hooks/handle-like'

function LikedItems() {
  return(
    <div className="mx-5 p-0 m-0 min-h-screen pb-5"> 
      <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
          <Link to={'/home'}>
            <img src={Back} alt="back" />
          </Link>
          Liked Items
        </div>
    </div>
  )
} 


export default LikedItems