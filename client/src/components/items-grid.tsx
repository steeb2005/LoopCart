import ItemCard from "./item-card"
import { useAppContext } from "../services"


type Item = {
  _id?: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  description: string;
  created_at: string;
  status: string;
  sold_at: string;
  seller_id: string;
  buyer_id: string;
  image: string;
  likes: number;
}

type Props = {
  items: Item[]
}

export default function ItemsGrid({items} : Props){
  const {getUsername} = useAppContext()
  return(
    <div className={`${items.length === 0 ? 'flex justify-center ' : ' grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'}`}>
      {items.length === 0 ? <div className="mb-2 text-center text-empty-state font-light mt-auto">Empty</div> : items?.map(i => (
        <ItemCard
          key={i._id}
          item_id={i?._id!}
          image={i.image}
          title={i.title}
          price={i.price}
          seller_name={getUsername(i.seller_id)}
          likes={i.likes}
          status={i.status}/>
      ))}
    </div>
  )
}