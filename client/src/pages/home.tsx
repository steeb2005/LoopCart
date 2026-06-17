import { useEffect, useState } from "react"
import { useAppContext } from "../context/context"
import Search from "../assets/Search.svg"
import Add from "../assets/add.svg"
import Category from "../assets/category.svg"
import Filter from "../assets/filter.svg"
import ArrowDown from "../assets/arrow_down.svg"
import Heart from "../assets/Heart.svg"
import HeartClicked from "../assets/clickedHeart.svg"
import { useScrollDirection } from "../hooks/scrollDirection.tsx"
import { Link, useNavigate } from "react-router-dom"
import { useItemLike } from "../hooks/handle-like.tsx" 

// TODO:
// - Finish this page
// - Try to add jwt to the api routes
function ItemCard({item_id, title, price, description, seller_name, likes}: {
  item_id: string,
  title: string,
  price: number,
  description: string,
  seller_name: string,
  likes: number
}
){
  const {isLiked, likesCount, handleLikeClick} = useItemLike(item_id, likes)
  const navigate = useNavigate()
  /**
  const { like_item, unlike_item, user, likedItems } = useAppContext()
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes) // count locally
  
  useEffect(() => {
    const isAlreadyLiked = likedItems.some(item => item._id === item_id)
    setIsLiked(isAlreadyLiked)
  }, [likedItems, item_id, user])

  useEffect(() => {
    setLikesCount(likes)
  }, [likes])



  const handleLikeClick = async (e : React.MouseEvent) =>{
    e.stopPropagation()
    if(!user){
      console.log('not logged in');
    }

    const newIsLiked = !isLiked
    const prev = likesCount
    setIsLiked(newIsLiked)
    setLikesCount(newIsLiked ? likesCount + 1 : likesCount - 1) // Optimistic update 
    
    try{
      if(newIsLiked){
        const success = await like_item(user?._id, item_id) 
        if(!success) throw new Error('Like Failed')
      }else{
        const success = await unlike_item(user?._id, item_id)
        if(!success) throw new Error('Unlike Failed')
      }
    }catch{
      setIsLiked(!newIsLiked) 
      setLikesCount(prev)
      console.error('network error in liking item');
    }
  }
   */
  
  const handleItemClick = () => {
    navigate(`/item/${item_id}`)
  }

  return(
    <div  
      className="curor-pointer bg-bg-surface rounded-md p-3"
      onClick={handleItemClick}
    >
      <div className="img-section bg-bg-inverse w-100% min-h-37 rounded-md">
        {/* Image goes here */}
      </div>
      <div className="title-section text-primary-text mt-2">
        <h1 className="line-clamp-1 ">{title}</h1>
        <h1>PHP {price.toLocaleString('en-US')}</h1>
        <p className="text-sm line-clamp-1">{description}</p>
        <div className="flex flex-row items-center justify-between mt-2">
          <h1 className="text-sm font-light">@{seller_name}</h1>
          <div className="flex flex-row gap-2">
            <img onClick={handleLikeClick}  src={isLiked ? HeartClicked : Heart} alt="heart" />
            {likesCount}
          </div>
        </div>
      </div>
    </div>
  )
}




function Home(){
  
  const { items, users} = useAppContext()
  const [isClicked, setIsClicked] = useState('Items')
  const [sellerMap, setSellerMap] = useState<Map<string, string>>(new Map()) // Creates 


  const handleClick = (buttonId: string) =>{
    setIsClicked(buttonId)
  } 


  const scrollDirection = useScrollDirection();
  const isHidden = scrollDirection === 'down';

  useEffect(() => {
    const map = new Map()
    users.forEach(user => {
      if (user._id && user.username) {
        map.set(user._id, user.username);
      }
    })
    setSellerMap(map)
  }, [users])


  const getSellerName = (seller_id: string) => {
    if(!seller_id) return 'Unkown Seller'
    return sellerMap.get(seller_id) || 'Unkown Seller'
  }

  return(
    <>
      {/* Sidebar */}
      <div className=" mx-5 p-0 m-0 min-h-screen pb-5  ">
          
        {/* Displays the inbox modal */}
        
        <div className={`search-bar sticky ${isHidden ? 'top-2' : 'top-14'} z-50 transition-all duration-300 ease-in-out`}>
          <img src={Search} alt="searchsvg" className="absolute left-5 top-3"/>
          <input 
            type="text" 
            className="pl-14 text-sm items-center text-primary-text bg-bg-surface py-3 w-full rounded-md decoration-none outline-0" 
            placeholder="search"/>
        </div>
        <div className="top-section flex flex-col">
          
          <div className="flex flex-row justify-around font-semibold mt-2 text-primary-text ">
            <div onClick={() => handleClick("Items")} className={` border-b ${isClicked === 'Items' ? 'border-bg-inverse' : 'border-bg-surface'}  w-full text-center py-2 cursor-pointer`}>
              Items
            </div>
            <div onClick={() => handleClick("Sellers")} className={` border-b ${isClicked === 'Sellers' ? 'border-bg-inverse' : 'border-bg-surface'}  w-full text-center py-2 cursor-pointer`}> 
              Sellers
            </div>
          </div>

          <div className="flex flex-row text-primary-text mt-2 items-center gap-3 justify-between">
            <button className="cursor-pointer bg-bg-surface px-2 py-1 rounded-md flex flex-row items-center gap-2">
              <img src={Category} alt="category" />
              Category
              <img src={ArrowDown} alt="arrow_down" />
            </button>

            <div className="flex flex-row gap-3">
              <Link to={'/sellItem'}>
                <button className="cursor-pointer bg-bg-surface px-2 py-1 rounded-md flex flex-row items-center gap-1">
                  <img src={Add} alt="add" />
                  Sell
                </button>
              </Link>
              <button className="cursor-pointer bg-bg-surface px-2 py-1 rounded-md flex flex-row items-center gap-1">
                <img src={Filter} alt="filter" />
                Filter
              </button>
            </div>
          </div>


          <div className="border px-2 py-2 border-border-color rounded-md mt-2 flex flex-col gap-2">
            
            {/* Item Entry */}
            {
              items.map((items: any) => (
                <ItemCard 
                  item_id={items._id}
                  title={items.title}
                  price={items.price}
                  description={items.description}
                  seller_name={getSellerName(items.seller_id)}
                  likes={items.likes}
                  
                />
              ))
            }

          </div>
        </div>

        <p className="mt-5 text-center text-primary-text font-light">No more items to show</p>
      </div>
    </>
  )
}

export default Home