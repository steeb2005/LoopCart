import Back from '../assets/back.svg'
import {Link} from 'react-router-dom'
import { useState } from 'react'
import Location from '../assets/location.svg'
import Logo from '../assets/Logo.svg'
import { useAppContext } from '../context/context'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import {NumericFormat} from 'react-number-format'
/*
  TODO:
  - Make the backend logic for selling an item
  - Make the onSubmit function for the form here
  - try to integrate the image upload feature
 */

function SellItem(){
  const navigate = useNavigate()
  const {user, post_item} = useAppContext() 

  const [item, setItem] = useState({
    title: '',
    price: null as number | null, 
    category: '',
    condition: '',
    description: '',
    created_at: '',
    sold_at: '',
    status: 'available',
    seller_id: '',
    buyer_id: '',
    image: '',
    likes: 0
  })

  const handlePost = async (e: React.SubmitEvent<HTMLFormElement>) => {
     e.preventDefault()
    const created_at = new Date().toISOString();
    const seller_id = user._id || ''
    if(!seller_id){
      console.error('user not logged in');
      return
    }

    const itemToPost = {
      ...item,
      price: Number(item.price) || 0, // If price has no value automatically be zero
      created_at: created_at,
      seller_id: seller_id,
      status: 'available'
    }
    
   
    try{
      const post = await post_item(itemToPost)
      if(post){
        navigate('/home')
      }
    }catch(error){
      console.error('error in posting item', error);
    }
  }

  const handlePrice = (values: {floatValue?: number}) => {
    setItem({...item, price: values.floatValue ?? null})
  }


  return(
    <>
      <div className="mx-5 p-0 m-0 min-h-screen pb-5 flex flex-col"> 
        <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
          <Link to={'/home'}>
            <img src={Back} alt="back" />
          </Link>
          Sell Item
        </div>
        <div className='flex flex-col mx-5 flex-1'>
          
          <div className='min-h-50 bg-bg-canvas border-2 border-border-color rounded-md mt-7'>
            {/* Add image here */}
          </div>

          <form id='form' onSubmit={handlePost}>
            <TextareaAutosize
              value={item.title}
              onChange={(e) => setItem({...item, title: e.target.value})}
              className='mt-5 resize-none text-sm items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0 '
              placeholder='Title'
              required
            />

            <NumericFormat
              allowNegative={false}
              thousandSeparator={","}
              decimalScale={2}
              inputMode='decimal'
              value={item.price}
              onValueChange={handlePrice}
              className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
              placeholder='Price'
              required
            />

            <TextareaAutosize  
              value={item.category}
              onChange={(e) => setItem({...item, category: e.target.value})}
              className='mt-5 resize-none text-sm items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
              placeholder='Category'
              required
            />

            <TextareaAutosize 
              
              value={item.condition}
              onChange={(e) => setItem({...item, condition: e.target.value})}
              className='mt-5 resize-none text-sm items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
              placeholder='Condition'
              required
            />

            <TextareaAutosize 
              value={item.description}
              onChange={(e) => setItem({...item, description: e.target.value})}
              className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
              placeholder='Description'
              required
            />
          </form>

          <h1 className='text-md text-primary-text font-semibold mt-5 mb-1'>Location</h1>
          <div className='flex flex-row gap-2 mb-5'>
            <img src={Location} alt="Location" />
            <h1 className='font-light text-primary-text'>Butuan City</h1>
          </div>
          
          
          <button form='form' type='submit' className='gap-2 justify-center items-center flex flex-row mt-auto w-full bg-bg-surface font-semibold text-md cursor-pointer rounded-md py-2 text-primary-text'>
            <p>Post to the Loop</p>
            <img src={Logo} alt="logo" className='h-7'/>
          </button>
          
          
        </div>
      </div>
    </>
  )
}

export default SellItem