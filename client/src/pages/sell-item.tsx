import Back from '../assets/back.svg'
import { useLocation} from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import Location from '../assets/location.svg'
import { useAppContext } from '../context/context'
import { useNavigate, Link } from 'react-router-dom'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import {NumericFormat} from 'react-number-format'
import { NativeSelect, NativeSelectOption, NativeSelectOptGroup } from '../components/ui/native-select'
import AddPhoto from '../assets/add_photo.svg'
import Close from '../assets/close.svg'
import { Spinner } from '../components/ui/spinner'
import { toast } from 'sonner'

type ItemFormData = {
  title: string;
  price: string;  // Keep as string for form input
  category: string;
  condition: string;
  description: string;
  created_at: string;
  sold_at: string | null;
  status: string;
  seller_id: string;
  buyer_id: string | null;
  image: string | null;
  likes: number;
  deleted: boolean;
}

function SellItem(){
  const location = useLocation()
  const navigate = useNavigate()
  const {user, post_item, update_item} = useAppContext() 
  const [error, setError] = useState('')
  const [imgError, setImgError] = useState('')
  const [itemImageFile, setItemImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [item, setItem] = useState<ItemFormData>({
    title: '',
    price: '', 
    category: '',
    condition: '',
    description: '',
    created_at: '',
    sold_at: null,
    status: 'available',
    seller_id: '',
    buyer_id: null,
    image: null,
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
    sold_at: null,
    status: 'available',
    seller_id: '',
    buyer_id: null,
    image: null,
    likes: 0,
    deleted: false
  }


  const mode = location.state?.mode || 'create'
  const item_id = location.state?.id

  useEffect(() => {
    if(mode === 'edit'){
      const initialData = location.state?.item || item
      const itemToEdit = {
        title: initialData.title || '',
        price: initialData.price || '', 
        category: initialData.category || '',
        condition: initialData.condition || '',
        description: initialData.description || '',
        created_at: initialData.created_at || '',
        sold_at: initialData.sold_at || '',
        status: initialData.status || 'available',
        seller_id: initialData.seller_id || '',
        buyer_id: initialData.buyer_id || '',
        image: null,
        likes: initialData.likes || 0,
        deleted: initialData.deleted || false
      }
      setImagePreview(initialData.image)
      setItem(itemToEdit)
    }else{
      setItem(defaultData)
    }
  }, [mode])
  
  
  
  const handlePost = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const created_at = new Date().toISOString();
    const seller_id = user?._id || ''
    
    if(loading){
      console.error('posting item')
      return
    }

    if(!user?.address){
      setError('Add an address to your profile first')
      return
    }
    
    if(mode === 'create'){
      if(!itemImageFile){
        setImgError('Please select an image file')
        return
      }
  
      if(itemImageFile.size > 2 * 1024 * 1024){
        setImgError('Please select a file less than 2mb')
        return
      }
  
      if(!itemImageFile.type.startsWith('image/')){
        setError('Please select a png, jpeg, webp file')
        return
      } 
      
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
      price: Number(item.price) || 0
    }


    try{
      let success = false
      setLoading(true)
      if(mode === 'edit'){
        if(itemImageFile){
          if(itemImageFile.size > 2 * 1024 * 1024){
            console.error('File too large')
            setImgError('Please select a file less than 2mb')
            setLoading(false)
            return
          }

          if(!itemImageFile.type.startsWith('image/')){
            console.error('Invalid file type')  
            setError('Please select a png, jpeg, webp file')
            setLoading(false)
            return
          } 
        }

        await update_item(item_id, itemToEdit, itemImageFile)
        setLoading(false)
        success = true
        if(success){
          toast.success('Successfully updated item', {
            action: {
              label: '✕',
              onClick: () => {
                toast.dismiss
              }
            },
            position: 'top-center'
          })
          navigate('/home')
        }else{
          toast.error('Failed to update item', {
            action: {
              label: '✕',
              onClick: () => {
                toast.dismiss
              }
            },
            position: 'top-center'
          })
        }
      }else{
        if(!itemImageFile){
          console.error('No image file selected')
          setLoading(false)
          return
        } 
        
        await post_item(itemToPost, itemImageFile)
        setLoading(false)
        success = true
        if(success){
          toast.success('Successfully posted item', {
            action: {
              label: '✕',
              onClick: () => {
                toast.dismiss
              }
            },
            position: 'top-center'
          })
          navigate('/home')
        }
      }
    }catch(error){
      toast.error('Hello from Toastify!', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: 'top-center'
      })
      console.error('error in posting item', error);
    }
  }

  const handlePrice = (values: {floatValue?: number}) => {
    setItem({...item, price: values.floatValue !== undefined ? String(values.floatValue) : ''})
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  const displayAddress = [
    user?.address?.building,
    user?.address?.street,
    user?.address?.road,
    user?.address?.neighbourhood,
    user?.address?.suburb,
    user?.address?.quarter,
    user?.address?.village,
    user?.address?.city,
    user?.address?.city_district,
    user?.address?.municipality,
    user?.address?.state_district,
    user?.address?.state,
  ].filter(Boolean)
  
  const imageInputTrigger = () => {
    imageInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file?.type.startsWith('image/')){
      setImgError('Please select a png, jpeg, webp file')     
      return 
    } 

    if(file.size > 2 * 1024 * 1024){
      console.error('file size is greater than 2mb');
      setImgError('Please select a file less than 2mb')
      
      return 
    }

    if(file){
      setImgError('')
      setItemImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setItemImageFile(null)
    setImagePreview(null)
  }

  return(
    <>
      <div className='mx-5 pb-2 lg:mx-30'> 
        <div className='head flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
          <img src={Back} alt="back" onClick={handleBackClick} className='filter-(--icon-filter) cursor-pointer'/>
          {mode === 'create' ? 'Create Listing' : 'Edit Listing'}
        </div>

        <div className='mx-5 grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
          <div className='relative'>
            <div onClick={handleRemoveImage} className={`${imagePreview ? 'block' : 'hidden'} h-6 w-6 absolute cursor-pointer top-2 right-2 bg-bg-surface flex items-center rounded-full justify-center`}>
              <img src={Close} alt="close_svg" className='filter-(--icon-filter) h-4'/>
            </div>
            <input 
              ref={imageInputRef}
              className='hidden'
              type="file" 
              onChange={handleImageChange}
              accept='image/png, image/jpeg, image/webp'
            />

            <div className='h-100 flex justify-center bg-bg-canvas rounded-md overflow-hidden'>
              
              {imagePreview ? (
                <img src={imagePreview} alt="item" className='w-full h-full object-contain '/>
              ) : (
                item?.image ? (
                  <img src={item.image} alt="item" className='w-full h-full object-contain'/>
                ): (
                  <div onClick={imageInputTrigger} className='cursor-pointer h-full flex flex-col justify-center items-center'>
                    <img src={AddPhoto} alt="add_photo_svg" className="filter-(--icon-filter)" />
                    <div className='text-secondary-text'>Add image</div>  
                  </div>
                )
              )}
            </div>
            {imgError && <h1 className=' text-red-500 text-sm'>{imgError}</h1>}
          </div>
          

          <div className='flex flex-col'>
            <form id='form' onSubmit={handlePost}>
              <TextareaAutosize
                value={item.title}
                onChange={(e) => setItem({...item, title: e.target.value})}
                className='resize-none text-sm items-center text-primary-text bg-bg-canvas border border-border-color px-4 py-5 w-full rounded-md decoration-none outline-0 '
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
                className='mt-5 text-sm items-center border border-border-color text-primary-text bg-bg-fances px-4 py-5 w-full rounded-md decoration-none outline-0 bg-bg-canvas'
                placeholder='Price'
                required
              />


              <NativeSelect 
                className="
                  mt-5 w-full border border-border-color rounded-md bg-bg-canvas px-4 py-5 text-sm text-primary-text outline-none 
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
                  mt-5 w-full border border-border-color rounded-md bg-bg-canvas px-4 py-5 text-sm text-primary-text outline-none 
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
                <NativeSelectOption value="New" className="bg-bg-surface text-primary-text">
                  New
                </NativeSelectOption>
                <NativeSelectOption value="Used - Like New" className="bg-bg-surface text-primary-text">
                  Used - Like New
                </NativeSelectOption>
                <NativeSelectOption value="Used - Good" className="bg-bg-surface text-primary-text">
                  Used - Good
                </NativeSelectOption>
                <NativeSelectOption value="Used - Fair" className="bg-bg-surface text-primary-text">
                  Used - Fair
                </NativeSelectOption>
              </NativeSelect>

              
              <TextareaAutosize 
                value={item.description}
                onChange={(e) => setItem({...item, description: e.target.value})}
                className='mt-5 text-sm items-center border border-border-color text-primary-text bg-bg-canvas px-4 py-5 w-full rounded-md decoration-none outline-0'
                placeholder='Description'
                required
              />
            </form>
            <h1 className='text-md text-primary-text font-semibold mb-1 mt-2'>Location</h1>
            <div className='flex flex-row gap-2 mb-5 items-center'>
              <img src={Location} alt="Location" className='filter-(--icon-filter) h-7'/>
              {user?.address ? (
                <h1 className='font-light text-secondary-text text-sm'>{displayAddress.join(' ')}</h1>
              ) : (
                <>
                  <div className='flex flex-col'>

                    <h1 onClick={() => navigate(`/edit-profile/${user?._id}`)} className='cursor-pointer font-light text-primary-text'>No address set</h1>  
                    {error && <h1 className='font-light text-red-500 text-sm'>{error}</h1>}
                  </div>
                </>
              )}
            </div>          
            <button form='form' type='submit' className='gap-2 justify-center items-center flex flex-row mt-auto w-full bg-button-color text-primary-text-inverse font-semibold text-md cursor-pointer rounded-md py-2 '>
              {loading && <Spinner/>}
              <p>{mode === 'edit' ? 'Save' : 'Post to the Loop'}</p>
            </button>
          </div>

            
          
          
        </div>
        {!user?.address && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
            <div className="w-[90%] max-w-md bg-bg-canvas rounded-2xl shadow-2xl border border-border-color overflow-hidden">

              {/* Header with accent */}
              <div className="relative">
                <div className="px-6 pt-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <img src={Location} alt="check" className="filter-(--icon-filter) h-6"/>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary-text">Set Address </h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <h1 className="text-primary-text">Set your address first to sell an item</h1>
              </div>

              <div className="flex flex-row justify-end p-3 border-t border-border-color">
                <Link to={`/edit-profile/${user?._id}`}>
                  <button 
                  
                    className="cursor-pointer text-primary-text-inverse px-3 py-2 rounded-xl bg-button-color border border-border-color"
                  >
                    Set Address
                  </button>
                </Link>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default SellItem