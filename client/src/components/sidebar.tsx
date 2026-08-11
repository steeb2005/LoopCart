import Close from '../assets/close.svg'
import { motion ,AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/context'
import Home from '../assets/home.svg'
import Profile from '../assets/profile.svg'
import History from '../assets/history.svg'
import LikedItems from '../assets/Heart.svg'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'  
import Light from '../assets/light_mode.svg'
import Dark from '../assets/dark_mode.svg'
import Inbox from '../assets/inbox.svg'
import { Spinner } from './ui/spinner'

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
              className={`pt-3 px-5 border-l border-l-border-color bg-bg-canvas fixed top-0 left-0 min-w-[70%] h-full z-50 flex flex-col`}
              onClick={(e) => e.stopPropagation()}
            >
                
              <div className="flex flex-row justify-end">
                <img onClick={closeSidebar} src={Close} alt="close_svg" className='cursor-pointer filter-(--icon-filter)'/>
              </div>
              <div className="head mb-3 text-primary-text font-semibold border-b border-b-border-color">
                {!user && (
                  <div className='flex flex-col gap-3 pb-3 pt-3'>
                    <Link to={'/sell-item'}>
                      <div className='bg-button-color w-full py-1 text-primary-text-inverse text-center text-lg font-bold'>
                        Sell now
                      </div>
                    </Link>
                    <Link to={'/login'}>
                      <div className='border-2 border-button-color w-full py-1 text-primary-text text-center text-lg font-bold'>
                        Login
                      </div>
                    </Link>
                  </div>
                )}
                {user && (
                  <div className="py-3 flex flex-col justify-center">
                    <div className="bg-bg-inverse ring mb-3 ring-border-color rounded-full h-16 w-16 flex items-center justify-center overflow-hidden">
                      {
                        user?.avatar_url ? (
                          <img src={user.avatar_url} alt="avatar"/>
                        ) : (
                          <span className='text-primary-text-inverse text-3xl font-bold'>
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
                    <h1 className="text-3xl font-semibold">{getStructuredName(user?.firstname, user?.lastname)}</h1>
                    <p className="font-light text-md text-secondary-text">{user?.username}</p>
                    <Link to={'/sell-item'}>
                      <div className='mt-3 bg-button-color w-full py-1 text-primary-text-inverse text-center text-lg font-bold'>
                        Sell now
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              <div className={`text-primary-text navlinks flex flex-col `}>
                
                
                <Link to={'/purchase-history'}>
                  <div className={`${currentLocation === 'purchase-history' ? 'bg-bg-gray-surface' : ''} py-2 px-3 rounded-md flex flex-row items-center gap-3`}>
                    <img src={History} alt="history" className='h-6 filter-(--icon-filter)'/>
                    History
                  </div>
                </Link>
                <Link to={'/liked-items'}>
                  <div className={`${currentLocation === 'liked-items' ? 'bg-bg-gray-surface' : ''} py-2 px-3 rounded-md flex flex-row items-center gap-3`}>
                    <img src={LikedItems} alt="liked-items" className='h-6 filter-(--icon-filter)'/>
                    Favorites
                  </div>
                </Link>
                <Link to={'/messages'}>
                  <div className={`${currentLocation === 'messages' ? 'bg-bg-gray-surface' : ''} py-2 px-3 rounded-md flex flex-row items-center gap-3`}>
                    <img src={Inbox} alt="inbox" className='h-6 filter-(--icon-filter)'/>
                    Inbox
                    {unreadMessages > 0 && 
                      <div className=' font-bold flex justify-center bg-bg-gray-surface rounded-full items-center text-xs h-5 w-5.5 text-primary-text'>
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </div>}
                  </div>
                </Link>
              </div>
              
              <div className="flex flex-row border border-border-color  justify-around font-semibold items-center bg-bg-theme-color rounded-full mt-auto mb-5 text-primary-text py-1.5 px-1.5">
                <div onClick={() => toggleTheme()} className={`${theme === 'light' ? 'bg-button-color' : ''} duration-100 transition-all flex justify-center  w-full text-center py-1 rounded-full cursor-pointer`}>
                  <img src={Light} alt="light_mode" className={``}/>
                </div>
                <div onClick={() => toggleTheme()} className={`${theme === 'dark' ? 'bg-button-color' : ''} duration-100 transition-all flex justify-center  w-full text-center py-1  rounded-full cursor-pointer`}> 
                  <img src={Dark} alt="dark_mode" className={` invert`}/>
                </div>
              </div>

              <button onClick={handleLogout} className='mb-3 text-primary-text-inverse w-full bg-button-color font-semibold text-xl hover:cursor-pointer rounded-md py-2'>
                Logout
              </button> 
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
