import { Link } from "react-router-dom"

export default function NotFound(){
  return(
    <div className="mx-5 p-0 m-0 h-dvh pb-5 flex justify-center items-center">
      <div className='text-secondary-text gap-2 flex flex-col'>
        <h1 className="">404 Not Found</h1>
        <Link to={'/'} className="flex flex-row items-start">
          <button className='cursor-pointer rounded-md text-sm px-4 py-2 bg-bg-inverse text-primary-text-inverse font-semibold'>Back</button>
        </Link>
      </div>
    </div>
  )
}