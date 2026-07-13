import Close from '../assets/close.svg'
import { motion ,AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/context'
import Home from '../assets/home.svg'
import Profile from '../assets/profile.svg'
import History from '../assets/history.svg'
import LikedItems from '../assets/Heart.svg'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'  
import Message from '../assets/message.svg'
import Light from '../assets/light_mode.svg'
import Dark from '../assets/dark_mode.svg'

export default function Sidebar({closeSidebar, isOpenSidebar}: {
  closeSidebar: () => void, 
  isOpenSidebar: boolean
}){
  const location = useLocation();
  const currentLocation = location.pathname.substring(1) || ' ';
  const {user, logout, inbox, toggleTheme, theme} = useAppContext()
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogout = () => {
    setIsLoading(true);    
    logout()
    navigate('/login');
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
    unreadMessages += conversation.unread_count
  })

  

  if(isLoading){
    return (
      <div className="text-xl text-primary-text fixed w-full inset-0 overflow-hidden z-100 flex items-center justify-center">
        <div className='flex flex-col justify-center items-center bg-bg-canvas px-10 py-8 rounded-xl'>
          <p className="text-xl">Logging out...</p>
        </div>
      </div>
    )
  }

  


  return(
    <>
      <AnimatePresence>
        {isOpenSidebar && (
          <div onClick={closeSidebar} className='fixed inset-0 z-100'>
            <motion.div 
              initial={{x: "100%"}}
              animate={{x: 0}}
              exit={{x: "100%"}}
              transition={{type: "spring", damping: 25, stiffness: 200}}
              className="pt-3 px-5 border-l border-l-border-color bg-bg-canvas fixed top-0 right-0 min-w-[70%] h-full z-50 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
                
              <div className="flex flex-row justify-end">
                <img onClick={closeSidebar} src={Close} alt="close_svg" className='cursor-pointer filter-(--icon-filter)'/>
              </div>
              <div className="head mb-3 text-primary-text font-semibold border-b border-b-border-color">
                <div className="py-3 flex flex-col gap-1 justify-center">
                  <div className="bg-bg-inverse rounded-full h-16 w-16 flex items-center justify-center">
                    {user?.avatar_url ? (<img src={user.avatar_url} alt="avatar"/>) : (<span className='text-primary-text-inverse text-3xl font-bold'>{user?.username.charAt(0).toUpperCase()}</span>) }

                  </div>
                  <h1 className="text-3xl font-semibold">{user?.username}</h1>
                  <p className="font-light text-md">{user?.email}</p>
                </div>
              </div>

              <div className={`font-semibold text-primary-text navlinks flex flex-col `}>
                <Link to={'/user-profile'}>
                  <div className={`${currentLocation === 'user-profile' ? 'bg-bg-gray-surface' : ''} py-2 px-3 rounded-md flex flex-row items-center gap-3`}>
                    <img src={Profile} alt="profile" className='h-6 filter-(--icon-filter)'/>
                    Profile
                  </div>
                </Link>
                <Link to={'/home'}>
                  <div className={`${currentLocation === 'home' ? 'bg-bg-gray-surface' : ''} py-2 px-3 rounded-md flex flex-row items-center gap-3`}>
                    <img src={Home} alt="home" className={`h-6 filter-(--icon-filter)`}/>
                    Home
                  </div>
                </Link>
                <Link to={'/purchase-history'}>
                  <div className={`${currentLocation === 'purchase-history' ? 'bg-bg-gray-surface' : ''} py-2 px-3 rounded-md flex flex-row items-center gap-3`}>
                    <img src={History} alt="history" className='h-6 filter-(--icon-filter)'/>
                    History
                  </div>
                </Link>
                <Link to={'/liked-items'}>
                  <div className={`${currentLocation === 'liked-items' ? 'bg-bg-gray-surface' : ''} py-2 px-3 rounded-md flex flex-row items-center gap-3`}>
                    <img src={LikedItems} alt="liked-items" className='h-6 filter-(--icon-filter)'/>
                    Liked Items
                  </div>
                </Link>
                <Link to={'/inbox'}>
                  <div className={`${currentLocation === 'inbox' ? 'bg-bg-gray-surface' : ''} py-2 px-3 rounded-md flex flex-row items-center gap-3`}>
                    <div className='relative'>
                      <img src={Message} alt="message" className='h-6 filter-(--icon-filter)'/>
                      
                      {unreadMessages > 0 && 
                        <div className='absolute top-2 -right-2 font-bold border-2 border-bg-surface flex justify-center bg-primary-text rounded-full items-center text-[10px] h-5 w-5.5 text-primary-text-inverse'>
                          {unreadMessages > 9 ? '9+' : unreadMessages}
                        </div>}
                    </div>
                    Messages
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
