import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Eye from '../assets/Eye.svg'
import EyeOff from '../assets/eye_off.svg'
import {useAppContext} from "../context/context"
import React from "react"
import { toast } from "sonner"
import Logo from '../assets/Logo.svg'
import { Spinner } from "../components/ui/spinner"



export default function Register(){
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register } = useAppContext();
  const [ showPassword, setShowPassword ] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    join_date: '' 
  })

  
  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    if(loading) return // Prevents the user from spamming the register button
    setLoading(true)
    e.preventDefault();
    try{
      
      const trimmedForm = {
        username: formData.username.trim(),
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        join_date: new Date().toISOString()
      }
      
      const res = await register(trimmedForm)
      if(res.success){
        toast.success('Successfully registered', {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
        navigate('/login')
      }else if(res.error === 'User already taken'){
        setError('Username already taken')
        toast.error(res.error, {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
      }else if(res.error === 'Email already exists'){
        setError('Email already exists')
        toast.error(res.error, {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
      }else{
        setError(res.error || 'Registration failed')
        toast.error('Registration failed', {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
      }
    }catch{
      console.error('Regsistration failed');
      setError('Something went wrong please try again')
      toast.error('User already exists', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: 'top-center'
      })
    }finally{
      setLoading(false)
    }
  }


  return(
    <>
      <div className='flex flex-row text-xl z-50 items-center gap-2 font-bold fixed w-full justify-center top-0 border-b border-border-color py-3'>
        <h1>LoopCart</h1>   
        <img src={Logo} alt="logo" className='h-7 filter-(--icon-filter)'/>
      </div>
        {/* Header */}
      <div className="flex flex-col items-center justify-center h-dvh">

        <div className='rounded-md w-70 lg:w-100 flex flex-col items-center justify-center border border-border-color px-5 pt-9 pb-5'>
          <p className='font-semibold lg:text-xl mb-5 text-center'>
            Sign up with email
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <input 
              type="text" 
              value={formData.firstname}
              className='text-sm items-center text-primary-text border-b border-border-color py-2 w-full decoration-none outline-0'
              onChange={(e) => {
                setFormData({...formData, firstname: e.target.value});
              }}
              placeholder='First name'
              required
            />

            <input 
              type="text" 
              value={formData.lastname}
              className='text-sm items-center  text-primary-text border-b border-border-color py-2 w-full decoration-none outline-0'
              onChange={(e) => {
                setFormData({...formData, lastname: e.target.value});
              }}
              placeholder='Last name'
              required
            />

            <input 
              type="text" 
              value={formData.username}
              className='text-sm items-center  text-primary-text border-b border-border-color py-2 w-full decoration-none outline-0'
              onChange={(e) => {
                setFormData({...formData, username: e.target.value});
                setError('');
              }}
              placeholder='Username'
              required
            />

            <input 
              type="text" 
              value={formData.email}
              className='text-sm items-center  text-primary-text border-b border-border-color py-2 w-full decoration-none outline-0'
              onChange={(e) => {
                setFormData({...formData, email: e.target.value})
                setError('')
              }}
              placeholder='Email'
              required
            />

            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={formData.password}
                className='text-sm items-center  text-primary-text border-b border-border-color py-2 w-full decoration-none outline-0'
                onChange={(e) => {
                  setFormData({...formData, password: e.target.value});
                }}
                placeholder='Password'
                required
              />
              <img 
                onClick={handleShowPassword}
                src={showPassword ? Eye : EyeOff} 
                alt="eye" 
                className='absolute right-1 top-2 cursor-pointer'  
              />
            </div>

            <div className="duration-100">
              <p className="text-sm text-red-500 ">{error}</p>
            </div>
            <p className="text-tertiary-text text-center font-light text-xs">By registering an account you agree to the terms and conditions of LoopCart</p>
            <button className='flex flex-row items-center justify-center gap-2 text-primary-text-inverse w-full bg-button-color hover:bg-button-color/80 font-semibold text-lg cursor-pointer rounded-md py-2'>
              {loading && (
                <Spinner/>
              )}
              Continue
            </button>

          </form>

        </div>        
      </div>
    </>
  )
}
