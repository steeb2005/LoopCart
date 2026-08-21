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
  

  return(
    <div className={`hidden lg:flex fixed w-full font-semibold top-12 px-5 border-t border-b border-border-color/40 bg-bg-canvas flex-row items-center gap-6 z-50 `}>
      {CATEGORIES.map((category) => (
        <div 
          onClick={() => handleChangeCategory(category.id)}
          className={`cursor-pointer py-3 px-3 border-b-3 hover:border-button-color border-bg-canvas hover:bg-accent`}>
          {category.label}
        </div>
      ))}
    </div>
  )
}