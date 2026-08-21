import { Outlet  } from "react-router-dom"; 
import { Header } from "../components/header";
import Sidebar from "../components/sidebar";
import { useSidebar } from "../hooks/handle-sidebar";
import CategoryBar from "../components/category-bar";


export default function Layout() {
  const { openSidebar, closeSidebar, isOpenSidebar } = useSidebar();

  return (
    <>
      <div className="lg:hidden">
        <Header openSidebar={openSidebar} isDesktop={false}/>
      </div>

      <div className="hidden lg:flex">
        <Header openSidebar={openSidebar} isDesktop={true}/>
        <CategoryBar/>
      </div>

      <Sidebar closeSidebar={closeSidebar} isOpenSidebar={isOpenSidebar}/>

      <div className="pt-11 lg:pt-15 border-border-color p-0 m-0 h-dvh flex flex-col scrollbar-thin scrollbar-thumb-accent">  
        <Outlet/>
      </div>
    </>
  );
}
          

        

      