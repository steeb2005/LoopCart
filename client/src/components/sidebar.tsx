import Close from '../assets/close.svg'
import { motion ,AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/context'
import History from '../assets/history.svg'
import LikedItems from '../assets/Heart.svg'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'  
import Light from '../assets/light_mode.svg'
import Dark from '../assets/dark_mode.svg'
import { Spinner } from './ui/spinner'
import ArrowRight from '../assets/ArrowRight.svg'
import Logo from '../assets/Logo.svg'


// TODO
// - Make the landing page into the homepage and make the login and register dynamic
// - Put the categories in the sidebar for mobile and below the header for desktop

export default function Sidebar({closeSidebar, isOpenSidebar}: {
  closeSidebar: () => void, 
  isOpenSidebar: boolean
}){
  const location = useLocation();
  const currentLocation = location.pathname.substring(1) || ' ';
  const {user, logout, inbox, toggleTheme, theme} = useAppContext()
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const CATEGORIES = [
    { id: 'phones', label: 'Phones' },
    { id: 'electronics_computers', label: 'Electronics' },
    { id: 'jewelry', label: 'Jewelry' },
    { id: 'bags', label: 'Bags' },
    { id: 'mens_clothing', label: "Men" },
    { id: 'womens_clothing', label: "Women" },
  ];

  const handleLogout = async () => {
    setIsLoading(true);    
    try{
      await logout()
      navigate('/')
    }finally{
      setIsLoading(false)
      closeSidebar()
    }
  }

  useEffect(() => { // Disable scroll when modal is active
    if(isOpenSidebar){
      document.body.style.overflow = "hidden"

    }else{
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpenSidebar])


  let unreadMessages = 0

  inbox.forEach((conversation) => {
    unreadMessages += conversation.unread_count || 0
  })

  const getStructuredName = (firstname?: string, lastname?: string) => {
    if(firstname && !lastname) return (firstname.charAt(0).toUpperCase() + firstname.slice(1))
    if(!firstname && lastname) return (lastname.charAt(0).toUpperCase() + lastname.slice(1))
    if (!firstname || !lastname) return 'Unknown'
    return (firstname.charAt(0).toUpperCase() + firstname.slice(1)) + " " + (lastname.charAt(0).toUpperCase()) + "."
  }

  if(isLoading){
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className='flex flex-col items-center gap-3 bg-bg-canvas px-8 py-6 rounded-xl shadow-xl'>
          <Spinner/>
          <p className='text-primary-text text-sm font-medium'>Logging out...</p>
        </div>
      </div>
    )
  }

  

  return(
    <>
      <AnimatePresence>
        {isOpenSidebar && (
          <div onClick={closeSidebar} className={`fixed inset-0 z-100`}>
            <motion.div 
              initial={{x: "-100%"}}
              animate={{x: 0}}
              exit={{x: "-100%"}}
              transition={{type: "spring", damping: 25, stiffness: 200}}
              className={`pt-3 border-l  overflow-y-auto border-l-border-color bg-bg-canvas fixed top-0 left-0 min-w-[90%] h-full z-50 flex flex-col`}
              onClick={(e) => e.stopPropagation()}
            >
                
              <div className="flex flex-row justify-between px-5 mb-2">
                <div className='flex flex-row text-xl items-center gap-2 font-bold'>
                  <h1>LoopCart</h1>   
                  <img src={Logo} alt="logo" className='h-7 filter-(--icon-filter)'/>

                </div>
                <p 
                  onClick={closeSidebar}
                  className='text-2xl font-thin'>✕</p>
              </div>
              <div className="head mb-3 text-primary-text font-semibold border-b border-border-color">
                {!user && (
                  <div className='flex flex-col gap-3 pb-3 pt-3 px-5'>
                    <Link to={'/sell-item'}>
                      <div className='bg-button-color w-full py-1 text-primary-text-inverse text-center text-lg font-semibold'>
                        Sell now
                      </div>
                    </Link>
                    
                    <Link to={'/register'}>
                      <div className='border-2 border-button-color w-full py-1 text-primary-text text-center text-lg font-semibold'>
                        Sign up
                      </div>
                    </Link>
                    <Link to={'/login'}>
                      <div className='border-2 border-button-color w-full py-1 text-primary-text text-center text-lg font-semibold'>
                        Login
                      </div>
                    </Link>
                  </div>
                )}
              </div>
                

              <div className={`text-primary-text navlinks flex flex-col pb-3 px-5 border-b border-border-color`}>
                {CATEGORIES.map((category) => (
                  <div className='flex flex-row justify-between items-center py-4 font-semibold'>
                    <p>
                      {category.label}
                    </p>
                    <img src={ArrowRight} alt="arrow_right" className='filter-(--icon-filter) h-5'/>
                  </div>
                ))}
              </div>
                

              {user && (
                <div className='flex flex-col font-light  mb-3'>
                  <Link to={'/user-profile'}>
                    <div className={`${currentLocation === 'user-profile' ? 'bg-bg-gray-surface' : ''} px-5 justify-between py-2 flex flex-row items-center gap-3`}>
                    <p>
                      Your profile
                    </p>
                    <div className='flex h-8 w-8 ring ring-border-color rounded-full bg-bg-inverse justify-center items-center cursor-pointer overflow-hidden'>
                        {
                          user?.avatar_url ? (
                            <img src={user.avatar_url} alt="avatar" referrerPolicy="no-referrer"/>
                          ) : (
                            <span className='text-primary-text-inverse text-sm'>
                              {
                                user?.username ? (
                                  user?.username.charAt(0).toUpperCase()
                                ) : (
                                  '?'
                                )
                              }
                            </span>
                          ) 
                        }
                      </div>
                    </div>
                  </Link>
                  <Link to={'/sell-item'}>
                    <div className={`${currentLocation === 'sell-item' ? 'bg-bg-gray-surface' : ''} px-5 py-2 flex flex-row items-center gap-3`}>
                      Sell
                    </div>
                  </Link>
                  <Link to={'/purchase-history'}>
                    <div className={`${currentLocation === 'purchase-history' ? 'bg-bg-gray-surface' : ''} px-5 py-2 flex flex-row items-center gap-3`}>
                      Purchases
                    </div>
                  </Link>
                  <Link to={'/liked-items'}>
                    <div className={`${currentLocation === 'liked-items' ? 'bg-bg-gray-surface' : ''} px-5 py-2 flex flex-row items-center gap-3`}>
                      Favorites
                    </div>
                  </Link>
                </div>
              )}
              
              <div className="flex mx-5 flex-row border border-border-color justify-around font-semibold items-center bg-bg-theme-color rounded-full mt-auto mb-5 text-primary-text py-0.5 px-0.5">
                <div onClick={() => toggleTheme()} className={`${theme === 'light' ? 'bg-button-color' : ''} duration-100 transition-all flex justify-center  w-full text-center py-1 rounded-full cursor-pointer`}>
                  <img src={Light} alt="light_mode" className={``}/>
                </div>
                <div onClick={() => toggleTheme()} className={`${theme === 'dark' ? 'bg-button-color' : ''} duration-100 transition-all flex justify-center  w-full text-center py-1  rounded-full cursor-pointer`}> 
                  <img src={Dark} alt="dark_mode" className={` invert`}/>
                </div>
              </div>
              {user && (
                <button onClick={handleLogout} className='mx-5 mb-3 text-primary-text-inverse  bg-button-color font-semibold text-xl hover:cursor-pointer rounded-md py-2'>
                  Logout
                </button> 
                
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
