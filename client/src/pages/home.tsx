import { useEffect, useMemo, useState } from "react"
import { useAppContext } from "../context/context"
import Category from "../assets/category.svg"
import ArrowDown from "../assets/arrow_down.svg"
import Heart from "../assets/Heart.svg"
import HeartClicked from "../assets/clickedHeart.svg"
import { Link } from "react-router-dom"
import { useItemLike } from "../hooks/handle-like.tsx" 
import { Skeleton } from "../components/ui/skeleton.tsx"
import Sort from "../assets/sort.svg"
import { useSearchParams } from "react-router-dom"

function ItemCard({item_id, image, title, price, seller_name, likes}: {
  item_id: string,
  image: string,
  title: string,
  price: number,
  seller_name: string,
  likes: number
}
){
  const {isLiked, likesCount, handleLikeClick} = useItemLike(item_id, likes)
 
  return(
    <Link  
      to={`/item/${item_id}`}
      className="border border-border-color rounded-md p-3 cursor-pointer max-h-100 flex flex-col space-y-1"
    >
      <div className="img-section bg-bg-canvas w-full min-h-50 rounded-md">
        {image ? (
          <img src={image} className="w-full h-full object-contain" alt="image"/>
        ) : (
          <div className="h-full flex justify-center items-center text-secondary-text">
            No Image
          </div>
        )}
      </div>
      <div className="title-section text-primary-text mt-2 ">
        <h1 className="line-clamp-2 ">{title}</h1>
        <h1 className=" font-bold text-lg">₱{price.toLocaleString('en-US')}</h1>
      </div>
      <div className="flex flex-row items-center justify-between mt-auto">
        <h1 className="text-sm font-light">@{seller_name}</h1>
        <div className="flex flex-row gap-2">
          <img 
            onClick={(e) => {
              handleLikeClick(e)
              e.preventDefault()
              e.stopPropagation()
            }}  
            src={isLiked ? HeartClicked : Heart} 
            alt="heart" className="filter-(--icon-filter) h-6"/>
          {likesCount}
        </div>
        
      </div>
    </Link>
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


function Home(){
  
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
      {/* Sidebar */}
   
        
        {/* SEARCH BAR
        <div className={`search-bar sticky ${isHidden ? 'top-2' : 'top-14'} z-50 transition-all duration-300 ease-in-out`}>
          <img src={Search} alt="searchsvg" className="absolute left-5 top-3"/>
          <input 
            type="text" 
            className="pl-14 text-sm items-center text-primary-text bg-bg-surface py-3 w-full rounded-md decoration-none outline-0" 
            placeholder="search"  
          />
        </div> */}

      <div className="top-section flex flex-col mx-5">
        
        <div className="flex flex-row text-primary-text mt-2 items-center gap-3 justify-between text-sm">
          <div className="relative">
            <button
              onClick={handleCategoryMenu}
              className="cursor-pointer border border-border-color px-2 py-1 rounded-md flex flex-row items-center gap-2">
              <img src={Category} alt="category" className="filter-(--icon-filter)"/>
              {activeCategory.label}
              <img src={ArrowDown} alt="arrow_down_svg" className="filter-(--icon-filter)"/>
            </button>
            {categoryMenu && 
              <div className="absolute top-10 whitespace-nowrap min-w-full p-2 left-0 bg-bg-surface border border-border-color rounded-md flex flex-col">        
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
            <button onClick={handleSortMenu} className="cursor-pointer border border-border-color px-2 gap-2 font-md text-sm py-1 rounded-md flex flex-row items-center">
              <img src={Sort} alt="sort_svg" className="filter-(--icon-filter) h-5"/>
              {activeSort.label}
              <img src={ArrowDown} alt="arrow_down_svg" className="filter-(--icon-filter)"/>
            </button>
            {sortMenu && 
              <div className="absolute top-10 whitespace-nowrap min-w-full p-2 right-0 bg-bg-surface border border-border-color rounded-md flex flex-col">        
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


        <div className=" rounded-md py-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          
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

export default Home