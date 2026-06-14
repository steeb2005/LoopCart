import { useEffect, useState } from "react"

export function useScrollDirection(){
  const [scrollDirection, setScrollDirection] = useState('up');
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    // Threshold to prevent aggressive toggling on tiny scrolls
    const threshold = 10; 

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;

      // Ignore changes if the user hasn't scrolled past the threshold
      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return;
      }

      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 64) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    
    // Clean up event listener on unmount
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);

  return scrollDirection;
}