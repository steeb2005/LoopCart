import { Outlet  } from "react-router-dom"; 
import { Header } from "../components/header";
import Sidebar from "../components/sidebar";
import { useSidebar } from "../hooks/handle-sidebar";
import { useOpenInbox } from "../hooks/open-inbox";
import InboxModal from "../components/inbox-modal";
export default function Layout() {
  const { openSidebar, closeSidebar, isOpenSidebar } = useSidebar();
  const { openInbox, closeInbox, isOpen } = useOpenInbox();

  return (
    <>
      <Sidebar closeSidebar={closeSidebar}  isOpenSidebar={isOpenSidebar}/>
      <Header openSidebar={openSidebar} openInbox={openInbox} />
      <InboxModal closeInbox={closeInbox} isOpen={isOpen}/>
      
      <Outlet />
    </>
  );
}