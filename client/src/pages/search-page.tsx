import Back from '../assets/back.svg'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/context'
import { useState, useEffect } from 'react'
import { useScrollDirection } from "../hooks/scrollDirection.tsx"
import ItemCard from '../components/item-card'
import UserCard from '../components/user-card'
import SearchBar from '../components/search-bar.tsx'
import Footer from '../components/footer.tsx'





export default function SearchPage(){
  
  const navigate = useNavigate()
  const {items, getUsername, users, load_items, load_users} = useAppContext()
  const [itemResults, setItemResults] = useState<(typeof items[0])[]>([])
  const [userResults, setUserResults] = useState<(typeof users[0])[]>([])

  const [searchParams] = useSearchParams()


  const category = searchParams.get('tab') || 'Items'
  const query = searchParams.get('query') || ''
  

  useEffect(() => {
    const loadItems = async() =>{
      await Promise.all([load_items(), load_users()])
    }
    loadItems()
    
  }, [])

  // Runs when category or query changes
  useEffect(() => {
    getSearchResults(query)
  },[category, query, items, users])


  const handleBackClick = () => {
    navigate(-1)
  }



  const getSearchResults = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim()

    if(trimmedQuery.length > 0){
       
      const itemsRes = items?.filter(item => 
        item.deleted === false && item.status === 'available' && item.title.toLowerCase().includes(searchQuery.toLowerCase())        
      )
      const usersRes = users?.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
      setUserResults(usersRes || [])
      setItemResults(itemsRes || [])
    }else{
      setItemResults([])
      setUserResults([])
    }
  }

 


 


  const scrollDirection = useScrollDirection();
  const isHidden = scrollDirection === 'down';

  return(
    <div className="p-0 m-0 h-dvh flex flex-col">
      <div className={`px-5 fixed ${isHidden ? '-translate-y-full' : 'translate-y-0'} top-0 left-0 z-100 transition-transform duration-300 ease-in-out bg-bg-canvas head flex flex-row gap-3 py-2 text-primary-text font-semibold items-center w-full`}>
        <img onClick={handleBackClick} src={Back} alt="back" className='h-6 cursor-pointer filter-(--icon-filter)'/>
        <SearchBar/>
      </div>

     
      <div className={`mx-5 py-2 mt-15 rounded-md`}>
        {query.length === 0 ? (
          <div className="flex flex-col justify-center mt-10 mb-10">
            <div className="flex flex-col justify-center mx-5 select-none">
              <h1 className="lg:text-2xl text-xl font-bold">Looking for something?</h1> 
              <p className="font-light">Try searching for an item</p>
            </div>
          </div>
        ) : (
          itemResults.length === 0 && userResults.length === 0 && (
            (
              <div className="flex flex-col justify-center mt-10 mb-10">
                <div className="flex flex-col justify-center mx-5 select-none">
                  <h1 className="lg:text-2xl text-xl font-bold">Sorry, we couldn't find anything</h1> 
                  <p className="font-light mt-3">Try searching for another item</p>
                </div>
              </div>
            )
          )
        )}
          
        {userResults.length > 0 && (
          <>
            <h1 className='text-2xl font-semibold mb-5'>People</h1>
            <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'}>
              {userResults.map(user => (
                <UserCard 
                  key={user._id} 
                  username={user.username}
                  firstname={user.firstname} 
                  lastname={user.lastname} 
                  avatar_url={user.avatar_url ?? null}
                />
              ))}
            </div>
          </>
        )}
        {
          itemResults.length > 0 && (
            <div className='mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
              {itemResults.map(item => (
                <ItemCard 
                  key={item._id} 
                  image={item.image}
                  item_id={item._id!} 
                  title={item.title} 
                  price={item.price} 
                  seller_name={getUsername(item.seller_id)} 
                  likes={item.likes}
                  status={item.status}
                />
              ))}
            </div>
          )
        }
              
        <h1 className='text-xl lg:text-2xl font-bold text-center mt-30'>Browse LoopCart</h1>
        <div className='mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
          {items.filter(item => item.status === 'available').map(item => (
            <ItemCard 
              key={item._id} 
              image={item.image}
              item_id={item._id!} 
              title={item.title} 
              price={item.price} 
              seller_name={getUsername(item.seller_id)} 
              likes={item.likes}
              status={item.status}
            />
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  )
}
     

