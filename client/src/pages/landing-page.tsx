import Logo from '../assets/Logo.svg'
import ArrowRight from '../assets/ArrowRight.svg'
import MoneyBag from '../assets/money_bag.svg'
import DollarSign from '../assets/Dollarsign.svg'
import Plant from '../assets/potted_plant.svg'
import Handshake from '../assets/handshake.svg'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from "react"
import { useAppContext } from "../context/context"
import Category from "../assets/category.svg"
import ArrowDown from "../assets/arrow_down.svg"
import { Skeleton } from "../components/ui/skeleton.tsx"
import Sort from "../assets/sort.svg"
import { useSearchParams } from "react-router-dom"
import ItemCard from "../components/item-card.tsx"
import HomeBuyerImage from '../assets/buyer-mobile-kinawat.webp'



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
  const [searchParams, setSearchParams] = useSearchParams()
  const [categoryMenu, setCategoryMenu] = useState(false)
  const [sortMenu, setSortMenu] = useState(false)

  const currentCategory = searchParams.get('category') || 'explore'
  const currentSort = searchParams.get('sort') || 'recent'
  const CATEGORIES = [
    { id: 'explore', label: 'Explore' },
    { id: 'phones', label: 'Mobile Phones' },
    { id: 'electronics_computers', label: 'Electronics & Computers' },
    { id: 'jewelry', label: 'Jewelry' },
    { id: 'bags', label: 'Bags' },
    { id: 'mens_clothing', label: "Men's clothing & shoes" },
    { id: 'womens_clothing', label: "Women's clothing & shoes" },
  ];

  const SORT = [
    {id: 'recent', label: 'Most Recent'},
    {id: 'popular', label: 'Most Popular'},
    {id: 'price_low', label: 'Price: Low to High'},
    {id: 'price_high', label: 'Price: High to Low'},
  ]
  
  
  
  const activeCategory = CATEGORIES.find(cat => cat.id === currentCategory)
  const activeSort = SORT.find(sort => sort.id === currentSort)

  const handleCategoryChange = (newCategory: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('category', newCategory)
    setSearchParams(newParams)
  }

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sort', newSort)
    setSearchParams(newParams)
  }

  const filteredItems = useMemo(() => {
    if (!items) return []
    
    let categorizedItems = currentCategory === 'explore' ? [...items] : items?.filter(item => item.category === currentCategory)

    if(currentSort === 'recent'){
      categorizedItems.sort((a, b) => b.created_at.localeCompare(a.created_at))
    }else if(currentSort === 'popular'){  
      categorizedItems?.sort((a, b) => b.likes - a.likes)
    }else if(currentSort === 'price_low'){
      categorizedItems?.sort((a, b) => a.price - b.price)
    }else if(currentSort === 'price_high'){
      categorizedItems?.sort((a, b) => b.price - a.price)
    }

    return categorizedItems
  }, [currentCategory, currentSort, items.length])

 


  useEffect(() => {
    
    const loadItems = async() =>{
      setPageLoading(true)
      await load_items()
      await load_users()
      setPageLoading(false) 
    }
    loadItems()
    
  }, [])
  const handleCategoryMenu = () => {
    setCategoryMenu(!categoryMenu)
  }

  const handleSortMenu = () => {
    setSortMenu(!sortMenu)
  }
  
  return(
    <>  
      <div className={`hidden lg:flex fixed w-full font-semibold top-12 px-5 border-t border-border-color bg-bg-canvas flex-row items-center gap-6 z-50 `}>
        <div className={`cursor-pointer py-3 px-3 border-b-3 hover:border-button-color border-bg-canvas hover:bg-accent`}>
          Phones
        </div>
        <div className={`cursor-pointer py-3 px-3 border-b-3 hover:border-button-color border-bg-canvas hover:bg-accent`}>
          Bags
        </div>
        <div className={`cursor-pointer py-3 px-3 border-b-3 hover:border-button-color border-bg-canvas hover:bg-accent `}>
          Jewelry
        </div>
        <div className={`cursor-pointer py-3 px-3 border-b-3 hover:border-button-color border-bg-canvas hover:bg-accent`}>
          Electronics
        </div>
        <div className={`cursor-pointer py-3 px-3 border-b-3 hover:border-button-color border-bg-canvas hover:bg-accent`}>
          Men
        </div>
        <div className={`cursor-pointer py-3 px-3 border-b-3 hover:border-button-color border-bg-canvas hover:bg-accent`}>
          Women
        </div>
      </div>
        
      <div className="top-section flex flex-col mt-20">
        <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <div className='flex flex-col mx-5 p-15 bg-bg-canvas rounded-xl'>
            <p className='font-semibold text-2xl text-center lg:text-start'>Turn your clutter into cash and your next find into a steal.</p>
            <p className='font-light text-sm text-secondary-text mt-3 text-center lg:text-start'>
              Fast listings, secure connections, and smarter shopping—all in one seamless loop.
            </p>
            <button className='bg-button-color px-4 hover:bg-button-color/80 max-w-50 mt-5 text-center font-semibold py-2 grow-0 text-primary-text-inverse rounded-md cursor-pointer'>
              Sell now
            </button>
          </div>

          <div className='flex justify-center items-center mx-5'>
            <img 
              src={HomeBuyerImage} 
              alt="home-buyer-image" 
              className='w-full max-h-[400px] object-contain'
            />
          </div>
        </div>





        <div className="flex flex-row text-primary-text mt-2 items-center gap-3 justify-between text-sm">
          <div className="relative">
            <button
              onClick={handleCategoryMenu}
              className="cursor-pointer border border-border-color bg-bg-canvas px-2 py-1 rounded-md flex flex-row items-center gap-2">
              <img src={Category} alt="category" className="filter-(--icon-filter)"/>
              {activeCategory?.label}
              <img src={ArrowDown} alt="arrow_down_svg" className="filter-(--icon-filter)"/>
            </button>
            {categoryMenu && 
              <div className="absolute top-10 whitespace-nowrap min-w-full p-2 left-0 bg-bg-canvas border border-border-color rounded-md flex flex-col">        
                {CATEGORIES.map((category) => (
                  <div
                    onClick={() => handleCategoryChange(category.id)} 
                    className={`${currentCategory === category.id ? 'bg-bg-gray-surface' : ''} px-2 py-1 rounded-sm  cursor-pointer text-secondary-text`} >
                    {category.label}
                  </div>
                ))}
              </div>
            }
          </div>

          <div className="relative">
            <button onClick={handleSortMenu} className="cursor-pointer border bg-bg-canvas border-border-color px-2 gap-2 font-md text-sm py-1 rounded-md flex flex-row items-center">
              <img src={Sort} alt="sort_svg" className="filter-(--icon-filter) h-5"/>
              {activeSort?.label}
              <img src={ArrowDown} alt="arrow_down_svg" className="filter-(--icon-filter)"/>
            </button>
            {sortMenu && 
              <div className="absolute top-10 whitespace-nowrap min-w-full p-2 right-0 bg-bg-canvas border border-border-color rounded-md flex flex-col">        
                {SORT.map((sort) => (
                  <div
                    onClick={() => handleSortChange(sort.id)} 
                    className={`${currentSort === sort.id ? 'bg-bg-gray-surface' : ''} px-2 py-1 rounded-sm  cursor-pointer text-secondary-text`}>
                    {sort.label}
                  </div>
                ))}
              
              </div>
            }
            <div>

            </div>
          </div>
        </div>


        <div className=" rounded-md py-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mx-5">
          
          {/* Item Entry */}
          
          {pageLoading &&
            Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          }

          {
            filteredItems.map((item: any) => (
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
    </>
  )
}



// <div className="top-section flex flex-col mx-5">
//   <div className='min-h-dvh flex flex-col justify-center text-primary-text mx-10 '>
    
//     <div className='flex flex-row'>
//       <h1 className='text-4xl font-bold'>LoopCart</h1>
//       <img src={Logo} alt="logo_svg" className='ml-4 filter-(--icon-filter)'/>
//     </div>
//     <div>
//       <p className='font-semibold text-3xl'>Buy. Sell. <br />Repeat the <br />Loop</p>
//     </div>

//     <div className='flex flex-col mt-10'>
//       <p className='font-normal'>Turn your clutter into cash and your next find into a steal. LoopCart is the modern marketplace for pre-loved fashion and tech. Fast listings, secure connections, and smarter shopping—all in one seamless loop.</p>
//     </div>

//     <div className='mt-10'>
//       <Link to={'/home'}>
//         <button className='hover:cursor-pointer bg-button-color text-primary-text-inverse px-5 py-2 rounded-full flex items-center'>
//           Start Selling 
//           <div className='w-8 h-8 rounded-full bg-bg-canvas ml-3 flex items-center justify-center'>
//             <img src={ArrowRight} alt="arrow" className='filter-(--icon-filter)'/>
//           </div> 
//         </button>
//       </Link>
      
//     </div>
    
//   </div>


//   <div className='benefits flex flex-col min-h-dvh mx-7'>
//     <h1 className='text-2xl text-center text-primary-text mb-5 font-semibold'>Why Choose LoopCart?</h1>
//     <div className='flex flex-col bg-bg-canvas shadow-md text-primary-text rounded-xl mt-5 p-7'>
//       <img src={MoneyBag} alt="money" className='h-7 w-7 filter-(--icon-filter)'/>
//       <h1 className='text-lg mt-2'>Turn your clutter into cash</h1>
//       <p className='mt-2 text-md font-light'>Stop letting your old tech gather dust and your unused clothes crowd your closet. Turn them into extra money today.</p>
//     </div>

//     <div className='flex flex-col bg-bg-canvas shadow-md text-primary-text rounded-xl mt-5 p-7'>
//       <img src={DollarSign} alt="dollar" className='h-7 w-7 filter-(--icon-filter)'/>
//       <h1 className='text-lg mt-2'>Unbeatable Deals</h1>
//       <p className='mt-2 text-md font-light'>Find gently used iPhones, vintage jackets, and everyday essentials at prices you won’t find in retail stores.</p>
//     </div>

//     <div className='flex flex-col bg-bg-canvas shadow-md text-primary-text rounded-xl mt-5 p-7'>
//       <img src={Plant} alt="plant" className='h-7 w-7 filter-(--icon-filter)' />
//       <h1 className='text-lg mt-2'>Good for Your Wallet & Planet</h1>
//       <p className='mt-2 text-md font-light'>Every item you buy or sell extends its lifecycle, reducing electronic waste and fast-fashion pollution.</p>
//     </div>

//     <div className='flex flex-col bg-bg-canvas shadow-md text-primary-text rounded-xl mt-5 p-7'>
//       <img src={Handshake} alt="hand" className='h-7 w-7 filter-(--icon-filter)' />
//       <h1 className='text-lg mt-2'>Trustworthy Local Trading</h1>
//       <p className='mt-2 text-md font-light'>Deal directly with a verified community of fashion lovers and tech enthusiasts right in your neighborhood.</p>
//     </div>
//   </div>

//   <div className='min-h-dvh pb-10 flex flex-col mx-7 text-primary-text pt-1 justify-center'>
    

//     <h1 className='font-bold text-3xl text-center '>Ready to clear <br />your clutter?</h1>
//     <p className='font-light text-center mt-5'>Join thousands of users giving <br />a second life to great clothes and tech.</p>
//     <div className='flex flex-row justify-center mt-10'>
//       <Link to={'/register'}>
//         <button className='hover:cursor-pointer font-semibold text bg-button-color text-primary-text-inverse px-5 py-2 rounded-full flex items-center justify-center '>
//           Create Free Account
//         </button>
//       </Link>
//     </div>

    
//   </div>

// </div>  