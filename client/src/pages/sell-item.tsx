import Back from '../assets/back.svg'
import { useLocation} from 'react-router-dom'
import { useEffect, useState } from 'react'
import Location from '../assets/location.svg'
import { useAppContext } from '../context/context'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import {NumericFormat} from 'react-number-format'
import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from '../components/ui/native-select'


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
    likes: 0,
    deleted: false
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
    likes: 0,
    deleted: false
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
        likes: initialData.likes,
        deleted: initialData.deleted
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


            <NativeSelect 
              className="
                mt-5 w-full border border-border-color rounded-md bg-bg-surface px-4 py-5 text-sm text-primary-text outline-none 
                [&_select]:bg-bg-surface 
                [&_select]:border-none 
                [&_select]:outline-none 
                [&_select]:focus-visible:ring-0 
                [&_select]:appearance-none
                [&_select]:w-full
                [&_select]:h-full
                [&_select]:p-0
                [&_select]:pl-0
                [&_select]:text-primary-text
              "
              required
              value={item.category}
              onChange={(e) => setItem({...item, category: e.target.value})}
            >
              <NativeSelectOption value="" disabled className="bg-bg-surface text-primary-text">
                Select Category
              </NativeSelectOption>

              <NativeSelectOptGroup label="Electronics" className='bg-bg-surface text-primary-text '>
                <NativeSelectOption value="phones" className='bg-bg-surface text-secondary-text'>
                  Mobile Phone
                </NativeSelectOption>
                <NativeSelectOption value="electronics_computers" className='bg-bg-surface text-secondary-text'>
                  Electronics & Computers
                </NativeSelectOption>
              </NativeSelectOptGroup>

              <NativeSelectOptGroup label="Clothing & Accessories" className='bg-bg-surface text-primary-text'>
                <NativeSelectOption value="jewelry" className='bg-bg-surface text-secondary-text'>
                  Jewelry
                </NativeSelectOption>
                <NativeSelectOption value="bags" className='bg-bg-surface text-secondary-text'>
                  Bags
                </NativeSelectOption>
                <NativeSelectOption value="mens_clothing" className='bg-bg-surface text-secondary-text'>
                  Men's clothing & shoes
                </NativeSelectOption>
                <NativeSelectOption value="womens_clothing" className='bg-bg-surface text-secondary-text'>
                  Women's clothing & shoes
                </NativeSelectOption>
              </NativeSelectOptGroup>
            </NativeSelect>

            <NativeSelect 
              className="
                mt-5 w-full border border-border-color rounded-md bg-bg-surface px-4 py-5 text-sm text-primary-text outline-none 
                [&_select]:bg-bg-surface 
                [&_select]:border-none 
                [&_select]:outline-none 
                [&_select]:focus-visible:ring-0 
                [&_select]:appearance-none
                [&_select]:w-full
                [&_select]:h-full
                [&_select]:p-0
                [&_select]:pl-0
                [&_select]:text-primary-text
              "
              required
              value={item.condition}
              onChange={(e) => setItem({...item, condition: e.target.value})}
            >
              <NativeSelectOption value="" disabled className="bg-bg-surface text-primary-text">
                Condition
              </NativeSelectOption>
              <NativeSelectOption value="new" className="bg-bg-surface text-primary-text">
                New
              </NativeSelectOption>
              <NativeSelectOption value="like_new" className="bg-bg-surface text-primary-text">
                Used - Like New
              </NativeSelectOption>
              <NativeSelectOption value="good" className="bg-bg-surface text-primary-text">
                Used - Good
              </NativeSelectOption>
              <NativeSelectOption value="fair" className="bg-bg-surface text-primary-text">
                Used - Fair
              </NativeSelectOption>
            </NativeSelect>

            
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