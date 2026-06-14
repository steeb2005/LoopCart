import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import BackArrow from '../assets/arrow_back.svg'
import Eye from '../assets/Eye.svg'
import {useAppContext} from "../context/context"
import React from "react"


/*
TODO:
 - Learn FullStackOpen
 - Try to make a small sample demo using supabase
 - Learn FastAPI
 - Learn FARM Stack
 - Make the login / register backend logic and api routes (take inspo from trackr) make it using FastAPI
*/




function Register(){
  const navigate = useNavigate();
  const { register } = useAppContext();

  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const success = await register(formData)
      if(success){
        navigate('/login')
      }
    }catch{
      console.log('Regsistration failed');
    }
  }





  return(
    <div className="mx-10 p-0 m-0 overflow-hidden min-h-screen py-5">
      <div>
        <Link to={'/'}>
          <img src={BackArrow} alt="backarrow" />
        </Link>
      </div>      
      <div className="text-primary-text mt-15">
        <h1 className="text-3xl font-semibold">Create an account</h1>
        <p>Already have an account? <Link to={'/login'} className="underline">Login</Link> </p>
      </div>

       <div className='mt-10'>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
              placeholder='Username'
              required
            />

            <input 
              type="text" 
              value={formData.firstname}
              onChange={(e) => setFormData({...formData, firstname: e.target.value})}
              className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
              placeholder='First Name'
              required
            />

            <input 
              type="text" 
              value={formData.lastname}
              onChange={(e) => setFormData({...formData, lastname: e.target.value})}
              className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
              placeholder='Last Name'
              required
            />

            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
              placeholder='Email'
              required
            />
  
            <div className='relative'>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0 pr-12'  // ← added pr-12
                placeholder='Password'
                required
              />
              <img 
                src={Eye} 
                alt="eye" 
                className='absolute right-3 top-10 cursor-pointer'  
              />
            </div>
            <p className="text-tertiary-text mt-5 text-center font-light text-sm">By registering an account you agree to the terms and conditions</p>
  
            <button className='mt-10 w-full bg-bg-inverse font-semibold text-xl hover:cursor-pointer rounded-md py-2'>
              Create account
            </button>
          </form>
  
  
           
        </div>
    </div>
  )
}

export default Register
