import { useNavigate } from "react-router-dom"
import Back from '../assets/back.svg'
import { useAppContext } from "../context/context"
import Edit from '../assets/edit.svg'
import React, { useEffect, useState } from "react"
import Close from '../assets/close.svg'
import TextareaAutosize from "react-textarea-autosize"
import { DatePicker } from '../components/date-picker'
import {format} from "date-fns"

export default function EditProfile() {
  const navigate = useNavigate()
  const {user, update_bio, update_birthdate} = useAppContext()


  const [editBio, setEditBio] = useState(false)
  const [editBirthdate, setEditBirthdate] = useState(false)
  const [limitReached, setLimitReached] = useState(false)
  const [bio, setBio] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [error, setError] = useState('')


  useEffect(() => {
    if(user.bio){
      setBio(user.bio)  
    }
    if(user.birthdate){
      setBirthdate(user.birthdate)
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
      <div className="p-0 m-0 h-dvh flex flex-col text-primary-text">
        <div className="head mx-5 flex flex-row gap-8 pt-3 text-primary-text font-semibold">
          <img onClick={handleEditBirthdate} src={Close} alt="back" className="cursor-pointer"/>
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
          className='mx-5 mb-3 mt-auto cursor-pointer bg-bg-surface font-semibold text-xl hover:cursor-pointer rounded-md py-2'>
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
      <div className="p-0 m-0 h-dvh flex flex-col text-primary-text">
        <div className="head mx-5 flex flex-row gap-8 pt-3 text-primary-text font-semibold">
          <img onClick={handleEditBio} src={Close} alt="back" className="cursor-pointer"/>
          Edit Bio
        </div>

        <div className="mx-5">
          <h1 className="font-bold mt-5">Add a bio</h1>
          <form onSubmit={handleChangeBio} id="form">
            <TextareaAutosize 
              value={bio} 
              onChange={handeBioTextChange}
              placeholder="Introduce yourself"
              className={`mt-5 resize-none text-sm items-center text-primary-text border ${limitReached ? 'border-red-500' : 'border-border-color'} px-4 py-5 w-full rounded-md decoration-none outline-0`}
            />
          </form>
          <h1 className="text-gray-300 text-sm">{biolength}/{MAX} words</h1>
          
          
        </div>
        <button 
          type="submit"
          form="form"
          className='mx-5 mb-3 mt-auto cursor-pointer bg-bg-surface font-semibold text-xl hover:cursor-pointer rounded-md py-2'>
          Save
        </button> 
      </div>
    )
  }

















  return(
    <>
      <div className="p-0 m-0 min-h-screen flex flex-col">
        
        <div className='head mx-5 flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
          <img onClick={handleBackClick} src={Back} alt="back" className="cursor-pointer" />
          Edit Profile
        </div>

        
        <div className=" flex flex-row mt-5 gap-5 text-primary-text mx-5">
          <div className="w-20 h-20 bg-bg-inverse rounded-full items-center justify-center flex">
            {user?.avatar_url ? (<img src={user.avatar_url} alt="avatar"/>) : (<span className='text-primary-text-inverse text-3xl font-bold'>{user?.username.charAt(0).toUpperCase()}</span>) }
          </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-bold text-2xl">
                {user?.firstname} {user?.lastname}
              </h1>
              <h1 className="text-gray-300">@{user?.username}</h1>
              
            </div>
        </div>


        <div className="flex flex-col text-primary-text mt-5">
          <h1 className="text-xl font-bold mb-2 px-5">About</h1>
          <p onClick={handleEditBio} className="text-gray-300 px-5 py-2 text-sm hover:bg-bg-surface active:bg-bg-surface w-full duration-100 cursor-pointer">
            {user?.bio || 'No bio yet'}
          </p>
        </div>

        
        <div className="flex flex-col gap-5 text-primary-text mt-5">
          <div className='flex flex-row justify-between items-center mx-5'>
            <h1 className="text-xl font-bold">Personal Details</h1>
          </div>

          <div className="flex flex-col">
            <h1 className="font-semibold mx-5">Birthdate</h1>
            <div onClick={handleEditBirthdate} className="flex flex-row px-5 py-1 justify-between items-center hover:bg-bg-surface active:bg-bg-surface w-full duration-100 cursor-pointer">
              <p className="text-gray-300">{user?.birthdate ?format(new Date(user.birthdate), 'MMMM d, yyyy') :'Set birthdate'}</p>
              <img src={Edit} alt="edit-svg"/>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="font-semibold mx-5">Gender</h1>
            <div className="flex flex-row justify-between items-center px-5 py-1 hover:bg-bg-surface active:bg-bg-surface w-full duration-100 cursor-pointer" >
              <p className="text-gray-300 ">{user?.gender || 'Set gender'}</p>
              <img src={Edit} alt="edit-svg"/>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="font-semibold mx-5">Address</h1>
            <div className="flex flex-row justify-between items-center px-5 py-1 hover:bg-bg-surface active:bg-bg-surface w-full duration-100 cursor-pointer">
              <p className="text-gray-300">{user?.address || 'Current city or town'}</p>
              <img src={Edit} alt="edit-svg" />
            </div>
          </div>
        </div>

        
      </div>
    </>
  )

}