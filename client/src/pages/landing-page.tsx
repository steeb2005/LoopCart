import Logo from '../assets/Logo.svg'
import ArrowRight from '../assets/ArrowRight.svg'
import MoneyBag from '../assets/Money_bag.svg'
import DollarSign from '../assets/Dollarsign.svg'
import Plant from '../assets/potted_plant.svg'
import Handshake from '../assets/handshake.svg'
import { Link } from 'react-router-dom'

function LandingPage(){
 
  return(
    
    <div className="mx-5 p-0 m-0 overflow-hidden min-h-screen py-5">
      <div className='main-section flex flex-col text-primary-text mt-20 mx-15'>
        
        <div className='flex flex-row'>
          <h1 className='text-4xl font-semibold'>LoopCart</h1>
          <img src={Logo} alt="logo_svg" className='ml-4'/>
        </div>
        <div>
          <p className='font-light text-3xl'>Buy. Sell. <br />Repeat the <br />Loop</p>
        </div>

        <div className='flex flex-col mt-10'>
          <p className='font-light'>Turn your clutter into cash and your next find into a steal. LoopCart is the modern marketplace for pre-loved fashion and tech. Fast listings, secure connections, and smarter shopping—all in one seamless loop.</p>
        </div>

        <div className='mt-10'>
          <Link to={'/login'}>
            <button className='hover:cursor-pointer bg-bg-inverse text-primary-text-inverse px-5 py-2 rounded-full flex items-center'>
              Start Selling 
              <div className='w-8 h-8 rounded-full bg-bg-canvas ml-3 flex items-center justify-center'>
                <img src={ArrowRight} alt="arrow" /></div> 
            </button>
          </Link>
          
        </div>
        
      </div>


      <div className='benefits mt-30 flex flex-col mx-7'>
        <h1 className='text-2xl text-center text-primary-text mb-5'>Why Choose LoopCart?</h1>
        <div className='flex flex-col bg-bg-surface text-primary-text rounded-xl mt-5 p-7'>
          <img src={MoneyBag} alt="money" className='h-7 w-7' />
          <h1 className='text-lg mt-2'>Turn your clutter into cash</h1>
          <p className='mt-2 text-sm font-thin'>Stop letting your old tech gather dust and your unused clothes crowd your closet. Turn them into extra money today.</p>
        </div>

        <div className='flex flex-col bg-bg-surface text-primary-text rounded-xl mt-5 p-7'>
          <img src={DollarSign} alt="dollar" className='h-7 w-7' />
          <h1 className='text-lg mt-2'>Unbeatable Deals</h1>
          <p className='mt-2 text-sm font-thin'>Find gently used iPhones, vintage jackets, and everyday essentials at prices you won’t find in retail stores.</p>
        </div>

        <div className='flex flex-col bg-bg-surface text-primary-text rounded-xl mt-5 p-7'>
          <img src={Plant} alt="plant" className='h-7 w-7' />
          <h1 className='text-lg mt-2'>Good for Your Wallet & Planet</h1>
          <p className='mt-2 text-sm font-thin'>Every item you buy or sell extends its lifecycle, reducing electronic waste and fast-fashion pollution.</p>
        </div>

        <div className='flex flex-col bg-bg-surface text-primary-text rounded-xl mt-5 p-7'>
          <img src={Handshake} alt="hand" className='h-7 w-7' />
          <h1 className='text-lg mt-2'>Trustworthy Local Trading</h1>
          <p className='mt-2 text-sm font-thin'>Deal directly with a verified community of fashion lovers and tech enthusiasts right in your neighborhood.</p>
        </div>
      </div>

      <div className='callToAction mt-30 flex flex-col mx-7 text-primary-text'>
        <h1 className='font-bold text-3xl text-center'>Ready to clear <br />your clutter?</h1>
        <p className='font-light text-center mt-5'>Join thousands of users giving <br />a second life to great clothes and tech.</p>
        <div className='flex flex-row justify-center mt-10'>
          <Link to={'/register'}>
            <button className='hover:cursor-pointer font-semibold text bg-bg-inverse text-primary-text-inverse px-5 py-2 rounded-full flex items-center justify-center '>
              Create Free Account
            </button>
          </Link>
        </div>
        
      </div>

    </div>  
  
    
  )
}

export default LandingPage