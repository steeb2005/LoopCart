from database import items, users, conversations
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from bson import ObjectId
from auth import get_current_user
from upload import upload_image
from datetime import datetime, timezone
from typing import Optional
from websocket_manager import manager

router = APIRouter()


MAX_FILE_SIZE = 2 * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

#add item to database
@router.post("/items")
async def create_item(
    title: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    condition: str = Form(...),
    description: str = Form(...),
    created_at: str = Form(...),
    status: str = Form('available'),
    likes: int = Form(0),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    ''' This allows only authenticated users to create items '''    
    has_address = await users.find_one({"_id" : ObjectId(current_user["sub"]), "address": {"$exists": True}})

    if not has_address:
        raise HTTPException(status_code=400, detail="User must have an address to create an item")

    if not file:
        raise HTTPException(status_code=400, detail="Image is required")

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size is too large")

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")    

    item_id = ObjectId()

    try:
        upload_image_res = await upload_image(file.file, "LoopCart/item-images", f"item_{str(item_id)}") 
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

    image_url = upload_image_res.get("secure_url")
    
    try: 
        result = await items.insert_one({
            "_id": item_id,  
            "title": title,
            "price": price,
            "category": category,
            "condition": condition,
            "description": description,
            "created_at": created_at,
            "status": status,
            "seller_id": current_user["sub"],
            "image": image_url,
            "likes": likes
        })
    except:
        raise HTTPException(status_code=400, detail="Network error")

    return {
        "_id": str(result.inserted_id),
        "title": title,
        "price": price,
        "category": category,
        "condition": condition,
        "description": description,
        "created_at": created_at,
        "status": status,
        "seller_id": current_user["sub"],
        "image": image_url,
        "likes": likes
    }




# Edit item
@router.put('/items/{item_id}')
async def update_item(
    item_id: str, 
    title: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    condition: str = Form(...),
    description: str = Form(...),
    status: str = Form(...),
    file: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user)
): 
    

    existing_item = await items.find_one(
        {"_id": ObjectId(item_id)},
        {"seller_id": 1, "image": 1})
   
    if not existing_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if existing_item.get("seller_id") != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Unauthorized")

    image_url = existing_item.get("image")

    if file and file.filename:
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(status_code=400, detail="Invalid file type")    
        
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)

        if file_size > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size is too large")

        try:
            upload_image_res = await upload_image(file.file, "LoopCart/item-images", f"item_{str(item_id)}") 
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
        
        image_url = upload_image_res.get("secure_url")

    itemData = {
            "title": title,
            "price": price,
            "category": category,
            "condition": condition,
            "description": description,
            "status": status,
            "image": image_url
        }
    
    await items.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": itemData}
    )
    
    return {"success": True}    


# Get specific item
@router.get('/items/{item_id}')
async def get_single_item(item_id: str):
    if not ObjectId.is_valid(item_id):
        raise HTTPException(status_code=400, detail="Invalid item ID")
    item = await items.find_one({"_id": ObjectId(item_id)})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return {
        "_id": str(item["_id"]),
        "title": item["title"],
        "price": item.get("price", 0),
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
    }



# Gets all items from a users seller_id
@router.get('/items/user/{seller_id}')
async def get_user_items(seller_id: str):
    
    items_list = []
    async for item in items.find({"seller_id": seller_id}):
        items_list.append({
            "_id": str(item["_id"]),
            "title": item["title"],
            "price": item.get("price", 0),
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



# Loads all items
@router.get('/items')
async def get_items():
    items_list = []
    async for item in items.find():
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




@router.patch('/items/{item_id}/{user_id}/{status}/sold')
async def update_item_sold(item_id: str, user_id: str, status: str, conversation_id: str | None = None, current_user: dict = Depends(get_current_user)):
    try:
        item = await items.find_one({"_id": ObjectId(item_id)})
        conversation = await conversations.find_one({"_id": ObjectId(conversation_id)})
        user_exists = await users.find_one({"_id": ObjectId(user_id)})
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        if item["seller_id"] != current_user["sub"]: 
            raise HTTPException(status_code=403, detail="Unauthorized")

        if status != "sold":
            await items.update_one(
                {"_id": ObjectId(item_id)},
                {"$set": {
                    "status": "sold",
                    "buyer_id": user_id,
                    "sold_at": datetime.now(tz=timezone.utc).isoformat()
                    }
                }
            )
        else:
            await items.update_one(
                {"_id": ObjectId(item_id)},
                {"$set": {
                    "status": "available",
                    "buyer_id": None,
                    "sold_at": None
                    }
                }
            )

        # Broadcasts to other users
        if conversation_id: 
            new_status = "available" if status == "sold" else "sold"
            await manager.broadcast(conversation_id, {
                "type": "update_status",
                "item_id": item_id,
                "status": new_status
            })
        return {"success": True}
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=400, detail="Invalid request")
            


@router.post('/items/{item_id}/{user_id}/image')
async def upload_item_image(itemId: str, userId: str, file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if userId != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Unauthorized")

    contents = await file.read()
    
    if len(contents) > (2 * 1024 * 1024):
        raise HTTPException(status_code=400, detail="File size too large")

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")    

    try:
        result = await upload_image(file.file, "LoopCart/images", f"image_{itemId}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

    image_url = result.get("secure_url")

    await items.update_one(
        {"_id": ObjectId(itemId)},
        {"$set": {"image": image_url}}
    )
    
    return {"image_url": image_url}


@router.patch('/items/{item_id}/delete')
async def delete_item(item_id: str, current_user: dict = Depends(get_current_user)):
    try:
        item = await items.find_one({"_id": ObjectId(item_id)})

        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

        if item["seller_id"] != current_user["sub"]: 
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        await items.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": {
                "deleted": True,    # Soft Deletes the data
                "deleted_at": datetime.now(tz=timezone.utc).isoformat()}
            }
        )
        return {"success": True}

    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=400, detail="Invalid request")
