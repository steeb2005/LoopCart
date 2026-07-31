import { useAppContext } from "../context/context";
import { useEffect, useRef, useState } from "react";

export function useItemLike(item_id: string, initialLikes: number){
    
  const { like_item, unlike_item, user, likedItems } = useAppContext()
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikes) // count locally
  const isPending = useRef(false)

  useEffect(() => {
    const isAlreadyLiked = likedItems.some(item => item._id === item_id)
    setIsLiked(isAlreadyLiked)
  }, [likedItems, item_id, user])

  useEffect(() => {
    setLikesCount(initialLikes)
  }, [initialLikes])


  const handleLikeClick = async (e : React.MouseEvent) =>{
    e.stopPropagation()
    
    if(!user?._id){
      console.error('User must be logged in to like items');
      return
    }

    if(isPending.current){
      console.error('Already liking or unliking item');
      return
    }

    isPending.current = true

    
    const newIsLiked = !isLiked
    const prev = likesCount
    setIsLiked(newIsLiked)
    setLikesCount(newIsLiked ? likesCount + 1 : likesCount - 1) // Optimistic update 
    
    try{
      if(newIsLiked){
        const success = await like_item(user?._id, item_id) 
        if(!success) throw new Error('Like Failed')
      }else{
        const success = await unlike_item(user?._id, item_id)
        if(!success) throw new Error('Unlike Failed')
      }
    }catch{
      setIsLiked(!newIsLiked) 
      setLikesCount(prev)
      console.error('network error in liking item');
    }finally{
      isPending.current = false
    }
  }


  return {
    isLiked, likesCount, handleLikeClick
  }
}