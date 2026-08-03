import Logo from '../assets/Logo.svg'
import ArrowRight from '../assets/ArrowRight.svg'
import MoneyBag from '../assets/money_bag.svg'
import DollarSign from '../assets/Dollarsign.svg'
import Plant from '../assets/potted_plant.svg'
import Handshake from '../assets/handshake.svg'
import { Link } from 'react-router-dom'

function LandingPage(){
 
  return(
    
    <div className="py-5 lg:mx-20 ">
      <div className='min-h-dvh flex flex-col justify-center text-primary-text mx-10 '>
        
        <div className='flex flex-row'>
          <h1 className='text-4xl font-bold'>LoopCart</h1>
          <img src={Logo} alt="logo_svg" className='ml-4 filter-(--icon-filter)'/>
        </div>
        <div>
          <p className='font-semibold text-3xl'>Buy. Sell. <br />Repeat the <br />Loop</p>
        </div>

        <div className='flex flex-col mt-10'>
          <p className='font-normal'>Turn your clutter into cash and your next find into a steal. LoopCart is the modern marketplace for pre-loved fashion and tech. Fast listings, secure connections, and smarter shopping—all in one seamless loop.</p>
        </div>

        <div className='mt-10'>
          <Link to={'/login'}>
            <button className='hover:cursor-pointer bg-button-color text-primary-text-inverse px-5 py-2 rounded-full flex items-center'>
              Start Selling 
              <div className='w-8 h-8 rounded-full bg-bg-canvas ml-3 flex items-center justify-center'>
                <img src={ArrowRight} alt="arrow" className='filter-(--icon-filter)'/>
              </div> 
            </button>
          </Link>
          
        </div>
        
      </div>


      <div className='benefits flex flex-col min-h-dvh mx-7'>
        <h1 className='text-2xl text-center text-primary-text mb-5 font-semibold'>Why Choose LoopCart?</h1>
        <div className='flex flex-col bg-bg-canvas shadow-md text-primary-text rounded-xl mt-5 p-7'>
          <img src={MoneyBag} alt="money" className='h-7 w-7 filter-(--icon-filter)'/>
          <h1 className='text-lg mt-2'>Turn your clutter into cash</h1>
          <p className='mt-2 text-md font-light'>Stop letting your old tech gather dust and your unused clothes crowd your closet. Turn them into extra money today.</p>
        </div>

        <div className='flex flex-col bg-bg-canvas shadow-md text-primary-text rounded-xl mt-5 p-7'>
          <img src={DollarSign} alt="dollar" className='h-7 w-7 filter-(--icon-filter)'/>
          <h1 className='text-lg mt-2'>Unbeatable Deals</h1>
          <p className='mt-2 text-md font-light'>Find gently used iPhones, vintage jackets, and everyday essentials at prices you won’t find in retail stores.</p>
        </div>

        <div className='flex flex-col bg-bg-canvas shadow-md text-primary-text rounded-xl mt-5 p-7'>
          <img src={Plant} alt="plant" className='h-7 w-7 filter-(--icon-filter)' />
          <h1 className='text-lg mt-2'>Good for Your Wallet & Planet</h1>
          <p className='mt-2 text-md font-light'>Every item you buy or sell extends its lifecycle, reducing electronic waste and fast-fashion pollution.</p>
        </div>

        <div className='flex flex-col bg-bg-canvas shadow-md text-primary-text rounded-xl mt-5 p-7'>
          <img src={Handshake} alt="hand" className='h-7 w-7 filter-(--icon-filter)' />
          <h1 className='text-lg mt-2'>Trustworthy Local Trading</h1>
          <p className='mt-2 text-md font-light'>Deal directly with a verified community of fashion lovers and tech enthusiasts right in your neighborhood.</p>
        </div>
      </div>

      <div className='min-h-dvh pb-10 flex flex-col mx-7 text-primary-text pt-1 justify-center'>
       

        <h1 className='font-bold text-3xl text-center '>Ready to clear <br />your clutter?</h1>
        <p className='font-light text-center mt-5'>Join thousands of users giving <br />a second life to great clothes and tech.</p>
        <div className='flex flex-row justify-center mt-10'>
          <Link to={'/register'}>
            <button className='hover:cursor-pointer font-semibold text bg-button-color text-primary-text-inverse px-5 py-2 rounded-full flex items-center justify-center '>
              Create Free Account
            </button>
          </Link>
        </div>
    
        
      </div>

    </div>  
  
    
  )
}

export default LandingPage