import Logo from '../assets/Logo.svg'
import Eye from '../assets/Eye.svg'
import EyeOff from '../assets/eye_off.svg'
import { Link } from 'react-router-dom'
import BackArrow from '../assets/arrow_back.svg'
import { useState } from 'react'
import { useAppContext } from '../context/context'
import { useNavigate } from 'react-router-dom'

function Login(){
  const navigate = useNavigate()
  const { login } = useAppContext()
  const [ showPassword, setShowPassword ] = useState(false)
  const [ formData, setFormData ] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }


  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    setError('')
    e.preventDefault();
    try{
      const res = await login(formData)
      if(res.success){
        navigate('/home')
      }else{
        setError(res.error || 'Login failed')
      }
    }catch{
      setError('Something went wrong please try again')
    }
  }

  const handleRememberMe = () => {
    setRememberMe(!rememberMe)
    const res = rememberMe
    console.log(res)
  }

  return(
    <div className="mx-10 p-0 m-0 overflow-hidden min-h-screen py-5">
      <div>
        <Link to={'/'}>
          <img src={BackArrow} alt="arrow" className='h-10 w-10'/>
        </Link>
      </div>
      <div className="text-primary-text flex flex-col mt-20">
        <h1 className="font-semibold text-3xl">Welcome Back!</h1>
        <h1 className="font-semibold text-3xl">Login to</h1>
        <div className='flex flex-row'>
          <h1 className="font-semibold text-3xl ">LoopCart</h1>
          <img src={Logo} alt="logpo" className='ml-4 h-11 w-11'/>
        </div>
        <p className='font-light text-3xl mt-3'>Buy. Sell. repeat the loop.</p>
      </div>

      <div className='mt-10'>
        <form onSubmit={handleSubmit} >
          <input 
            type="email" 
            value={formData.email}
            className='text-sm items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0'
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder='Email'
            required
          />

          <div className='relative'>
            <input 
              type={showPassword ? "text" : "password"} 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className='mt-5 text-sm items-center text-primary-text bg-bg-surface px-4 py-5 w-full rounded-md decoration-none outline-0 pr-12'  // ← added pr-12
              placeholder='Password'
              required
            />
            <img 
              src={showPassword ? Eye : EyeOff} 
              alt="eye" 
              className='absolute right-3 top-10 cursor-pointer'  
              onClick={handleShowPassword}
            />
          </div>
          <div className='mt-3'>
            <p className='text-sm text-red-400'>{error}</p>
          </div>
          <div className='mt-3 flex flex-row text-primary-text' >
            <input 
              onChange={handleRememberMe}
              type="checkbox" 
              className='
                outline-none
                appreance-none
                hover:cursor-pointer 
                accent-bg-surface 
                bg-transparent'/>
            <p className='ml-2'>Remember Me</p>
          </div>
          
          <button className='mt-5 w-full bg-bg-inverse font-semibold text-xl hover:cursor-pointer rounded-md py-2'>
            Login
          </button>
          

        </form>


        <div className='text-center mt-10 text-primary-text'>
          <p>New to LoopCart? <Link to={'/register'} className='underline'>Create an account</Link></p>
        </div>
      </div>
      
    </div>
  )  
}

export default Login