import { useNavigate } from "react-router-dom"
import Back from '../assets/back.svg'
import { useAppContext } from "../context/context"
import Edit from '../assets/edit.svg'
import React, { useEffect, useState } from "react"
import Close from '../assets/close.svg'
import TextareaAutosize from "react-textarea-autosize"
import { DatePicker } from '../components/date-picker'
import {format} from "date-fns"
import { NativeSelect, NativeSelectOption } from "../components/ui/native-select"




export default function EditProfile() {
  const navigate = useNavigate()
  const {user, update_bio, update_birthdate, update_gender} = useAppContext()


  const [editBio, setEditBio] = useState(false)
  const [editBirthdate, setEditBirthdate] = useState(false)
  const [limitReached, setLimitReached] = useState(false)
  const [bio, setBio] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [error, setError] = useState('')
  const [editGender, setEditGender] = useState(false)
  const [gender, setGender] = useState('')

  useEffect(() => {
    if(user.bio){
      setBio(user.bio)  
    }
    if(user.birthdate){
      setBirthdate(user.birthdate)
    }
    if(user.gender){
      setGender(user.gender)
    }
  }, [])

  const handleBackClick = () => {
    navigate(-1)  
  }


  const handleEditBio = () => {
    if(user.bio){
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

  

  if(editGender){
    const handleGenderSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setGender(e.target.value)
    }

    const handleGenderChange = async () => {
      setError('')
      if(gender === user.gender){
        setError('Gender is the same')
        return
      }
      const prev = user.gender
      try{
        user.gender = gender
        await update_gender(user._id, gender)
      }catch{
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
            className="mt-5 w-full border border-border-color rounded-md bg-bg-surface px-3 py-3 text-sm text-primary-text outline-none 
                [&_select]:bg-bg-surface 
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
      }catch{
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
      e.preventDefault()
      const prev = user.bio
      user.bio = bio
      try{
        await update_bio(user._id, bio)
      }catch{
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
              className={`mt-5 resize-none text-sm items-center text-primary-text border ${limitReached ? 'border-red-500' : 'border-border-color'} px-4 py-5 w-full rounded-md decoration-none outline-0`}
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
      
      <div className="lg:border lg:border-border-color rounded-md p-5 mt-5 ">

        <div className=" flex flex-row gap-5 text-primary-text ">
          <div className="w-20 h-20 bg-bg-inverse rounded-full items-center justify-center flex">
            {user?.avatar_url ? (<img src={user.avatar_url} alt="avatar"/>) : (<span className='text-primary-text-inverse text-3xl font-bold'>{user?.username.charAt(0).toUpperCase()}</span>) }
          </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-bold text-2xl">
                {user?.firstname} {user?.lastname}
              </h1>
              <h1 className="text-secondary-text">@{user?.username}</h1>
              
            </div>
        </div>


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
            <div className="flex flex-row justify-between items-center py-1 hover:bg-bg-surface active:bg-bg-surface w-full duration-100 cursor-pointer">
              <p className="text-secondary-text">{user?.address || 'Current city or town'}</p>
              <img src={Edit} alt="edit-svg" className="filter-(--icon-filter)"/>
            </div>
          </div>
        </div>
      </div>
    </div>

        
      
    </>
  )

}