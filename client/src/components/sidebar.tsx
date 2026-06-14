import Close from '../assets/close.svg'
import { motion ,AnimatePresence } from 'framer-motion'
export default function Sidebar({closeSidebar, isOpenSidebar}: {
  closeSidebar: () => void, 
  isOpenSidebar: boolean
}){
  return(
    <>
      <AnimatePresence>
        {isOpenSidebar && (
          <div onClick={closeSidebar} className='fixed inset-0 z-100'>
            <motion.div 
              initial={{x: "100%"}}
              animate={{x: 0}}
              exit={{x: "100%"}}
              transition={{type: "spring", damping: 25, stiffness: 200}}
              className="pt-3 px-5 border-l border-l-border-color bg-bg-canvas fixed top-0 right-0 min-w-[48%] min-h-screen z-50"
              onClick={(e) => e.stopPropagation()}
              
            >
                
              <div className="flex flex-row justify-end">
                <img onClick={closeSidebar} src={Close} alt="close_svg" />
              </div>
              <div className="head mb-3 text-primary-text font-semibold border-b border-b-border-color">
                <div className="py-3 flex flex-col gap-1 justify-center">
                  <div className="bg-bg-inverse rounded-full h-12 w-12">
                    {/* User profile image */}
                  </div>
                  <h1 className="text-xl">John Doe</h1>
                  <p className="font-light text-sm">email@gmail.com</p>
                </div>
              </div>

              <div className="font-semibold text-primary-text navlinks flex flex-col gap-3">
                <h1>sample</h1>
                <h1>sample</h1>
                <h1>sample</h1>
                <h1>sample</h1>
                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
