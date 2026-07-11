import { Outlet  } from "react-router-dom"; 
import { Header } from "../components/header";
import Sidebar from "../components/sidebar";
import { useSidebar } from "../hooks/handle-sidebar";

export default function Layout() {
  const { openSidebar, closeSidebar, isOpenSidebar } = useSidebar();
  return (
    <>
        <Sidebar closeSidebar={closeSidebar}  isOpenSidebar={isOpenSidebar}/>
        <Header openSidebar={openSidebar} />
        
          <Outlet/>

        

        
    </>
  );
}