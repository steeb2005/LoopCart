import { useNavigate } from "react-router-dom"
import Back from '../assets/back.svg'
import { useAppContext } from "../context/context"
import Edit from '../assets/edit.svg'
import React, { useEffect, useState, useRef } from "react"
import Close from '../assets/close.svg'
import TextareaAutosize from "react-textarea-autosize"
import { DatePicker } from '../components/date-picker'
import { format } from "date-fns"
import { NativeSelect, NativeSelectOption } from "../components/ui/native-select"
import Erase from '../assets/close.svg'
import BackArrow from '../assets/arrow_back.svg'
import Camera from '../assets/camera.svg'
import { toast } from "sonner"
/*
  TODO
  - Make toasts that show if the profile is updated or not (from shadcn). 
  - Add password hashing
*/

type NominatimResult = {
  place_id: number,
  display_name: string,
  lat: string,
  lon: string,
  address: {
    country: string,
    country_code: string,
    city: string,
    suburb: string,
    neighbourhood: string,
    street: string,
    road: string,
    state_district: string,
    postcode: string,
    state: string,
    city_district: string,
    building: string,
    municipality: string,
    county: string,
    amenity: string, 
    landuse: string,
    region: string,
    village: string,
    quarter: string
  }
}


type AddressDetails = { 
  country: string,
  country_code: string,
  city: string,
  suburb: string,
  neighbourhood: string,
  street: string,
  road: string,
  state_district: string,
  postcode: string,
  state: string,
  city_district: string,
  building: string,
  municipality: string,
  county: string,
  amenity: string, 
  landuse: string,
  region: string,
  village: string,
  quarter: string
}



export default function EditProfile() {
  const navigate = useNavigate()
  const {user, update_bio, update_birthdate, update_gender, update_address, update_username, upload_avatar} = useAppContext()


  const [editBio, setEditBio] = useState(false)
  const [editBirthdate, setEditBirthdate] = useState(false)
  const [limitReached, setLimitReached] = useState(false)
  const [bio, setBio] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [error, setError] = useState('')
  const [editGender, setEditGender] = useState(false)
  const [gender, setGender] = useState('')
  const [openLocationMenu, setOpenLocationMenu] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<NominatimResult[]>([])
  const [address, setAddress] = useState<AddressDetails | null>(null)
  const [editUsername, setEditUsername] = useState(false)
  const [username, setUsername] = useState(user?.username || '')

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loadingAvatar, setLoadingAvatar] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if(!user) return null
  
  const handleTriggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setLoadingAvatar(true)
    const file = e.target.files?.[0]
    if(!file?.type.startsWith('image/')){
      setError('Please select a png, jpeg, webp file')
      setLoadingAvatar(false)
      return 
    } 

    if(file.size > 2 * 1024 * 1024){
      console.error('file size is greater than 2mb');
      setError('Please select a file less than 2mb')
      setLoadingAvatar(false)
      return null
    }

    if(file){
      if(file.type.startsWith('image/')){
        setAvatarFile(file)
        setPreviewImageUrl(URL.createObjectURL(file))
      }else{
        setPreviewImageUrl(null)
      }
    }
    setLoadingAvatar(false)
  }

  const handleCancelPreview = () => {
    setError('')
    setAvatarFile(null)
    setPreviewImageUrl(null)
    setLoadingAvatar(false)
  }

  const handleSetAvatar = async () => {
    setLoadingAvatar(true)
    try{
      if(avatarFile && user?._id){
        await upload_avatar(user._id, avatarFile)
      } 
      toast.success('Avatar updated', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: 'top-center'
      })
    }catch{
      toast.error('Failed to update avatar', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: 'top-center'
      })
      console.error('something went wrong in uploading file');
    }finally{
      setLoadingAvatar(false)
      setAvatarFile(null)
      setPreviewImageUrl(null)
    }
  }

  useEffect(() => {
    if(user?.bio){
      setBio(user.bio)  
    }
    if(user?.birthdate){
      setBirthdate(user.birthdate)
    }
    if(user?.gender){
      setGender(user.gender)
    }
  }, [])

  const handleBackClick = () => {
    navigate(-1)  
  }


  const handleEditBio = () => {
    if(user?.bio){
      setBio(user.bio)  
    }
    setEditBio(!editBio)
  }

  const handleEditBirthdate = () => {
    setError('')
    setEditBirthdate(!editBirthdate)
  }

  const handleEditGender = () => {
    setEditGender(!editGender)
  }


  const handleEditLocation = () => {
    setOpenLocationMenu(!openLocationMenu)
    setSearchQuery('')
    setResults([])
  }

 
  const handleSearch = async (query: string) => {
    if(isLoading){
      return
    }

    setIsLoading(true)
    try{
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}` +
        `&format=json` +
        `&limit=5` +
        `&countrycodes=ph` +  
        `&addressdetails=1`,
        {
          headers: {
            'Accept-language': 'en-US'
          }
        }
      )
      if(res.ok){
        console.log('success in searching location');
      }
      const data = await res.json()
      setResults(data)
      setIsLoading(false)
    }catch{
      console.error('error in searching location');
    }finally{
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch(searchQuery)
    }
  }

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value === ''){
      setAddress(null)
    }
    setSearchQuery(e.target.value)
  }
  
  const handleErase = () => {
    setSearchQuery('')
    setAddress(null)
  }

  // Break the address into multiple parts then patch it to the db
  const handleSelectAddress = (result: NominatimResult) => {
    if(!result) return
    
    const { 
      country, country_code, city, suburb, neighbourhood, street, road,
      state_district, postcode, state, city_district,
      building, municipality, county, amenity,
      landuse, region, village, quarter
    } = result.address

    setAddress({
      country, country_code, city, suburb, neighbourhood, street, road,
      state_district, postcode, state, city_district,
      building, municipality, county, amenity,
      landuse, region, village, quarter
    })

    setSearchQuery(result.display_name)
  }

  
  const handleChangeAddress = async () => {
    if(!address) return
    
    const prev = user?.address
    if(user?._id){
      try{
        user.address = address
        await update_address(user._id, address)
        toast.success('Successfully updated address', {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
      }catch{
        toast.error('Failed to update address', {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
        user.address = prev
      }finally{
        setOpenLocationMenu(false)
        setSearchQuery('')
        setResults([])
        setAddress(null)
      }
    }
  }

  const handleEditUsername = () => {
    setEditUsername(!editUsername)
    setUsername(user.username || '')  
  }

  const handleUpdateUsername = async () => {
    if(!user._id) return
    setError('')
    if(username === user.username){
      setError('Username is the same')
      return
    }
    const prev = user.username
    try{
      user.username = username
      await update_username(user._id, username)
      toast.success('Successfully updated username', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: 'top-center'
      })
      
    }catch{
      toast.error('Failed to update username', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: 'top-center'
      })
      user.username = prev
    }finally{
      setEditUsername(false)
    }
  }

  const displayAddress = [
    user.address?.building,
    user.address?.street,
    user.address?.road,
    user.address?.neighbourhood,
    user.address?.suburb,
    user.address?.quarter,
    user.address?.village,
    user.address?.city,
    user.address?.city_district,
    user.address?.municipality,
    user.address?.state_district,
    user.address?.state,
  ].filter(Boolean)

  if(editGender){
    const handleGenderSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setGender(e.target.value)
    }

    const handleGenderChange = async () => {
      if(!user._id){
        console.error('user id not found, error in updating gender');
        return
      } 
      setError('')
      if(gender === user.gender){
        setError('Gender is the same')
        return
      }
      const prev = user.gender
      try{
        user.gender = gender
        await update_gender(user._id, gender)
        toast.success('Successfully updated gender', {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
      }catch{
        toast.error('Failed to update gender', {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
        user.gender = prev
      }
      setEditGender(false)
    }
    return(
      <div className="p-0 m-0 h-dvh flex flex-col text-primary-text lg:mx-30 ">
        <div className="head mx-5 flex flex-row gap-8 pt-3 text-primary-text font-semibold">
          <img onClick={handleEditGender} src={Close} alt="back" className="cursor-pointer filter-(--icon-filter)"/>
          Edit Gender
        </div>

        
        <div className="mx-5 flex flex-col">
          <h1 className="font-bold mt-5 mb-3">Gender</h1>
          <NativeSelect 
            value={gender}
            onChange={handleGenderSelect}
            className="mt-5 w-full border border-border-color rounded-md bg-bg-canvas px-3 py-3 text-sm text-primary-text outline-none 
                [&_select]:bg-bg-canvas 
                [&_select]:border-none 
                [&_select]:outline-none 
                [&_select]:focus-visible:ring-0 
                [&_select]:appearance-none
                [&_select]:w-full
                [&_select]:h-full
                [&_select]:p-0
                [&_select]:pl-0
                [&_select]:text-primary-text">
            <NativeSelectOption value={''} disabled className="bg-bg-surface text-primary-text">Select Gender</NativeSelectOption>
            <NativeSelectOption value={'male'} className="bg-bg-surface text-primary-text">Male</NativeSelectOption>
            <NativeSelectOption value={'female'} className="bg-bg-surface text-primary-text">Female</NativeSelectOption>
            <NativeSelectOption value={'gay'} className="bg-bg-surface text-primary-text">Gay</NativeSelectOption>
          </NativeSelect>
          {error && <div className="text-red-400 mt-2 text-sm">{error}</div>}
        </div>
          

        <button 
          onClick={handleGenderChange}
          className='text-primary-text-inverse mx-5 mb-3 mt-auto cursor-pointer bg-button-color font-semibold text-xl hover:cursor-pointer rounded-md py-2'>
          Save
        </button> 
      </div>
    )
  }


  if(editBirthdate){
    const handleDateSelect = (date: string) => {
      setError('')
      setBirthdate(date)
    }

    const handleSubmitBirthdate = async () => {
      if(!user._id){
        console.error('user not found, error in updating birthdate');
        return
      }
      const now = new Date()

      if(!birthdate){
        setError('birthdate is empty') 
        return
      }
      
      const birthdateDate = new Date(birthdate) 

      if(birthdateDate > now || birthdateDate == now){
        setError('birthdate is in the future')
        return
      }

      const prev = user.birthdate
      try{
        user.birthdate = birthdate
        await update_birthdate(user._id, birthdate)
        toast.success('Successfully updated birthdate', {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
      }catch{
        toast.error('Failed to update birthdate', {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
        user.birthdate = prev
      }
      setEditBirthdate(false)
    }

    return(
      <div className="p-0 m-0 h-dvh flex flex-col text-primary-text lg:mx-30">
        <div className="head mx-5 flex flex-row gap-8 pt-3 text-primary-text font-semibold">
          <img onClick={handleEditBirthdate} src={Close} alt="back" className="cursor-pointer filter-(--icon-filter)"/>
          Edit Birthdate
        </div>

        
        <div className="mx-5 flex flex-col">
          <h1 className="font-bold mt-5 mb-3">Add Birthdate</h1>
          <DatePicker onSelect={handleDateSelect} error={error}/>
        </div>
        {error && <p className="mx-5 text-red-400 text-sm mt-1">{error}</p>}
        <button 
          onClick={handleSubmitBirthdate}
          type="submit"
          form="form"
          className='text-primary-text-inverse mx-5 mb-3 mt-auto cursor-pointer bg-button-color font-semibold text-xl hover:cursor-pointer rounded-md py-2'>
          Save
        </button> 
      </div>
    )
  }

    
  if(editBio){
    const handleChangeBio = async (e: React.SubmitEvent<HTMLFormElement>) => {
      if(!user?._id){
        console.error('user not found, error in updating bio');
        return
      } 
      e.preventDefault()
      const prev = user.bio
      user.bio = bio
      try{
        await update_bio(user._id, bio)
        toast.success('Successfully updated bio', {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
      }catch{
        toast.success('Failed to update bio', {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
        user.bio = prev
      }
      setEditBio(false)
    }

    const MAX = 100
    const biolength = bio.trim().split(/\s+/).filter(word => word.length > 0).length

    const handeBioTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const inputText = e.target.value
      const words = inputText.trim().split(/\s+/).filter(word => word.length > 0) 

      if(words.length <= MAX){
        setBio(e.target.value)
        setLimitReached(false)
      }else{
        setLimitReached(true)
      }
    }



    return(
      <div className="p-0 m-0 h-dvh flex flex-col text-primary-text lg:mx-30 ">

        <div className="head mx-5 flex flex-row gap-8 pt-3 text-primary-text font-semibold">
          <img onClick={handleEditBio} src={Close} alt="back" className="cursor-pointer filter-(--icon-filter)"/>
          Edit Bio
        </div>

            
        <div className="mx-5 ">
          <h1 className="font-bold mt-5">Add a bio</h1>
          <form onSubmit={handleChangeBio} id="form">
            <TextareaAutosize 
              value={bio} 
              onChange={handeBioTextChange}
              placeholder="Introduce yourself"
              className={`mt-5 resize-none text-sm items-center text-primary-text border bg-bg-canvas ${limitReached ? 'border-red-500' : 'border-border-color'} px-4 py-5 w-full rounded-md decoration-none outline-0`}
            />
          </form>
          <h1 className="text-secondary-text text-sm">{biolength}/{MAX} words</h1>
        </div>
        
        <button 
          type="submit"
          form="form"
          className='text-primary-text-inverse mx-5 mb-3 mt-auto cursor-pointer bg-button-color font-semibold text-xl hover:cursor-pointer rounded-md py-2'>
          Save
        </button> 
      </div>
    )
  }

  return(
    <>
      <div className='mx-5 lg:mx-30 head flex flex-row gap-8 pt-3 text-primary-text font-semibold '>
        <img onClick={handleBackClick} src={Back} alt="back" className="cursor-pointer filter-(--icon-filter)" />
        Edit Profile
      </div>
      <div className="lg:mx-30">
        
        <div className="shadow-md bg-bg-canvas rounded-md p-5 mt-5 ">

          <div className=" flex flex-row gap-5 text-primary-text ">
            <div className='relative group w-25 h-25'>
              <input 
                ref={fileInputRef}
                className='hidden'
                type="file" 
                onChange={handleFileChange}
                accept='image/png, image/jpeg, image/webp'
              />
                
              <div className="w-full h-full bg-bg-canvas ring ring-border-color rounded-full overflow-hidden items-center justify-center flex">
                { loadingAvatar ? (
                  <div className='animate-spin h-6 w-6 rounded-full border-b border-border-color'></div>
                ) : (
                  previewImageUrl ? (
                  <img src={previewImageUrl} alt="avatar" className="h-full w-full object-cover"/>
                  ) : (
                    user?.avatar_url ? (
                    <img src={user.avatar_url} alt="avatar" className='w-full h-full object-cover'/>) : (
                    <span className='text-primary-text text-3xl font-bold'>
                      {(user?.username!.charAt(0).toUpperCase()) ?? 'U'}
                    </span>)  
                  )
                )
                }
              </div>
              
              <button
                type="button" 
                onClick={handleTriggerFileInput}
                className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs gap-1 cursor-pointer "
              >
                <img src={Camera} alt="camera_svg" className="h-5 w-5" />
                <span>Edit</span>
              </button>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-bold text-2xl">
                {user?.firstname} {user?.lastname}
              </h1>
              <div className="flex flex-row gap-4 items-center">
                
                <h1 className={`${editUsername ? 'hidden' : 'block'} text-secondary-text`}>@{user?.username}</h1>
                <div className={`${!editUsername ? 'hidden' : 'block'} relative`}>
                  <input 
                    type="text" 
                    className={`border focus:outline-none border-border-color text-sm py-1 rounded-md px-2`} 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button 
                    onClick={handleUpdateUsername} 
                    className={`${username === user?.username ? 'hidden' : 'block'} font-semibold absolute bg-button-color cursor-pointer text-primary-text-inverse text-sm rounded-md py-1 px-2 right-0 top-9`}
                  >
                    Save
                  </button>
                </div>
                <img src={Edit} onClick={handleEditUsername} alt="edit_svg" className="cursor-pointer filter-(--icon-filter) h-5"/>
              </div>
            </div>      
          </div>
          {error && (
            <div className='text-sm font-normal mt-3 text-red-500 flex flex-row'>{error}</div>
          )}   
          {previewImageUrl && (
            <div className='flex flex-row gap-2 mt-3 text-sm'>
              <button onClick={handleCancelPreview} className='cursor-pointer border border-border-color text-primary-text px-3 py-1 rounded-md '>
                Cancel
              </button>

              <button onClick={handleSetAvatar} className='cursor-pointer bg-bg-inverse border border-border-color text-primary-text-inverse px-3 py-1 rounded-md '>
                Save
              </button>
            </div>
          )}
          <div className="flex flex-col text-primary-text mt-5">
            <h1 className="text-xl font-bold mb-2 ">About</h1>
            <p onClick={handleEditBio} className="text-secondary-text  py-2 text-sm hover:bg-bg-surface active:bg-bg-surface w-full duration-100 cursor-pointer">
              {user?.bio || 'No bio yet'}
            </p>
          </div>

          
          <div className="flex flex-col gap-5 text-primary-text mt-5">
            <div className='flex flex-row justify-between items-center '>
              <h1 className="text-xl font-bold">Personal Details</h1>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold ">Birthdate</h1>
              <div onClick={handleEditBirthdate} className="flex flex-row py-1 justify-between items-center hover:bg-bg-surface active:bg-bg-surface w-full duration-100 cursor-pointer">
                <p className="text-secondary-text">{user?.birthdate ? format(new Date(user.birthdate), 'MMMM d, yyyy') : 'Set birthdate'}</p>
                <img src={Edit} alt="edit-svg" className="filter-(--icon-filter)"/>
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold ">Gender</h1>
              <div onClick={handleEditGender} className="flex flex-row justify-between items-center  py-1 hover:bg-bg-surface active:bg-bg-surface w-full duration-100 cursor-pointer" >
                <p className="text-secondary-text ">{user?.gender ? (user?.gender.charAt(0).toUpperCase() + user?.gender.slice(1)) : 'Set gender'}</p>
                <img src={Edit} alt="edit-svg" className="filter-(--icon-filter)"/>
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold ">Address</h1>
              <div onClick={handleEditLocation} className="flex flex-row justify-between items-center py-1 hover:bg-bg-surface active:bg-bg-surface w-full duration-100 cursor-pointer">
                <p className={` text-secondary-text`}>
                  {user?.address ? displayAddress.join(' ') : 'Current city or town'}
                </p>
                <img src={Edit} alt="edit-svg" className="filter-(--icon-filter)"/>
              </div>
              {openLocationMenu && 
                <div  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="w-[90%] max-w-md bg-bg-canvas rounded-2xl shadow-2xl border border-border-color overflow-hidden">

                    <div className={`search-bar sticky p-2 flex flex-row justify-between top-0 w-full z-50  transition-all duration-300 ease-in-out `}>
                      <img src={BackArrow} onClick={() => setOpenLocationMenu(false)} alt="back_arrow_svg" className="cursor-pointer absolute left-4.5 top-4 filter-(--icon-filter) h-5"/>
                      <input 
                        value={searchQuery}
                        onChange={handleQueryChange}
                        type="text" 
                        className="pl-13 text-sm items-center text-secondary-text bg-bg-surface py-2 px-13 w-full rounded-full outline-0" 
                        placeholder="Search your location"
                        onKeyDown={handleKeyDown}
                      />
                      
                      <div onClick={handleErase} className={` cursor-pointer absolute right-4 top-3.5 items-center p-1 bg-bg-gray-surface rounded-full`}>
                        <img src={Erase} alt="Erase" className='h-4 filter-(--icon-filter)'/>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 px-6 py-4 h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-bg-gray-surface">
                      {isLoading ? (
                        <div className='flex flex-row text-center justify-center text-sm text-secondary-text'>Loading...</div>
                      ): (
                        results.length > 0 ? (
                        results.map((result, index) => (
                          <div onClick={() => handleSelectAddress(result)} key={index} className='flex flex-col gap-1 text-sm cursor-pointer hover:bg-bg-gray-surface text-primary-text py-2 px-2 duration-100 border-b border-border-color last:border-0'>
                            <p>{result.address.city} {result.address.state} {result.address.region} {result.address.state_district} {result.address.city_district} {result.address.county}</p>
                            <p className="text-secondary-text">{result.address.landuse} {result.address.amenity} {result.address.building} {result.address.village} {result.address.road} {result.address.street} {result.address.suburb} {result.address.neighbourhood} {result.address.postcode} {result.address.municipality}</p>
                          </div>
                        ))
                        ) : (
                          <div className='flex flex-row text-center justify-center text-sm text-secondary-text'>No results</div>
                        )
                      )}
                    </div>    
                    <div className={`${address ? 'flex' : 'hidden'} border-t border-border-color justify-end px-5 py-2 transition-transform duration-100`}>
                      <button onClick={handleChangeAddress} className="cursor-pointer bg-bg-inverse px-4 py-2 rounded-md font-semibold text-primary-text-inverse">
                        Save
                      </button>
                    </div>
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>     
    </>
  )

}
                      
                      