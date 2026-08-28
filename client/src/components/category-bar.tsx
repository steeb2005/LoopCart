import { useNavigate } from "react-router-dom";


//  ** THIS CATEGORY BAR IS ONLY FOR PAGES THAT ARENT THE SHOP PAGE ** 

export default function CategoryBar(){
  const navigate = useNavigate()

  const CATEGORIES = [
    { id: 'explore', label: 'Explore' },
    { id: 'phones', label: 'Phones' },
    { id: 'electronics_computers', label: 'Electronics' },
    { id: 'jewelry', label: 'Jewelry' },
    { id: 'bags', label: 'Bags' },
    { id: 'mens_clothing', label: "Men" },
    { id: 'womens_clothing', label: "Women" },
  ];

  
  const handleChangeCategory = (id: string) => {
    navigate(`/shop`, {
      state: {
        category: id
      }
    })
  }
  
  const isShopPage = window.location.pathname === '/shop'

  return(
    <div className={`${isShopPage && 'invisible'} hidden lg:flex fixed w-full font-semibold top-13 px-5 border-t border-b border-border-color/40 bg-bg-canvas flex-row items-center z-50 `}>
      {CATEGORIES.map((category) => (
        <div 
          onClick={() => handleChangeCategory(category.id)}
          className={`cursor-pointer py-3 px-5 border-b-3 hover:border-button-color border-bg-canvas hover:bg-accent`}>
          {category.label}
        </div>
      ))}
    </div>
  )
}