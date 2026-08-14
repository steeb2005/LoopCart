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

function Login(){
  const navigate = useNavigate()
  const { login, user, google_login } = useAppContext()
  const [ showPassword, setShowPassword ] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
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
    e.preventDefault();
    try{
      const res = await login(formData)
      if(res.success){
        navigate(-1)
      }else{
        setError(res.error || 'Login failed')
      }
    }catch{
      setError('Something went wrong please try again')
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      if(!codeResponse.access_token) return

      const res = await google_login(codeResponse.access_token) 
      if(res.success){
        navigate('/shop')
      }else{
        console.error(res.error)
      }
    },
    onError: (error) => console.log('Login Failed:', error)
  })

  if(loading){
    return(
      <div className="flex items-center justify-center min-h-screen">
        <Spinner/>
      </div>
    )
  }

  return(

    <div className="flex items-center justify-center h-dvh">

      <div className="lg:w-[40%] flex justify-center flex-col px-10 py-6 lg:border lg:border-border-color rounded-2xl bg-bg-canvas">
       
        <div className="text-primary-text flex flex-col mt-10">
          <h1 className="font-semibold text-3xl lg:text-2xl">Login to</h1>
          <div className='flex flex-row gap-2'>
            <h1 className="font-semibold text-3xl lg:text-2xl">LoopCart</h1>
            <img src={Logo} alt="logo" className='h-11 w-11 lg:h-8 filter-(--icon-filter)'/>
          </div>
          <p className='font-light text-2xl mt-3'>Buy. Sell. repeat the loop.</p>
        </div>

        <div className='mt-10'>
          <form onSubmit={handleSubmit} >
            <input 
              type="email" 
              value={formData.email}
              className='text-sm items-center text-primary-text bg-bg-surface px-4 py-4 w-full rounded-md decoration-none outline-0'
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder='Email'
              required
            />

            <div className='relative'>
              <input 
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-4 w-full rounded-md decoration-none outline-0 pr-12'  // ← added pr-12
                placeholder='Password'
                required
              />
              <img 
                src={showPassword ? Eye : EyeOff} 
                alt="eye" 
                className='absolute right-3 top-9 cursor-pointer'  
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
              <p className='ml-2'>Remember Me</p>
            </div>
            
            <div className='flex flex-col gap-1'>
              <button type='submit' className='mt-5 text-primary-text-inverse w-full bg-button-color  font-semibold text-xl hover:cursor-pointer rounded-md py-2'>
                Login
              </button>
              <span className='text-secondary-text text-center'>or</span>
              <button onClick={() => handleGoogleLogin()} type='button' className='hover:bg-bg-surface duration-100 items-center gap-2 flex flex-row justify-center text-primary-text border-border-color border w-full font-semibold hover:cursor-pointer rounded-md py-2'>
                <img src={GoogleIcon} alt="google" className='h-5'/>
                Continue with Google
              </button>
            </div>
          </form>


          <div className='text-center mt-5 text-primary-text'>
            <p>New to LoopCart? <Link to={'/register'} className='underline'>Create an account</Link></p>
          </div>
        </div>
        
      </div>
    </div>
  )  
}

export default Login