import { Link } from "react-router-dom"

export default function UserCard({userId, avatar_url, firstname, lastname, username }: {
  userId: string, 
  avatar_url: string | null, 
  firstname: string,
  lastname: string,
  username: string
}){
  return(
    <Link
      to={`/users/${userId}`}
      className="shadow-md bg-bg-canvas p-3 text-primary-text rounded-md flex flex-row justify-between cursor-pointer">
      <div className="flex flex-row items-center gap-3">
        <div className="h-10 w-10 rounded-full ring ring-border-color bg-bg-inverse flex justify-center items-center overflow-hidden">
          {avatar_url ? (<img src={avatar_url} alt="avatar"/>) : (<span className='text-primary-text-inverse text-xl font-bold'>{username?.charAt(0).toUpperCase()}</span>) }
        </div>
        <div className="flex flex-col ">
          <p className="">{firstname} {lastname}</p>
          <p className="text-sm text-secondary-text font-light">{username}</p>
        </div>
      </div>

      <div className="flex items-center text-xs font-light">
        View profile
      </div>
    </Link>
  )
}