
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from database import users
from auth import get_current_user
from bson import ObjectId
from models.models import BioUpdate, AddressUpdate, GenderUpdate, BirthdateUpdate, UsernameUpdate
from upload import upload_image
router = APIRouter()


MAX_FILE_SIZE = 2 * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.get("/users/me")       
async def get_me(current_user: dict = Depends(get_current_user)):
    user = await users.find_one({"_id" : ObjectId(current_user["sub"])})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "_id": str(user["_id"]),
        "username": user["username"],
        "firstname": user["firstname"],
        "lastname": user["lastname"],
        "email": user["email"],
        "join_date": user["join_date"],
        "avatar_url": user.get("avatar_url"),
        "address": user.get("address"),
        "gender": user.get("gender"),
        "bio": user.get("bio"),
        "birthdate": user.get("birthdate")
    }



# Reads the whole db and returns the users
@router.get('/users')
async def get_users():
    users_list = []
    async for user in users.find():
        users_list.append({
            "_id": str(user["_id"]),
            "username": user["username"],
            "firstname": user["firstname"],
            "lastname": user["lastname"],
            "email": user["email"],
            "avatar_url": user.get("avatar_url"),
            "join_date": user["join_date"],
            "address": user.get("address"),
            "gender": user.get("gender"),
            "bio": user.get("bio"),
            "birthdate": user.get("birthdate")
        })
    return users_list


# Gets a single user
@router.get('/users/{username}')
async def find_user(username: str):
    user = await users.find_one({"username": username})
    if not user: 
        raise HTTPException(status_code=404, detail="User not found")
        
    return {
        "_id": str(user["_id"]),
        "username": user["username"],
        "firstname": user["firstname"],
        "lastname": user["lastname"],
        "email": user["email"],
        "join_date": user["join_date"],
        "avatar_url": user.get("avatar_url"),
        "address": user.get("address"),
        "gender": user.get("gender"),
        "bio": user.get("bio"),
        "birthdate": user.get("birthdate")
    }
    

# update user bio
@router.patch('/users/{user_id}/bio')
async def update_bio(user_id: str, bioData: BioUpdate, current_user: dict = Depends(get_current_user)): # Needs to use pydantic
    try:
        if current_user["sub"] != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        await users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"bio": bioData.bio}}  
        )   
        return {"success": True}
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=400, detail="Invalid request")



# Update user birthdate
@router.patch('/users/{user_id}/birthdate')
async def update_birthdate(user_id: str, birthdateData: BirthdateUpdate, current_user: dict = Depends(get_current_user)): 
    try:
        if current_user["sub"] != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        await users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"birthdate": birthdateData.birthdate}}  
        )   
        return {"success": True}
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=400, detail="Invalid request")


@router.patch('/users/{user_id}/gender')
async def update_gender(user_id: str, genderDate: GenderUpdate, current_user: dict = Depends(get_current_user)):
    try:
        if current_user["sub"] != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        await users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"gender": genderDate.gender}}  
        )   
        return {"success": True}
    except HTTPException:
        raise

    except:
        raise HTTPException(status_code=400, detail="Invalid request")



@router.patch('/users/{user_id}/address')
async def update_address(user_id: str, addressData: AddressUpdate, current_user: dict = Depends(get_current_user)):
    try:
        if user_id != current_user["sub"]:
            raise HTTPException(status_code=403, detail="Unauthorized")

        await users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"address" : addressData.model_dump(exclude_none=True)}}
        )
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=400, detail="Invalid request")

    



@router.post("/users/{user_id}/avatar")
async def upload_avatar(user_id: str, file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if current_user["sub"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if not file:
        raise HTTPException(status_code=400, detail="No image file provided")
    
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size is too large")

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")    

    try:
        result = await upload_image(file.file, "LoopCart/avatars", f"avatar_{user_id}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload avatar: {str(e)}")

    avatar_url = result.get("secure_url")

    await users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"avatar_url": avatar_url}}
    )

    return {"avatar_url": avatar_url}




@router.patch('/users/{user_id}/username')
async def update_username(user_id: str, usernameData: UsernameUpdate, current_user: dict = Depends(get_current_user)):
    try:
        if current_user["sub"] != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")

        existing_username = await users.find_one({"username": usernameData.username})

        if existing_username:
            raise HTTPException(status_code=400, detail={"success": False, "message": "Username already exists"})

        await users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"username": usernameData.username}}  
        )   
        return {"success": True}
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=400, detail="Invalid request")
