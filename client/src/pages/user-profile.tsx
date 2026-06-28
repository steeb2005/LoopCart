import Back from '../assets/back.svg'
import {Link} from 'react-router-dom'
import {useAppContext} from '../context/context'




export default function UserProfile() {
  const {user} = useAppContext()

  const date = new Date(user?.join_date)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="p-0 m-0 min-h-screen pb-5 flex flex-col"> 
      <div className='head mx-5 flex flex-row gap-8 pt-3 text-primary-text font-semibold'>
        <Link to={'/home'}>
          <img src={Back} alt="back" />
        </Link>
        User Profile
      </div>

      <div className="flex flex-col">
        <div className=" flex flex-row mt-5 gap-5 text-primary-text mx-5">
          <div className="w-20 h-20 bg-bg-inverse rounded-full"></div>
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

            <h1 className="text-xl font-bold">Personal Details</h1>
            
            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Email Address</h1>
              <p className="text-gray-300">{user?.email}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Join Date</h1>
              <p className="text-gray-300">{formattedDate}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Birthdate</h1>
              <p className="text-gray-300">{user?.birthdate || 'No birthdate yet'}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Gender</h1>
              <p className="text-gray-300">{user?.gender || 'No gender yet'}</p>
            </div>

            <div className="flex flex-col">
              <h1 className="font-semibold mt-5">Address</h1>
              <p className="text-gray-300">{user?.address || 'No address yet'}</p>
            </div>
          </div>
        </div>
    </div>
    </div>

  )
}