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
    price: '',
    category: '',
    condition: '',
    description: '',
    createdAt: Date.now().toString(),
    soldAt: '',
    sold: false,
    seller: user.username.toString(),
    buyer: '',
    image: '',
    likes: 0
  })

  const handlePost = async (e: React.SubmitEvent<HTMLFormElement>) => {
    const cleanedForm = {...item, price: parseFloat(item.price)}
    e.preventDefault()
    try{
      const post = await post_item(cleanedForm)
      if(post){
        navigate('/home')
      }
    }catch{
      console.error('error in posting item');
    }
  }

  const handlePrice = (values: {value: string}) => {
    setItem({...item, price: values.value})
  }
  return(
    <>
      <div className="mx-5 p-0 m-0 min-h-screen pb-5"> 
        <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
          <Link to={'/home'}>
            <img src={Back} alt="back" />
          </Link>
          Sell Item
        </div>
        <div className='flex flex-col mx-5'>
          
          <div className='min-h-50 bg-bg-canvas border-2 border-border-color rounded-md mt-7'>
            {/* Add image here */}
          </div>

          <div>
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
          </div>          

          <h1 className='text-md text-primary-text font-semibold mt-5 mb-1'>Location</h1>
          <div className='flex flex-row gap-2'>
            <img src={Location} alt="Location" />
            <h1 className='font-light text-primary-text'>Butuan City</h1>
          </div>
          
          
          <button form='form' type='submit' className='gap-2 justify-center items-center flex flex-row mt-10 w-full bg-bg-surface font-semibold text-md cursor-pointer rounded-md py-2 text-primary-text'>
            <p>Post to the Loop</p>
            <img src={Logo} alt="logo" className='h-7'/>
          </button>
          
          
        </div>
      </div>
    </>
  )
}

export default SellItem