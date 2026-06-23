import Logo from '../assets/Logo.svg'
import Menu from '../assets/Menu.svg'
import { useScrollDirection } from '../hooks/scrollDirection';
import Message from '../assets/message.svg'
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/context';

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
        <div className='flex flex-row items-center gap-4'>
          <Link to={'/inbox'}>
            <img src={Message} alt="message" className='cursor-pointer h-7'/>
          </Link>
          {unreadMessages > 0 && 
            <div className='absolute top-5 right-12 flex justify-center bg-primary-text rounded-full items-center text-center align-middle text-sm h-5 w-5 text-primary-text-inverse'>
              {unreadMessages}
            </div>}
          <img onClick={openSidebar} src={Menu} alt="menu" className='cursor-pointer'/>
        </div>
      </div>
    </div>
    
  )
}