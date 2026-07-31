from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect, Response, Request, Cookie, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import cloudinary
import cloudinary.uploader
import asyncio
import jwt
import httpx
from typing import Optional
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from config import settings

# # PUT IN EVIRONEMNT VARIABLES
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 60 * 24 * 30 
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 2 * 1024 * 1024
API_URL = settings.API_URL # Change this depending on where the backend is hosted

GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET = settings.GOOGLE_CLIENT_SECRET

GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


app = FastAPI()
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://192.168.1.15:5173",
        "https://loopcart-shop.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)
# PUT IN ENVIRONMENTAL VARIABLES
MONGODB_URL = settings.MONGODB_URL
client = AsyncIOMotorClient(MONGODB_URL) 
db = client.LoopCart
users = db.users
items = db.items
likes = db.likes
conversations = db.conversations


# PUT IN ENVIRONMENTAL VARIABLES
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUDNAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    timeout=30,
    secure=True
)


# Websocket connection manager ------------------------------------------------------------------

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, conversation_id: str, websocket: WebSocket):
        await websocket.accept()
        if conversation_id not in self.active_connections:
            self.active_connections[conversation_id] = []
        self.active_connections[conversation_id].append(websocket)

    def disconnect(self, conversation_id: str, websocket: WebSocket):
        if conversation_id in self.active_connections:
            self.active_connections[conversation_id].remove(websocket)

    async def broadcast(self, conversation_id: str, data: dict):
        for ws in self.active_connections.get(conversation_id, []):
            await ws.send_json(data)

manager = ConnectionManager()



# JWT helpers ---------------------------------------------------------------
'''
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return decode_token(credentials.credentials)
'''
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(tz=timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)



def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")



async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not Authenticated")
    return decode_token(token)



    



# Models ----------------------------------------------------------------------------------------------
class User(BaseModel):
    username: str
    firstname: str
    lastname: str
    email: str
    password: str
    join_date: str
    avatar_url: str | None = None

class UserProfile(BaseModel):
    firstname: str 
    firstname: str
    join_date: str
    avatar_url: str


class LoginRequest(BaseModel):
    email: str
    password: str
    rememberMe: bool


class Item(BaseModel):
    title: str
    price: float
    category: str
    condition: str # "New", "Like New", "Good", "Fair", "Poor"
    description: str
    created_at: str
    status: str = "available" # available, sold
    sold_at: str | None = None
    seller_id: str
    buyer_id: str | None = None
    image: str | None = None
    likes: int = 0



class LikeRequest(BaseModel):
    user_id: str
    item_id: str


class MessageSend(BaseModel):
    sender_id: str
    receiver_id: str
    item_id: str
    text: str 


class MessageRead(BaseModel):
    conversation_id: str
    user_id: str


class BioUpdate(BaseModel):
    bio: str

class BirthdateUpdate(BaseModel):
    birthdate: str

class GenderUpdate(BaseModel):
    gender: str

class ItemUpdate(BaseModel):
    _id: str 
    title: str
    price: float
    category: str
    condition: str # "New", "Like New", "Good", "Fair", "Poor"
    description: str
    created_at: str
    status: str  # available, sold
    sold_at: str | None = None
    seller_id: str
    buyer_id: str | None = None
    image: str | None = None
    likes: int 


class AddressUpdate(BaseModel):
    city: str | None = None
    suburb: str | None = None
    neighbourhood: str | None = None
    street: str | None = None
    road: str | None = None
    state_district: str | None = None
    postcode: str | None = None
    state: str | None = None
    city_district: str | None = None
    building: str | None = None
    municipality: str | None = None
    county: str | None = None
    amenity: str | None = None
    landuse: str | None = None
    region: str | None = None
    village: str | None = None
    quarter: str | None = None  
    country: str | None = None
    country_code: str | None = None

class GoogleAuthRequest(BaseModel):
    token: str

class UsernameUpdate(BaseModel):
    username: str

# Routes ----------------------------------------------------------------------------------------------


# Auth ------------------------------------------------------------------------------------------------



#add user to database
@app.post("/auth/google")
async def google_auth(payload: GoogleAuthRequest, response: Response):

    async with httpx.AsyncClient() as client:
        user_info_res = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {payload.token}"}
        ) 

    if user_info_res.status_code != 200:
        raise HTTPException(status_code=400, detail="Could not get user info from google")

    id_info = user_info_res.json()

    email = id_info.get("email")
    firstname = id_info.get("given_name", "")
    lastname = id_info.get("family_name", "")
    avatar_url = id_info.get("picture")
    google_id = id_info.get("sub")

    if not email:
        raise HTTPException(status_code=400, detail="Could not get the email from google")

    existing_user = await users.find_one({"email": email})

    if existing_user:
        user_id = str(existing_user["_id"])
        user_doc = existing_user
    else:
        
        new_user = {
            "username": email.split("@")[0],
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "google_id": google_id,
            "avatar_url": avatar_url,
            "google_id": google_id,
            "auth_provider": "google",
            "join_date": datetime.now(tz=timezone.utc).isoformat()
        }
        result = await users.insert_one(new_user)
        user_id = str(result.inserted_id)
        user_doc = new_user

    token = create_access_token(user_id, email)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True, # Change to TRUE in production only works in http currently, switch to true to work for https
        samesite="lax",
        max_age=60*60*24*30 # Set cookie to expire in 30 days
    )

    return {    
        "user": {
            "_id": user_id,
            "username": user_doc["username"],
            "firstname": user_doc["firstname"],
            "lastname": user_doc["lastname"],
            "email": user_doc["email"],
            "avatar_url": user_doc.get("avatar_url"),
            "join_date": user_doc["join_date"],
            "address": user_doc.get("address"),
            "gender": user_doc.get("gender"),
            "bio": user_doc.get("bio"),
            "birthdate": user_doc.get("birthdate")
        } 
    }

@app.post("/users")
async def create_user(user: User):
    #check if user already exists
    existing_email = await users.find_one({"email": user.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="User already exists")

    existing_username = await users.find_one({"username": user.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    result = await users.insert_one({
        "username": user.username,
        "firstname": user.firstname, 
        "lastname": user.lastname, 
        "email": user.email, 
        "password": user.password,
        "join_date": user.join_date,
        "avatar_url": user.avatar_url
    })

    user_id = str(result.inserted_id) # Gets the id of the user created by mongodb

    return {
        "user": {
            "_id": user_id,
            "username": user.username,
            "firstname": user.firstname, 
            "lastname": user.lastname, 
            "email": user.email, 
            "password": user.password,
            "join_date": user.join_date,
            "avatar_url": user.avatar_url
        }
    }    



# login 
@app.post("/login")
async def login(login_data: LoginRequest, response: Response):
    
    user = await users.find_one({"email": login_data.email}) # Find user by email

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user["password"] != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")


    user_id = str(user["_id"])
    token = create_access_token(user_id, login_data.email)

    if login_data.rememberMe:
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=True, # Change to TRUE in production only works in http currently, switch to true to work for https
            samesite="lax",
            max_age=60*60*24*30
        )
    else:
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=True, # Change to TRUE in production only works in http currently, switch to true to work for https
            samesite="lax",
            max_age=60*60*24
        )


    return {
        "user": {
            "_id": user_id,
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
    }



# Logout
@app.post('/logout')
async def logout(response: Response):
    response.delete_cookie("access_token")
    return{"success": True}


# Protected routes ---------------------------------------------------------------------------

@app.get("/users/me")       
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



#add item to database
@app.post("/items")
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
        upload_image_res = await asyncio.to_thread(
            cloudinary.uploader.upload,
            file.file,
            folder="LoopCart/item-images",
            public_id=f"item_{str(item_id)}",
            overwrite=True,
            invalidate=True,
            transformation=[
                {"quality": "auto", "fetch_format": "auto"} 
            ]
        )
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
@app.put('/items/{item_id}')
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
            upload_image_res = await asyncio.to_thread(
                cloudinary.uploader.upload,
                file.file,
                folder="LoopCart/item-images",
                public_id=f"item_{str(item_id)}",
                overwrite=True,
                invalidate=True,
                transformation=[
                    {"quality": "auto", "fetch_format": "auto"} 
                ]
            )
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

# Gets the liked items 
@app.get('/likes/{user_id}')
async def get_user_liked_items(user_id: str ,current_user: dict = Depends(get_current_user)):
    if current_user["sub"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    liked_items = [] # Only stores the item ids
    async for like in likes.find({"user_id": user_id}): # Searches the userId in the likes db and loads only the liked items of the logged in user
        liked_items.append(like["item_id"]) 

    items_list = [] # Stores the items full items

    for item_id in liked_items:
        item = await items.find_one({"_id": ObjectId(item_id)})
        if item:
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




# Get routes --------------------------------------------------

# Get specific item
@app.get('/items/{item_id}')
async def get_single_item(item_id: str):
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




# Loads all items
@app.get('/items')
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






# Reads the whole db and returns the users
@app.get('/users')
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





# Likes ----------------------------------------------------------------------------------
@app.post('/likes')
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
    



@app.delete('/likes')
async def unlike_item(user_id: str, item_id: str):
    try:
        await likes.delete_one({
            "user_id": user_id,
            "item_id": item_id
        })

        await items.update_one(
            {"_id": ObjectId(item_id)},
            {"$inc": {"likes": -1}}
        )

        return {"message": "Item unliked successfully"}

    except:
        raise HTTPException(status_code=404, detail="Like not found")
        







# Messages ----------------------------------------------------------------------------------

@app.get('/users/{user_id}/inbox')
async def get_inbox(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["sub"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    conversations_list = []

    async for conversation in conversations.find({"participants": user_id, "deleted_by": {"$ne": user_id}}):
        try:
            participants = conversation.get("participants", [])
            other_participant = [p for p in participants if p != user_id]
            
            if not other_participant:
                continue
            
            other_participant_id = other_participant[0]
            unread_count = 0    # Counter for unread messages (placeholder for now)
            for msg in conversation.get("messages", []):
                if msg["sender_id"] != user_id and not msg["read"]:
                    unread_count += 1

            messages = conversation.get("messages", [])
            last_message = messages[-1] if messages else None
            
            
            conversations_list.append({
                "_id": str(conversation["_id"]),
                "item_id": conversation["item_id"],
                "other_user": other_participant_id,
                "unread_count": unread_count,
                "last_message": last_message,
                "last_updated": conversation["last_updated"],
            
            })
        except Exception as e:
            print(f"Error processing conversation {conversation.get('_id')}: {e}")
            continue

    return conversations_list






@app.post('/messages/send')
async def send_message(message: MessageSend, current_user: dict = Depends(get_current_user)):
    item = await items.find_one({"_id": ObjectId(message.item_id)})

    if current_user["sub"] != message.sender_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.get("deleted", False):
        raise HTTPException(status_code=400, detail="Item has been deleted")
    
    if item["status"] == "sold":
        raise HTTPException(status_code=400, detail="Item has been sold")
    
    participants = sorted([message.sender_id, message.receiver_id])

    if message.sender_id == message.receiver_id:
        raise HTTPException(status_code=400, detail="Cannot send message to yourself")

    new_message = {
        "sender_id": message.sender_id, 
        "text": message.text,
        "read": False,
        "sent_at": datetime.now(tz=timezone.utc).isoformat()
    }

    # Find existing conversation between partiicipants
    conversation = await conversations.find_one({ 
        "participants": participants,
        "item_id": message.item_id
    })

    # If Found
    if conversation:
        other_participant = [p for p in conversation.get("participants", []) if p != current_user["sub"]][0]

        other_participant_exists = await users.find_one({"_id": ObjectId(other_participant)})
        if not other_participant_exists:
            raise HTTPException(status_code=404, detail="Other participant not found")

        deleted_by_users = conversation.get("deleted_by", [])
        if current_user["sub"] in deleted_by_users: 
            await restore_conversation(str(conversation["_id"]), current_user["sub"])

        await conversations.update_one(
            {"_id": conversation["_id"]},
            {
                "$push": {"messages": new_message},
                "$set": {"last_updated": datetime.now(tz=timezone.utc).isoformat()}
            }
        )

        conversation_id = str(conversation["_id"])
    else:
        new_conversation = { # this inserted into the db
            "participants": participants,
            "item_id": message.item_id,
            "messages" : [new_message],
            "last_updated": datetime.now(tz=timezone.utc).isoformat()
        }

        result = await conversations.insert_one(new_conversation)
        conversation_id = str(result.inserted_id)

    await manager.broadcast(conversation_id, {
        "type": "new_message",
        "message": new_message
    })

    await manager.broadcast(message.receiver_id, {
        "type": "new_message",
        "conversation_id": conversation_id
    })

    return {"conversation_id": conversation_id}


# Helper function to restore conversation 
async def restore_conversation(conversation_id: str, user_id: str):
    conversation = await conversations.find_one({"_id": ObjectId(conversation_id)})
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if user_id not in conversation["participants"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    await conversations.update_one({"_id": ObjectId(conversation_id)}, {"$pull": {"deleted_by": user_id}})
   

# Load messages of a conversation
@app.get('/conversation/{conversation_id}/messages')
async def load_messages(conversation_id: str, current_user: dict = Depends(get_current_user)):
    
    try:
        conversation = await conversations.find_one({"_id": ObjectId(conversation_id)})
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        if current_user["sub"] not in conversation["participants"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        return {
            "conversation_id": str(conversation["_id"]),
            "item_id": conversation["item_id"],
            "participants": conversation["participants"],
            "messages": conversation.get("messages", [])
        }
    except:
        raise HTTPException(status_code=400, detail="Invalid conversation ID")



# Get conversationID
@app.get('/conversations/{user_id}/{item_id}')
async def fetch_conversation_id(user_id: str, item_id: str, current_user: dict = Depends(get_current_user)):
    try:
        conversation = await conversations.find_one({
            "participants": user_id,
            "item_id": item_id})
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID or item ID")

    if current_user["sub"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    if not conversation:
        #raise HTTPException(status_code=404, detail="Conversation not found")
        return {"conversation_id": None}    # Returns None if there is no conversation_id for that entry
    return {"conversation_id": str(conversation["_id"])}



# Marks messages as read
@app.put('/conversations/{conversation_id}/read')
async def mark_message_as_read(conversation_id: str, user_id: str):
    try:
        conversation = await conversations.find_one({"_id": ObjectId(conversation_id)})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        updated = False
        for msg in conversation.get("messages", []):
            if msg["sender_id"] != user_id and not msg["read"]: # if the message is not sent by the user and is not already read then set to read
                msg["read"] = True
                updated = True

        if updated:
            await conversations.update_one(
                {"_id": ObjectId(conversation_id)},
                {"$set": {"messages": conversation["messages"]}}
            )

        return {"success": True}
    except:
        raise HTTPException(status_code=400, detail="Invalid request")




# Update ------------------------------------------------------------------

@app.patch('/items/{item_id}/{user_id}/{status}/sold')
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
            


# update user bio
@app.patch('/users/{user_id}/bio')
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
@app.patch('/users/{user_id}/birthdate')
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


@app.patch('/users/{user_id}/gender')
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



@app.patch('/users/{user_id}/address')
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

    



@app.post("/users/{user_id}/avatar")
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
        result = await asyncio.to_thread(
            cloudinary.uploader.upload,
            file.file,
            folder="LoopCart/avatars",
            public_id=f"avatar_{user_id}",
            overwrite=True,
            invalidate=True,
            transformation=[
                {"quality": "auto", "fetch_format": "auto"} 
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload avatar: {str(e)}")

    avatar_url = result.get("secure_url")

    await users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"avatar_url": avatar_url}}
    )

    return {"avatar_url": avatar_url}



@app.post('/items/{item_id}/{user_id}/image')
async def upload_item_image(itemId: str, userId: str, file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if userId != current_user["sub"]:
        raise HTTPException(status_code=403, detail="Unauthorized")

    contents = await file.read()
    
    if len(contents) > (2 * 1024 * 1024):
        raise HTTPException(status_code=400, detail="File size too large")

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")    

    try:
        result = await asyncio.to_thread(
            cloudinary.uploader.upload,
            contents,
            folder="LoopCart/item-images",
            public_id=f"item_{itemId}",
            overwrite=True,
            invalidate=True,
            transformation=[
                {"quality": "auto", "fetch_format": "auto"} 
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

    image_url = result.get("secure_url")

    await items.update_one(
        {"_id": ObjectId(itemId)},
        {"$set": {"image": image_url}}
    )
    
    return {"image_url": image_url}


@app.patch('/users/{user_id}/username')
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
# Delete ------------------------------------------------------------------

@app.patch('/items/{item_id}/delete')
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



@app.patch('/conversations/{conversation_id}/delete')
async def delete_conversation(conversation_id: str, current_user: dict = Depends(get_current_user)):
    try:
        conversation = await conversations.find_one({"_id": ObjectId(conversation_id)})

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        if current_user["sub"] not in conversation["participants"]: 
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        await conversations.update_one(
            {"_id": ObjectId(conversation_id)},
            {"$addToSet": {
                "deleted_by": current_user["sub"]}
            }
        )
    except HTTPException:
        raise
    except:
        raise HTTPException(status_code=400, detail="Invalid request")



# Websocket Connection ----------------------------------------------------------------
@app.websocket("/ws/chat/{conversation_id}")
async def chat_websocket(conversation_id: str, websocket: WebSocket):
    await manager.connect(conversation_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(conversation_id, websocket)


@app.websocket("/ws/inbox/{user_id}")
async def inbox_websocket(user_id: str, websocket: WebSocket):

    await websocket.accept()
    if user_id not in manager.active_connections:
        manager.active_connections[user_id] = []
    manager.active_connections[user_id].append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print("Disconnected inbox websocket")
        manager.disconnect(user_id, websocket)