import { useEffect, useMemo, useState } from "react"
import { useAppContext } from "../context/context"
import Category from "../assets/category.svg"
import { useLocation } from "react-router-dom"
import ArrowDown from "../assets/arrow_down.svg"
import { Skeleton } from "../components/ui/skeleton.tsx"
import Sort from "../assets/sort.svg"
import { useSearchParams } from "react-router-dom"
import ItemCard from "../components/item-card.tsx"


/* TODO 
  - Make the landing page category selector deliver the selected category to the home page
  - And saves that selected category in a useState which will then be loaded to a params

*/

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

  const location = useLocation()
  const currentCategory = searchParams.get('category') || 'explore'
  const currentSort = searchParams.get('sort') || 'recent'

  // Removed Explore from categories to check if its good ui
  const CATEGORIES = [
    { id: 'phones', label: 'Phones' },
    { id: 'electronics_computers', label: 'Electronics' },
    { id: 'jewelry', label: 'Jewelry' },
    { id: 'bags', label: 'Bags' },
    { id: 'mens_clothing', label: "Men" },
    { id: 'womens_clothing', label: "Women" },
  ];

  const SORT = [
    {id: 'recent', label: 'Most Recent'},
    {id: 'popular', label: 'Most Popular'},
    {id: 'price_low', label: 'Price: Low to High'},
    {id: 'price_high', label: 'Price: High to Low'},
  ]
  
  
  const setCategory = location.state?.category
  useEffect(() => {
    if(setCategory) handleCategoryChange(setCategory)
  } , [setCategory])
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
        {CATEGORIES.map((category) => (
          <div 
            className={`${currentCategory === category.id ? 'border-button-color' : 'border-bg-canvas'} cursor-pointer py-3 px-3 border-b-3 hover:border-button-color border-bg-canvas hover:bg-accent`}
            onClick={() => handleCategoryChange(category.id)}>
            {category.label}
          </div>
        ))}
        
      
      </div>
        
      <div className="top-section flex flex-col lg:mt-15 ">
      
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
            Array.from({ length: 15 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          }

          {!pageLoading &&
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