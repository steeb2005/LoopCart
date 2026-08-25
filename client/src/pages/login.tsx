import Logo from '../assets/Logo.svg'
import Eye from '../assets/Eye.svg'
import EyeOff from '../assets/eye_off.svg'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppContext } from '../context/context'
import { useNavigate } from 'react-router-dom'
import GoogleIcon from '../assets/google_icon.svg'
import { useGoogleLogin } from "@react-oauth/google";
import { Spinner } from '../components/ui/spinner'
import { toast } from 'sonner'
/*
  TODO
  - Fix the Register account page as well (looks fucking ugly af)
*/


export default function Login(){
  const navigate = useNavigate()
  const { login, user, google_login } = useAppContext()
  const [ showPassword, setShowPassword ] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [usingEmail, setUsingEmail] = useState(false)
  const [ formData, setFormData ] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  useEffect(() => {
    const autoLogin = () => {
      
      if(user){
        // console.log('autologged')
        setLoading(true)
        navigate('/')
      }else{
        setLoading(false)
      }
    }
    autoLogin()
  }, [user])

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    setError('')
    setLoading(true)
    e.preventDefault();
    try{
      const res = await login(formData)
      if(res.success){
        navigate(-1)
      }else{
        setError(res.error || 'Login failed')
        toast.error('Login failed', {
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
      setError('Something went wrong please try again')
      toast.error('Something went wrong please try again', {
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

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      if(!codeResponse.access_token) return
      setLoading(true)
      const res = await google_login(codeResponse.access_token) 
      if(res.success){
        setLoading(false)
        navigate(-1)
      }else{
        console.error(res.error)
        toast.error('Login failed', {
          action: {
            label: '✕',
            onClick: () => {
              toast.dismiss
            }
          },
          position: 'top-center'
        })
        setLoading(false)
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error)
      toast.error('Login failed', {
        action: {
          label: '✕',
          onClick: () => {
            toast.dismiss
          }
        },
        position: 'top-center'
      })
      setLoading(false)
    }
  })

  const handleToggleUseEmail = (val: boolean) => {
    setUsingEmail(val)
  }

 
  return(

    <div className="flex items-center justify-center h-dvh">
      {/* Header */}
      <div className='flex flex-row text-xl items-center gap-2 font-bold fixed w-full justify-center top-0 border-b border-border-color py-3'>
        <h1>LoopCart</h1>   
        <img src={Logo} alt="logo" className='h-7 filter-(--icon-filter)'/>
      </div>

      {/* Login/Signin Form */}
      {usingEmail ? (
        <div className='rounded-md  flex flex-col items-center justify-center border border-border-color px-5 py-9'>
          <p className='font-semibold lg:text-xl mb-5 text-center'>
            Login with email
          </p>
          <div className=''>
            <form onSubmit={handleSubmit} >
              <input 
                type="email" 
                value={formData.email}
                className='text-sm items-center lg:w-90 text-primary-text border-b border-border-color py-2 w-full decoration-none outline-0'
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder='Email'
                required
              />

              <div className='relative'>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className='mt-5 text-sm lg:w-90 items-center text-primary-text border-b border-border-color py-2 w-full decoration-none outline-0 pr-12'  // ← added pr-12
                  placeholder='Password'
                  required
                />
                <img 
                  src={showPassword ? Eye : EyeOff} 
                  alt="eye" 
                  className='absolute right-0 top-7 cursor-pointer h-5'  
                  onClick={handleShowPassword}
                />
              </div>
              <div className='mt-3'>
                <p className='text-sm text-red-400'>{error}</p>
              </div>
              <div className='mt-3 flex flex-row text-primary-text' >
                <input 
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  type="checkbox" 
                  className='
                    outline-none
                    appreance-none
                    hover:cursor-pointer 
                    accent-bg-surface 
                    bg-transparent'/>
                <p className='ml-2 text-sm text-secondary-text'>Remember Me</p>
              </div>
              {loading ? (
                <button className='justify-center items-center flex flex-row gap-2 pointer-events-none mt-5 text-primary-text-inverse w-full font-semibold bg-button-color/80 cursor-pointer rounded-md py-2'>
                  <Spinner/>
                  Continue
                </button>
              ) : (
                <button type='submit' className='mt-5 text-primary-text-inverse w-full bg-button-color font-semibold hover:bg-button-color/80 cursor-pointer rounded-md py-2'>
                  Continue
                </button>
              )}
            </form>
            <div 
              onClick={() => handleToggleUseEmail(false)}
              className='text-secondary-text mt-3 cursor-pointer hover:text-primary-text flex flex-row justify-start text-sm'>
              Back
            </div>
          </div>
        </div>        
      ) : (

        <div className='rounded-md flex flex-col items-center justify-center border border-border-color px-5 py-9'>
          <p className='font-semibold lg:text-xl mb-7 text-center'>
            Become part of the loop and <br /> sell your pre-loved finds.
          </p>
          <button onClick={() => handleGoogleLogin()} type='button' className='mb-2 hover:bg-bg-surface duration-100 items-center gap-2 flex flex-row justify-center text-primary-text border-border-color border w-full font-semibold cursor-pointer lg:px-15 rounded-md py-2'>
            <img src={GoogleIcon} alt="google" className='h-5'/>
            Continue with Google
          </button>
          <button onClick={() => handleToggleUseEmail(true)} type='button' className='hover:bg-button-color/80 bg-button-color text-primary-text-inverse duration-100 items-center gap-2 flex flex-row justify-center border-border-color border w-full font-semibold cursor-pointer lg:px-15 rounded-md py-2'>
            Continue with Email
          </button>
          <div className='text-center mt-5 text-secondary-text text-sm'>
            <p>New to LoopCart? <Link to={'/register'} className='underline'>Create an account</Link></p>
          </div>
        </div>
      )}
    </div>
  )  
}

