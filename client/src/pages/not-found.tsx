import Footer from "../components/footer"

export default function NotFound(){
  return (
    <>
      <div className="h-dvh flex flex-col">
        <div className="flex flex-col justify-center mt-auto mx-10 h-screen select-none">
          <h1 className="lg:text-2xl text-xl font-bold">Page not Found or does not exist. Try again or return to the homepage</h1> 
          <p className="font-light mt-5">404 Page not found</p>
         
        </div>
      </div>

      
      <Footer/>
    </>
  )
}