import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import { useAppContext } from "../context/context"
import { Skeleton } from "../components/ui/skeleton.tsx"
import ItemCard from "../components/item-card.tsx"
import HomeBuyerImage from '../assets/buyer-mobile-kinawat.webp'
import Logo from '../assets/Logo.svg'
import Facebook from '../assets/facebook_svg.svg'
import Github from '../assets/github_svg.svg'
import Instagram from '../assets/instagram_svg.svg'
import Linkedin from '../assets/linkedin_svg.svg'
import Xtwitter from '../assets/Xtwitter.svg'


function Footer(){
  return(
    <footer className="bg-bg-canvas border-t border-border-color text-primary-text mt-10">
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
          <div className='rounded-full h-8 w-8 border border-border-color items-center flex justify-center cursor-pointer hover:bg-bg-surface'>
            <img src={Facebook} alt="facebook_svg" className='h-4 filter-(--icon-filter)'/>
          </div>
          <div className='rounded-full h-8 w-8 border border-border-color items-center flex justify-center cursor-pointer hover:bg-bg-surface'>
            <img src={Xtwitter} alt="twitter_svg" className='h-4 filter-(--icon-filter)'/>
          </div>
          <div className='rounded-full h-8 w-8  border border-border-color items-center flex justify-center cursor-pointer hover:bg-bg-surface'>
            <img src={Linkedin} alt="linkedin_svg" className='h-4 filter-(--icon-filter)'/>
          </div>
          <div className='rounded-full h-8 w-8 border border-border-color items-center flex justify-center cursor-pointer hover:bg-bg-surface '>
            <img src={Instagram} alt="instagram_svg" className='h-5 filter-(--icon-filter)'/>
          </div>
          <div className='rounded-full h-8 w-8 border border-border-color items-center flex justify-center cursor-pointer hover:bg-bg-surface'>
            <img src={Github} alt="github_svg" className='h-5 filter-(--icon-filter)'/>
          </div>
            
        </div>
        <p>
          © {new Date().getFullYear()} LoopCart. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

function SkeletonCard(){
  return(
    <Skeleton className="rounded-lg bg-bg-surface overflow-hidden p-3">
      <Skeleton className="h-48 bg-border-color" />
      <div className="p-2 space-y-3">
        <Skeleton className="h-4 w-3/4 bg-border-color" />
        <Skeleton className="h-4 w-1/2 bg-border-color" />
        <Skeleton className="h-4 w-2/3 bg-border-color" />
      </div>
    </Skeleton>
  )
}

export default function LandingPage(){
  
  const {items, getUsername, load_items, load_users} = useAppContext()
  const [pageLoading, setPageLoading] = useState(true)
 

  const navigate = useNavigate()


  const CATEGORIES = [
    { id: 'explore', label: 'Explore' },
    { id: 'phones', label: 'Phones' },
    { id: 'electronics_computers', label: 'Electronics' },
    { id: 'jewelry', label: 'Jewelry' },
    { id: 'bags', label: 'Bags' },
    { id: 'mens_clothing', label: "Men" },
    { id: 'womens_clothing', label: "Women" },
  ];
 

  
  useEffect(() => {
    const loadItems = async() =>{
      setPageLoading(true)
      await load_items()
      await load_users()
      setPageLoading(false) 
    }
    loadItems()
    
  }, [])
  

  const handleChangeCategory = (id: string) => {
    navigate(`/shop`, {
      state: {
        category: id
      }
    })
  }
  
  return(
    <>  
      <div className={`hidden lg:flex fixed w-full font-semibold top-12 px-5 border-t border-border-color bg-bg-canvas flex-row items-center gap-6 z-50 `}>
        {CATEGORIES.map((category) => (
          <div 
            onClick={() => handleChangeCategory(category.id)}
            className={`cursor-pointer py-3 px-3 border-b-3 hover:border-button-color border-bg-canvas hover:bg-accent`}>
            {category.label}
          </div>
        ))}
      </div>
        
      
        
      <div className="top-section flex flex-col lg:mt-20">
        <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <div className='flex flex-col lg:mx-5 lg:p-15 p-10  bg-bg-canvas rounded-xl items-center lg:items-start'>
            <p className='font-semibold text-2xl text-center lg:text-start'>Turn your clutter into cash and your next find into a steal.</p>
            <p className='font-light text-sm text-secondary-text mt-3 text-center lg:text-start'>
              Fast listings, secure connections, and smarter shopping—all in one seamless loop.
            </p>
            <Link to={'/sell-item'}>
              <button 
                className='bg-button-color px-4 hover:bg-button-color/80 min-w-60 mt-5 text-center font-semibold py-2 grow-0 text-primary-text-inverse rounded-md cursor-pointer'>
                Sell now
              </button>
            </Link>
          </div>

          <div className='flex justify-center items-center'>
            <img 
              src={HomeBuyerImage} 
              alt="home-buyer-image" 
              className='w-full max-h-[300px] object-contain'
            />
          </div>
        </div>

          
        <div className=" rounded-md py-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mx-5">
          {/* Item Entry */}
          
          {pageLoading &&
            Array.from({ length: 15 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          }

          {!pageLoading &&
            items.map((item: any) => (
              (item.status === 'available' && item.deleted === false) && (
                <ItemCard 
                  key={item._id}
                  image={item.image}
                  item_id={item._id}
                  title={item.title}
                  price={item.price}
                  seller_name={getUsername(item.seller_id)}
                  likes={item.likes}
                />
              )
            ))
          }
        </div>
      </div>
      <Footer/>
    </>
  )
}
