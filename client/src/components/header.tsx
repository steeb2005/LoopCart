import Logo from '../assets/Logo.svg'
import Menu from '../assets/Menu.svg'
import { useScrollDirection } from '../hooks/scrollDirection';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/context';
import Search from '../assets/search.svg'
import AddBox from '../assets/add_box.svg'
import { useEffect, useRef, useState } from 'react';
import DropArrow from '../assets/arrow_down.svg'
import History from '../assets/history.svg'
import LikedItems from '../assets/Heart.svg'
import Profile from '../assets/profile.svg'
import Dark from '../assets/dark_mode.svg'
import Light from '../assets/light_mode.svg'
import Inbox from '../assets/inbox.svg'



export function Header({openSidebar, isDesktop}: {
  openSidebar: () => void,
  isDesktop: boolean
}){
  const navigate = useNavigate()

  const location = useLocation()
  
  const {inbox, user, toggleTheme, theme, logout} = useAppContext()

  const [openDropdown, setOpenDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let unreadMessages = 0;

  const currentLocation = location.pathname.substring(1)
  const dropDownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(dropDownRef.current && !dropDownRef.current.contains(e.target as Node)){
        setOpenDropdown(false)
      }
    }

    if(openDropdown){
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  inbox.forEach((conversation) => {
    unreadMessages += conversation.unread_count
  })

  const scrollDirection = useScrollDirection();
  
  const isHidden = scrollDirection === 'down';
  

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown)
  }
  
  const handleLogout = () => {
    setIsLoading(true);    
    logout()
    navigate('/login');
  }

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
    <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out
      ${isDesktop ? 'translate-y-0' : isHidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="justify-between bg-bg-canvas border-b text-xl text-primary-text border-border-color items-center flex flex-row py-2 px-3 mb-2">
        
        <Link to={'/home'} className='flex flex-row items-center gap-2 font-bold'>
          <h1>LoopCart</h1>   
          <img src={Logo} alt="logo" className='h-7 filter-(--icon-filter)'/>
        </Link>
      
        <div className='flex flex-row items-center gap-3'>

          <Link to={'/sell-item'}>
            <div className='cursor-pointer'>
              <img src={AddBox} alt="addbox" className='filter-(--icon-filter)'/>
            </div>
          
          </Link>
          <Link to={'/search'}>
            <div className='cursor-pointer'>
              <img src={Search} alt="search" className='h-7 w-7 filter-(--icon-filter)'/>
            </div>
          </Link>

          <div onClick={openSidebar} className='lg:hidden relative cursor-pointer font-bold'>
            <img src={Menu} alt="menu" className='cursor-pointer filter-(--icon-filter)'/>
            {unreadMessages > 0 && 
              <div className='absolute top-0 -right-1 flex border-2 border-bg-canvas justify-center bg-primary-text rounded-full items-center text-center align-middle text-xs h-5 w-6 text-primary-text-inverse'>
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </div>
            }
          </div>


          <Link to={'/inbox'} className='hidden lg:block'>
            <div className='relative'>
              <img src={Inbox} alt="inbox" className='filter-(--icon-filter)'/>
              {unreadMessages > 0 && 
                <div className='absolute -top-2 -right-2 flex border-2 border-bg-canvas justify-center bg-bg-inverse rounded-full items-center text-center  text-xs w-4 h-4 p-2 text-primary-text-inverse'>
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </div>
              }
            </div>
          </Link>


          {/* User profile display for large screens */}
          <div className='hidden lg:flex flex-row items-center gap-3'>
            <Link to={'/user-profile'}>
              <div className='flex h-8 w-8 rounded-full bg-bg-inverse justify-center items-center cursor-pointer'>
                {user?.avatar_url ? (<img src={user.avatar_url} alt="avatar"/>) : (<span className='text-primary-text-inverse text-sm '>{user?.username.charAt(0).toUpperCase()}</span>) }
              </div>
            </Link>
            <div className='flex flex-col'>
              <p className='text-sm font-bold'>{user?.firstname.charAt(0).toUpperCase() + user?.firstname.slice(1)} {user?.lastname.charAt(0).toUpperCase()}.</p>
              <p className='text-xs text-secondary-text font-light'>{user?.username}</p>
            </div>  
            
            {/* Dropdown Component */}
            <div ref={dropDownRef}>
              <img onClick={handleDropdown} src={DropArrow} alt="arrow_down" className='cursor-pointer filter-(--icon-filter)'/>
              {openDropdown && (
        
                <div className='absolute top-14 min-w-[15%] rounded-lg border border-border-color right-0 flex flex-col text-sm text-primary-text bg-bg-surface '>

                  <div className='border-border-color border-b p-2'>
                  <Link to={'/user-profile'}>
                    <div className={`${currentLocation === 'user-profile' ? 'bg-bg-gray-surface' : ''}  py-2 px-3 rounded-sm flex flex-row items-center gap-3`}>
                      <img src={Profile} alt="profile" className='h-5 filter-(--icon-filter)'/>
                      Profile
                    </div>
                  </Link>
                  <Link to={'/purchase-history'}>
                      <div className={`${currentLocation === 'purchase-history' ? 'bg-bg-gray-surface' : ''}  py-2 px-3 rounded-sm flex flex-row items-center  gap-3 text-sm`}>
                        <img src={History} alt="history" className='h-5 filter-(--icon-filter)'/>
                        History
                      </div>
                    </Link>
                    <Link to={'/liked-items'}>
                      <div className={`${currentLocation === 'liked-items' ? 'bg-bg-gray-surface' : ''}  py-2 px-3 rounded-sm flex flex-row items-center gap-3  text-sm`}>
                        <img src={LikedItems} alt="liked-items" className='h-5 filter-(--icon-filter)'/>
                        Favorites
                      </div>
                    </Link>
                  </div>

                  <div className='flex flex-col p-2 gap-2'>

                    <div className="flex flex-row border border-border-color justify-around font-semibold items-center bg-bg-theme-color rounded-full text-primary-text py-1.5 px-1.5">
                      <div onClick={() => toggleTheme()} className={`${theme === 'light' ? 'bg-button-color' : ''} duration-100 transition-all flex justify-center  w-full text-center py-1 rounded-full cursor-pointer`}>
                        <img src={Light} alt="light_mode" className={`h-4`}/>
                      </div>
                      <div onClick={() => toggleTheme()} className={`${theme === 'dark' ? 'bg-button-color' : ''} duration-100 transition-all flex justify-center  w-full text-center py-1  rounded-full cursor-pointer`}> 
                        <img src={Dark} alt="dark_mode" className={` invert h-4`}/>
                      </div>
                    </div>

                    <button onClick={handleLogout} className='text-primary-text-inverse w-full bg-button-color font-semibold hover:cursor-pointer rounded-md py-2'>
                      Logout
                    </button> 
                  </div>
                </div>
              )}
            </div>
          </div>
            

          

        </div>
      </div>
    </div>
    
  )
}