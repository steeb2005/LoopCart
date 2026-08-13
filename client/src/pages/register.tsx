import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Eye from '../assets/Eye.svg'
import EyeOff from '../assets/eye_off.svg'
import {useAppContext} from "../context/context"
import React from "react"
import { toast } from "sonner"





function Register(){
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register } = useAppContext();
  const [ showPassword, setShowPassword ] = useState(false)
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
      }else if(res.error === 'User already exists'){
        setError('User already exists')
      }else if(res.error === 'Email already exists'){
        setError('Email already exists')
      }else{
        setError(res.error || 'Registration failed')
      }
    }catch{
      console.log('Regsistration failed');
      setError('Something went wrong please try again')
    }
  }





  return(
    <div className="flex flex-col items-center h-dvh justify-center lg:p-5">


      <div className="lg:mx-10 py-5 lg:border lg:border-border-color px-10 bg-bg-canvas rounded-2xl  lg:w-[50%]">
            
        <div className="text-primary-text mt-10">
          <h1 className="text-3xl font-semibold">Create an account</h1>
          <p>Already have an account? <Link to={'/login'} className="underline">Login</Link> </p>
        </div>

        <div className='mt-5'>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                value={formData.username}
                onChange={(e) => {
                  setFormData({...formData, username: e.target.value});
                  setError('');
                }}
                className={`${error === 'Username already taken' ? 'border-2 border-red-500' : ''} duration-100 mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-4 w-full rounded-md decoration-none outline-0`}
                placeholder='Username'
                required
              />

              <input 
                type="text" 
                value={formData.firstname}
                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-4 w-full rounded-md decoration-none outline-0'
                placeholder='Firstname'
                required
              />

              <input 
                type="text" 
                value={formData.lastname}
                onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-4 w-full rounded-md decoration-none outline-0'
                placeholder='Lastname'
                required
              />

              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-4 w-full rounded-md decoration-none outline-0'
                placeholder='Email'
                required
              />
    
              <div className='relative'>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-4 w-full rounded-md decoration-none outline-0 pr-12'  // ← added pr-12
                  placeholder='Password'
                  required
                />
                <img 
                  onClick={handleShowPassword}
                  src={showPassword ? Eye : EyeOff} 
                  alt="eye" 
                  className='absolute right-3 top-9 cursor-pointer'  
                />
              </div>
              <div className="mt-2 duration-100">
                <p className="text-sm text-red-400 ">{error}</p>
              </div>
              <p className="text-tertiary-text mt-5 text-center font-light text-sm">By registering an account you agree to the terms and conditions</p>
    
              <button className='mt-5 text-primary-text-inverse w-full bg-button-color font-semibold text-xl hover:cursor-pointer rounded-md py-2'>
                Create account
              </button>
            </form>
    
    
            
          </div>
      </div>
    </div>
  )
}

export default Register
