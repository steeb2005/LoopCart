import Logo from '../assets/Logo.svg'
import Menu from '../assets/Menu.svg'
import { useScrollDirection } from '../hooks/scrollDirection';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/context';
import Search from '../assets/search.svg'
import { useEffect, useRef, useState } from 'react';
import DropArrow from '../assets/arrow_down.svg'
import Dark from '../assets/dark_mode.svg'
import Light from '../assets/light_mode.svg'
import Inbox from '../assets/inbox.svg'
import { Spinner } from './ui/spinner';
import Heart from '../assets/Heart.svg'

export function Header({openSidebar, isDesktop}: {
  openSidebar: () => void,
  isDesktop: boolean
}){
  const navigate = useNavigate()

  
  const {inbox, user, toggleTheme, theme, logout, authLoading, dataLoading} = useAppContext()

  const [openDropdown, setOpenDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let unreadMessages = 0;

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
    unreadMessages += conversation.unread_count || 0
  })

  const scrollDirection = useScrollDirection();
  
  const isHidden = scrollDirection === 'down';
  

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown)
  }
  
  const handleLogout = async () => {
    setIsLoading(true)
    try{
      await logout()
      navigate('/')
    }finally{
      setIsLoading(false)
    }
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
    <div className={`fixed top-0 left-0 right-0 z-60 transition-transform duration-300 ease-in-out
      ${isDesktop ? 'translate-y-0' : isHidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="justify-between bg-bg-canvas text-primary-text border-b border-border-color items-center flex flex-row py-2 px-3">
        <div className='flex flex-row gap-2 items-center'>
          {/* MENU BUTTON */}
          <div onClick={openSidebar} className='lg:hidden relative cursor-pointer font-bold'>
            <img src={Menu} alt="menu" className='cursor-pointer filter-(--icon-filter) h-7'/>
          </div>
          <Link to={'/'} className='flex flex-row text-xl items-center gap-2 font-bold'>
            <h1>LoopCart</h1>   
            <img src={Logo} alt="logo" className='h-7 filter-(--icon-filter)'/>
          </Link>
        </div>
      
          

        <div className='flex flex-row items-center gap-3'>
          {/* Search (Always shows) */}
          <Link to={'/search'}>
            <img src={Search} alt="search" className='h-7 w-7 filter-(--icon-filter)'/>
          </Link>

          {/* Inbox (Always shows)*/}
          <Link to={'/messages'}>
            <div className='relative'>
              <img src={Inbox} alt="inbox" className='filter-(--icon-filter)'/>
              {unreadMessages > 0 && 
                <div className='absolute -top-2 -right-2 flex border-2 border-bg-canvas justify-center bg-bg-inverse rounded-full items-center text-center  text-xs w-4 h-4 p-2 text-primary-text-inverse'>
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </div>
              }
            </div>
          </Link>
          
          {/* Hidden when in mobile */}
          <Link to={'/sell-item'} className='hidden lg:flex'>
            <div className='cursor-pointer bg-button-color hover:bg-button-color/80 font-semibold text-primary-text-inverse px-3 py-1 items-center'>
              Sell Now
            </div>
          </Link>
          
          {/* Theme toggle (desktop) */}
          <div className='hidden lg:flex'>
            <img src={theme === 'dark' ? Dark : Light} alt="theme_svg" className='filter-(--icon-filter) cursor-pointer' onClick={() => toggleTheme()}/>
          </div>
                  
          
          {/* User profile display for large screens */}
          {user && (
            <>
              <NavLink to={`/${user.username}/likes`} className='lg:hidden flex'>
                <img src={Heart} alt="heart-svg" className='filter-(--icon-filter)'/>
              </NavLink>
              <div className='hidden lg:flex flex-row items-center gap-3'>
                <NavLink to={`/${user.username}`}>
                  <div className='flex h-8 w-8 ring ring-border-color rounded-full bg-bg-inverse justify-center items-center cursor-pointer overflow-hidden'>
                    {
                      dataLoading || authLoading ? (
                        <Spinner className='text-bg-root'/>
                      ) : (

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
                      )
                    }
                  </div>
                </NavLink>
                 
                
                {/* Dropdown Component */}
                <div ref={dropDownRef}>
                  <img onClick={handleDropdown} src={DropArrow} alt="arrow_down" className='cursor-pointer filter-(--icon-filter)'/>
            
                  <div onClick={handleDropdown} className={`${openDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'} duration-100 absolute top-12 min-w-[15%] bg-bg-canvas shadow-xl right-0 flex flex-col font-light text-primary-text`}>
                    
                    <NavLink 
                      to={`/${user.username}`}
                      >
                      <div className={`hover:bg-bg-gray-surface py-4 px-4  flex flex-row items-center gap-3`}>
                        Profile
                      </div>
                    </NavLink>
                    <NavLink to={'/purchase-history'}>
                      <div className={`hover:bg-bg-gray-surface py-4 px-4 flex flex-row items-center gap-3`}>
                        History
                      </div>
                    </NavLink>
                    <NavLink to={`/${user.username}/likes`}>
                      <div className={`hover:bg-bg-gray-surface py-4 px-4 flex flex-row items-center gap-3`}>
                        Favorites
                      </div>
                    </NavLink>
                    <div onClick={handleLogout}  className='hover:bg-bg-gray-surface py-4 px-4 flex flex-row cursor-pointer items-center gap-3 '>
                      Log out
                    </div>
                  
                  </div>
                  
                </div>
              </div>           
            </>
          )}
          {!user && (
            <>
              <Link to={'/login'}>
                <div className='cursor-pointer hover:bg-button-color hover:text-primary-text-inverse duration-100 ring-2 ring-inset ring-button-color font-semibold text-primary-text px-3 py-1 flex items-center'>
                  Login
                </div>
              </Link>
              
            </>
          )}
 
        </div>
      </div>
    </div>
    
  )
}