import Back from '../assets/back.svg'
import {Link, useLocation} from 'react-router-dom'
import { useEffect, useState } from 'react'
import Location from '../assets/location.svg'
import Logo from '../assets/Logo.svg'
import { useAppContext } from '../context/context'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import {NumericFormat} from 'react-number-format'


function SellItem(){
  const location = useLocation()
  const navigate = useNavigate()
  const {user, post_item, update_item} = useAppContext() 

  const [item, setItem] = useState({
    title: '',
    price: '', 
    category: '',
    condition: '',
    description: '',
    created_at: '',
    sold_at: null as string,
    status: 'available',
    seller_id: '',
    buyer_id: null as string,
    image: null as string,
    likes: 0
  })

  const defaultData = {
    title: '',
    price: '', 
    category: '',
    condition: '',
    description: '',
    created_at: '',
    sold_at: null as string,
    status: 'available',
    seller_id: '',
    buyer_id: null as string,
    image: null as string,
    likes: 0
  }


  const mode = location.state?.mode || 'create'
  const item_id = location.state?.id

  useEffect(() => {
    if(mode === 'edit'){
      const initialData = location.state?.item || item
      const itemToEdit = {
        title: initialData.title,
        price: initialData.price, 
        category: initialData.category,
        condition: initialData.condition,
        description: initialData.description,
        created_at: initialData.created_at,
        sold_at: initialData.sold_at,
        status: initialData.status,
        seller_id: initialData.seller_id,
        buyer_id: initialData.buyer_id,
        image: initialData.image,
        likes: initialData.likes
      }
      setItem(itemToEdit)
    }else{
      setItem(defaultData)
    }
  }, [mode])
  
  
  
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
    
    const itemToEdit = {
      ...item,
      _id: item_id,
      price: Number(item.price)
    }


    try{
      if(mode === 'edit'){
        await update_item(item_id, itemToEdit)
      }else{
        await post_item(itemToPost)
      }
      
    }catch(error){
      console.error('error in posting item', error);
    }finally{
      navigate('/home')
    }
  }

  const handlePrice = (values: {floatValue?: number}) => {
    setItem({...item, price: values.floatValue !== undefined ? String(values.floatValue) : ''})
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  return(
    <>
      <div className='mx-5 pb-2 lg:mx-30'> 
        <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
          <img src={Back} alt="back" onClick={handleBackClick} className='filter-(--icon-filter) cursor-pointer'/>
          {mode === 'create' ? 'Create Listing' : 'Edit Listing'}
        </div>
        <div className='flex flex-col mx-5 flex-1'>
          
          <div className='min-h-50 bg-bg-canvas border-2 border-border-color rounded-md mt-7'>
            {/* Add image here */}
          </div>

          <form id='form' onSubmit={handlePost}>
            <TextareaAutosize
              value={item.title}
              onChange={(e) => setItem({...item, title: e.target.value})}
              className='mt-5 resize-none text-sm items-center text-primary-text bg-bg-surface border border-border-color px-4 py-5 w-full rounded-md decoration-none outline-0 '
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
              className='mt-5 text-sm items-center border border-border-color text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
              placeholder='Price'
              required
            />

            <TextareaAutosize  
              value={item.category}
              onChange={(e) => setItem({...item, category: e.target.value})}
              className='mt-5 resize-none text-sm border border-border-color items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
              placeholder='Category'
              required
            />

            <TextareaAutosize 
              value={item.condition}
              onChange={(e) => setItem({...item, condition: e.target.value})}
              className='mt-5 resize-none text-sm border border-border-color items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
              placeholder='Condition'
              required
            />

            <TextareaAutosize 
              value={item.description}
              onChange={(e) => setItem({...item, description: e.target.value})}
              className='mt-5 text-sm items-center border border-border-color text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
              placeholder='Description'
              required
            />
          </form>

          <h1 className='text-md text-primary-text font-semibold mt-5 mb-1'>Location</h1>
          <div className='flex flex-row gap-2 mb-5'>
            <img src={Location} alt="Location" className='filter-(--icon-filter)'/>
            <h1 className='font-light text-primary-text'>Butuan City</h1>
          </div>          
          
          <button form='form' type='submit' className='gap-2 justify-center items-center flex flex-row mt-auto w-full bg-button-color text-primary-text-inverse font-semibold text-md cursor-pointer rounded-md py-2 '>
            <p>{mode === 'edit' ? 'Save' : 'Post to the Loop'}</p>
          </button>
          
          
        </div>
      </div>
    </>
  )
}

export default SellItem