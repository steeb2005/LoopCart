import { Link } from 'react-router-dom'
import { useEffect, useState } from "react"
import { useAppContext } from "../services/index.tsx"
import { Skeleton } from "../components/ui/skeleton.tsx"
import ItemCard from "../components/item-card.tsx"
import HomeBuyerImage from '../assets/buyer-mobile-kinawat.webp'
import Footer from "../components/footer.tsx"



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
 

  useEffect(() => {
    const loadItems = async() =>{
      setPageLoading(true)
      await load_items()
      await load_users()
      setPageLoading(false) 
    }
    loadItems()
    
  }, [])
  
  
  return(
    <>  
            
      <div className="flex flex-col lg:mt-20">
        <div className='w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-5 '>
          <div className='flex flex-col lg:mx-5 lg:p-15 p-10 lg:rounded-xl bg-bg-surface items-center lg:items-start'>
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

          <div className='relative z-0 flex justify-center items-center overflow-hidden'>
            <div className='flex lg:hidden absolute top-0 left-0 w-full h-1/2 bg-bg-surface z-[-1]'></div>
            <img 
              src={HomeBuyerImage} 
              alt="home-buyer-image" 
              className='w-full max-h-[300px] object-contain scale-110 lg:scale-100'
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
                  status={item.status}
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
