from database import items, likes, users
from fastapi import APIRouter, Depends, HTTPException
from models.models import LikeRequest
from bson import ObjectId
from auth import get_current_user

router = APIRouter()


# Likes ----------------------------------------------------------------------------------
@router.post('/likes')
async def like_item(like: LikeRequest, current_user: dict = Depends(get_current_user)):

    logged_in_user = current_user["sub"]
    # Finds if the user has already liked the item
    existing_like = await likes.find_one({
        "item_id": like.item_id,
        "user_id": logged_in_user
    })
    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked")

    try:
        await likes.insert_one({
            "item_id": like.item_id,
            "user_id": logged_in_user
        })

        await items.update_one(
            {"_id": ObjectId(like.item_id)}, # Search condition and searches for the item id
            {"$inc": {"likes": 1}}      # increements the like count of that item
        )

        return {"message": "Item liked successfully"} # Temp

    except:
        raise HTTPException(status_code=500, detail="Database Error")
    



@router.delete('/likes')
async def unlike_item(user_id: str, item_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["sub"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    try:
        deleted_like = await likes.delete_one({
            "user_id": user_id,
            "item_id": item_id
        })

        if deleted_like.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Like not found")

        await items.update_one(
            {"_id": ObjectId(item_id)},
            {"$inc": {"likes": -1}}
        )

        return {"message": "Item unliked successfully"}
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=404, detail="Like not found")
        


# Gets the liked items 
@router.get('/likes/{user_id}')
async def get_user_liked_items(user_id: str ,current_user: dict = Depends(get_current_user)):
    if current_user["sub"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    # Gets the users likes from the database and only gets the item ids
    liked_cursor = likes.find({"user_id": user_id}, {"item_id": 1, "_id": 0})

    # Stores the item id's from the liked 
    liked_item_ids = [ObjectId(like["item_id"]) async for like in liked_cursor]

    if not liked_item_ids:
        return []

    # Gets the items from the database and stores them in a list
    items_cursor = items.find({"_id": {"$in": liked_item_ids}})

    items_list = []

    async for item in items_cursor:
        items_list.append({
            "_id": str(item["_id"]),
            "title": item["title"],
            "price": item["price"],
            "category": item["category"],
            "condition": item["condition"],
            "description": item["description"],
            "created_at": item["created_at"],
            "status": item["status"],
            "sold_at": item.get("sold_at"),
            "seller_id": item["seller_id"],
            "buyer_id": item.get("buyer_id"),
            "image": item["image"],
            "likes": item.get("likes", 0),
            "deleted": item.get("deleted", False)
        })

    return items_list



@router.get('/likes/user/{user_id}')
async def get_user_likes(user_id: str):

   
    # Gets the users likes from the database and only gets the item ids
    liked_cursor = likes.find({"user_id": user_id}, {"item_id": 1, "_id": 0})

    # Stores the item id's from the liked 
    liked_item_ids = [ObjectId(like["item_id"]) async for like in liked_cursor]

    if not liked_item_ids:
        return []

    # Gets the items from the database and stores them in a list
    items_cursor = items.find({"_id": {"$in": liked_item_ids}})

    items_list = []

    async for item in items_cursor:
        items_list.append({
            "_id": str(item["_id"]),
            "title": item["title"],
            "price": item["price"],
            "category": item["category"],
            "condition": item["condition"],
            "description": item["description"],
            "created_at": item["created_at"],
            "status": item["status"],
            "sold_at": item.get("sold_at"),
            "seller_id": item["seller_id"],
            "buyer_id": item.get("buyer_id"),
            "image": item["image"],
            "likes": item.get("likes", 0),
            "deleted": item.get("deleted", False)
        })

    return items_list
