import Back from '../assets/back.svg'
import {useAppContext} from '../context/context'
import ItemBox from '../assets/items.svg'
import HeartClicked from '../assets/clickedHeart.svg'
import HeartDefault from '../assets/Heart.svg'
import { useNavigate, Link } from 'react-router-dom'
import { useItemLike } from '../hooks/handle-like'
import Edit from '../assets/edit.svg'
import {format} from "date-fns"


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
  

  return(
    <Link
      to={`/item/${item_id}`}
      className="curor-pointer bg-bg-surface rounded-md p-3"
    >
      <div className="img-section bg-bg-inverse w-100% min-h-37 rounded-md">
        {/* Image goes here */}
      </div>
      <div className="title-section text-primary-text mt-2">
        <h1 className="line-clamp-1 ">{title}</h1>
        <h1 className='font-bold'>₱{price.toLocaleString('en-US')}</h1>
        <p className="text-sm line-clamp-1">{description}</p>
        <div className="flex flex-row items-center justify-between mt-2">
          <h1 className="text-sm font-light">@{seller_name}</h1>
          <div className="flex flex-row gap-2">
            <img 
              onClick={(e) => {
                handleLikeClick(e)
                e.preventDefault()
                e.stopPropagation()
              }}  
              src={isLiked ? HeartClicked : HeartDefault} 
              alt="heart" />
            {likesCount}
          </div>
        </div>
      </div>
    </Link>
  )
}








export default function UserProfile() {
  const navigate = useNavigate()
  const {user, items, getUsername} = useAppContext()


  const handleBackClick = () => {
    navigate(-1)
  }

  const joinDate = new Date(user?.join_date)
  const formattedJoinDate = joinDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });




  const username = getUsername(user?._id)

  return (
    <div className="p-0 m-0 min-h-screen pb-5 flex flex-col"> 
      <div className='head mx-5 flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
        <img onClick={handleBackClick} src={Back} alt="back" className='cursor-pointer' />
        User Profile
      </div>

      <div className="flex flex-col">
        <div className=" flex flex-row mt-5 gap-5 text-primary-text mx-5">
          <div className="w-20 h-20 bg-bg-inverse rounded-full items-center justify-center flex">
            {user?.avatar_url ? (<img src={user.avatar_url} alt="avatar"/>) : (<span className='text-primary-text-inverse text-3xl font-bold'>{user?.username.charAt(0).toUpperCase()}</span>) }
          </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-bold text-2xl">
                {user?.firstname} {user?.lastname}
              </h1>
              <h1 className="text-gray-300">@{user?.username}</h1>
              
            </div>
        </div>


        <div className="flex flex-col text-primary-text px-5 mt-5">
          <h1 className="text-xl font-bold mb-2">About</h1>
          <p className="text-gray-300 text-sm">{user?.bio || 'No bio yet'}</p>
        </div>

        <div className="flex flex-col text-primary-text mt-5 border-b border-border-color pb-3">
          <div className="mx-5">
            <div className='flex flex-row justify-between items-center'>
              <h1 className="text-xl font-bold">Personal Details</h1>
              <Link
                to={`/edit-profile/${user?._id}`}>
                <img src={Edit} alt="edit" className='cursor-pointer'/>
              
              </Link>
            </div>
            
            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Email Address</h1>
              <p className="text-gray-300">{user?.email}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Join Date</h1>
              <p className="text-gray-300">{formattedJoinDate}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Birthdate</h1>
              <p className="text-gray-300">{user?.birthdate ? format(new Date(user?.birthdate), 'MMMM d, yyyy')  : 'No birthdate yet'}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Gender</h1>
              <p className="text-gray-300">{user?.gender.charAt(0).toUpperCase() + user?.gender.slice(1) || 'No gender yet'}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Address</h1>
              <p className="text-gray-300">{user?.address || 'No address yet'}</p>
            </div>
          </div>
        </div>

        <div className='flex flex-col mx-5 text-primary-text'>
            <div className="flex flex-row gap-3 mb-5 mt-5">
              <img src={ItemBox} alt="items-svg" />
              <h1 className="font-bold text-xl">My Items</h1>
            </div>
            <div className="flex flex-col gap-3">

              {(() => {
                const filteredItems = items.filter(item => item.seller_id === user._id)
                if(filteredItems.length === 0){
                  return(<div className="text-primary-text text-center mt-5 justify-center font-light">You don't have any items</div>)
                }
                return(
                  filteredItems.map((item: any) => (
                    <ItemCard 
                      key={item._id}
                      item_id={item._id}
                      title={item.title}
                      description={item.description}
                      price={item.price}
                      seller_name={username}
                      likes={item.likes}
                    />
                  )))
                })()
              }
            
            </div>
          </div>
      </div>
    </div>

  )
}