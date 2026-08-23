import Logo from '../assets/Logo.svg'
import Facebook from '../assets/facebook_svg.svg'
import Github from '../assets/github_svg.svg'
import Instagram from '../assets/instagram_svg.svg'
import Linkedin from '../assets/linkedin_svg.svg'
import Xtwitter from '../assets/Xtwitter.svg'
import { Link } from 'react-router-dom'


export default function Footer(){
  return(
    <footer className="bg-bg-root border-t border-border-color text-primary-text mt-10">
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
          <div className="flex flex-row items-center gap-2 font-bold text-xl">
            <h1>LoopCart</h1>
            <img src={Logo} alt="logo" className="h-6 filter-(--icon-filter)"/>
          </div>
          <p className="text-secondary-text text-sm">
            Buy. Sell. Repeat the loop.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h2 className="font-semibold mb-1">Marketplace</h2>
          <Link to="/shop" className="text-secondary-text hover:text-primary-text">Browse Items</Link>
          <Link to="/sell-item" className="text-secondary-text hover:text-primary-text">Sell an Item</Link>
          <Link to="/search" className="text-secondary-text hover:text-primary-text">Search</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h2 className="font-semibold mb-1">Account</h2>
          <Link to="/login" className="text-secondary-text hover:text-primary-text">Login</Link>
          <Link to="/register" className="text-secondary-text hover:text-primary-text">Create Account</Link>
          <Link to="/user-profile" className="text-secondary-text hover:text-primary-text">My Profile</Link>
          <Link to="/messages" className="text-secondary-text hover:text-primary-text">Inbox</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <h2 className="font-semibold mb-1">Support</h2>
          <Link to="/help" className="text-secondary-text hover:text-primary-text">Help Center</Link>
          <Link to="/safety" className="text-secondary-text hover:text-primary-text">Safety Tips</Link>
          <Link to="/terms" className="text-secondary-text hover:text-primary-text">Terms of Service</Link>
          <Link to="/privacy" className="text-secondary-text hover:text-primary-text">Privacy Policy</Link>
        </div>
      </div>


      <div className="border-t border-border-color py-4 text-center text-xs text-secondary-text">
        <div className='flex flex-row gap-3 justify-center mb-3'>
          <div className='group rounded-full h-8 w-8 border border-border-color items-center flex justify-center cursor-pointer hover:bg-button-color'>
            <img src={Facebook} alt="facebook_svg" className='h-4 filter-(--icon-filter) dark:group-hover:invert group-hover:filter-none'/>
          </div>
          <div className='group rounded-full h-8 w-8 border border-border-color items-center flex justify-center cursor-pointer hover:bg-button-color'>
            <img src={Xtwitter} alt="twitter_svg" className='h-4 filter-(--icon-filter) dark:group-hover:invert group-hover:filter-none'/>
          </div>
          <div className='group rounded-full h-8 w-8  border border-border-color items-center flex justify-center cursor-pointer hover:bg-button-color'>
            <img src={Linkedin} alt="linkedin_svg" className='h-4 filter-(--icon-filter) dark:group-hover:invert group-hover:filter-none'/>
          </div>
          <div className='group rounded-full h-8 w-8 border border-border-color items-center flex justify-center cursor-pointer hover:bg-button-color '>
            <img src={Instagram} alt="instagram_svg" className='h-5 filter-(--icon-filter) dark:group-hover:invert group-hover:filter-none'/>
          </div>
          <div className='group rounded-full h-8 w-8 border border-border-color items-center flex justify-center cursor-pointer hover:bg-button-color'>
            <img src={Github} alt="github_svg" className='h-5 filter-(--icon-filter) dark:group-hover:invert group-hover:filter-none'/>
          </div>
            
        </div>
        <p>
          © {new Date().getFullYear()} LoopCart. All rights reserved.
        </p>
      </div>
    </footer>
  )
}