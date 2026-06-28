import Logo from '../assets/Logo.svg'
import Menu from '../assets/Menu.svg'
import { useScrollDirection } from '../hooks/scrollDirection';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/context';
import Search from '../assets/search.svg'
import AddBox from '../assets/add_box.svg'

export function Header({openInbox, openSidebar}: {
  openInbox: () => void,
  openSidebar: () => void}){
  const {inbox} = useAppContext()

  let unreadMessages = 0;

  inbox.forEach((conversation) => {
    unreadMessages += conversation.unread_count
  })

  const scrollDirection = useScrollDirection();
  
  const isHidden = scrollDirection === 'down';

  return(
    <div className={`sticky top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out
      ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="justify-between bg-bg-canvas border-b font-bold text-xl text-primary-text border-border-color items-center flex flex-row py-2 px-3 mb-2">
        <div className='flex flex-row items-center gap-2'>
          <h1>LoopCart</h1>   
          <img src={Logo} alt="logo" className='h-7 '/>
        </div>
        <div className='flex flex-row items-center gap-3'>

          <Link to={'/sell-item'}>
            <div className='cursor-pointer'>
              <img src={AddBox} alt="addbox"/>
            </div>
          
          </Link>

          <div className='cursor-pointer'>
            <img src={Search} alt="search" className='h-7 w-7'/>
          </div>

          <div onClick={openSidebar} className='relative cursor-pointer'>
            <img src={Menu} alt="menu" className='cursor-pointer'/>
            {unreadMessages > 0 && 
            <div className='absolute top-0 -right-1 flex border-2 border-bg-canvas justify-center bg-primary-text rounded-full items-center text-center align-middle text-sm h-5 w-5 text-primary-text-inverse'>
              {unreadMessages}
            </div>}
          </div>
        </div>
      </div>
    </div>
    
  )
}