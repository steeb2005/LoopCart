import { useState } from 'react'

export function useSidebar(){
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const open = () => setIsOpenSidebar(true);
  const close = () => setIsOpenSidebar(false);

  return {isOpenSidebar, openSidebar: open, closeSidebar: close};
}