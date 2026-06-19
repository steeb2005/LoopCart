import Close from '../assets/close.svg'
import { motion ,AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/context'
import Home from '../assets/home.svg'
import Profile from '../assets/profile.svg'
import History from '../assets/history.svg'
import LikedItems from '../assets/Heart.svg'
import ItemBox from '../assets/items.svg'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'  

export default function Sidebar({closeSidebar, isOpenSidebar}: {
  closeSidebar: () => void, 
  isOpenSidebar: boolean
}){
  const location = useLocation();
  const currentLocation = location.pathname.substring(1) || ' ';
  const {user, logout} = useAppContext()
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

  if(isLoading){
    return (
      <div className="text-xl text-primary-text  fixed inset-0 z-100 flex items-center justify-center">
        <div className='flex flex-col bg-bg-canvas px-10 py-8 rounded-xl'>
          <p className="mt-4 text-xl">Logging out...</p>
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
              className="pt-3 px-5 border-l border-l-border-color bg-bg-canvas fixed top-0 right-0 min-w-[70%] min-h-screen z-50 flex flex-col"
              onClick={(e) => e.stopPropagation()}
              
            >
                
              <div className="flex flex-row justify-end">
                <img onClick={closeSidebar} src={Close} alt="close_svg" />
              </div>
              <div className="head mb-3 text-primary-text font-semibold border-b border-b-border-color">
                <div className="py-3 flex flex-col gap-1 justify-center">
                  <div className="bg-bg-inverse rounded-full h-16 w-16">
                    {/* User profile image */}
                  </div>
                  <h1 className="text-3xl font-semibold">{user?.username}</h1>
                  <p className="font-light text-md">{user?.email}</p>
                </div>
              </div>

              <div className="font-semibold text-primary-text navlinks flex flex-col ">
                <div className='py-2 px-3 rounded-md flex flex-row items-center gap-3'>
                  <img src={Profile} alt="profile" className='h-6'/>
                  Profile
                </div>
                <Link to={'/home'}>
                  <div className={`${currentLocation === 'home' ? 'bg-bg-surface' : ''} py-2 px-3 rounded-md flex flex-row items-center gap-3`}>
                    <img src={Home} alt="home" className='h-6'/>
                    Home
                  </div>
                </Link>
                <div className='py-2 px-3 rounded-md flex flex-row items-center gap-3'>
                  <img src={History} alt="history" className='h-6'/>
                  History
                </div>
                <Link to={'/liked-items'}>
                  <div className={`${currentLocation === 'liked-items' ? 'bg-bg-surface' : ''} py-2 px-3 rounded-md flex flex-row items-center gap-3`}>
                    <img src={LikedItems} alt="liked-items" className='h-6'/>
                    Liked Items
                  </div>
                </Link>
                <div className='py-2 px-3 rounded-md flex flex-row items-center gap-3'>
                  <img src={ItemBox} alt="my-items" className='h-6'/>
                  My Items
                </div>
              </div>
              <button onClick={handleLogout} className='mt-auto mb-3 w-full bg-bg-inverse font-semibold text-xl hover:cursor-pointer rounded-md py-2'>
                Logout
              </button> 
                
                
                
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
