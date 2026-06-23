from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import jwt
from datetime import datetime, timedelta, timezone
from bson import ObjectId

SECRET_KEY = "your-super-secret-key-change-this-in-production-12345"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


app = FastAPI()
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.LoopCart
users = db.users
items = db.items
likes = db.likes
conversations = db.conversations



# JWT helpers ---------------------------------------------------------------

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


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return decode_token(credentials.credentials)




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
    image: str
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


# Routes ----------------------------------------------------------------------------------------------


# Auth ------------------------------------------------------------------------------------------------

#add user to database
@app.post("/users")
async def create_user(user: User):

    #check if user already exists
    existing_user = await users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

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
    token = create_access_token(user_id, user.email)

    return {
        "access_token": token,
        "token_type": "bearer",
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
        




    #simple login that checks email and password
@app.post("/login")
async def login(login_data: LoginRequest):
    
    user = await users.find_one({"email": login_data.email}) # Find user by email

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user["password"] != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")


    user_id = str(user["_id"])
    token = create_access_token(user_id, login_data.email)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "_id": user_id,
            "username": user["username"],
            "firstname": user["firstname"],
            "lastname": user["lastname"],
            "email": user["email"]
        }
    }




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
        "join_date": user["join_date"]
    }




#add item to database
@app.post("/items")
async def create_item(item: Item, current_user: dict = Depends(get_current_user)):
    ''' This allows only authenticated users to create items '''
    result = await items.insert_one({
        "title": item.title,
        "price": item.price,
        "category": item.category,
        "condition": item.condition,
        "description": item.description,
        "created_at": item.created_at,
        "status": item.status,
        "sold_at": item.sold_at,
        "seller_id": current_user["sub"],
        "buyer_id": item.buyer_id,
        "image": item.image,
        "likes": item.likes
    })

    return {
        "_id": str(result.inserted_id),
        "title": item.title,
        "price": item.price,
        "category": item.category,
        "condition": item.condition,
        "description": item.description,
        "created_at": item.created_at,
        "status": item.status,
        "sold_at": item.sold_at,
        "seller_id": current_user["sub"],
        "buyer_id": item.buyer_id,
        "image": item.image,
        "likes": item.likes
    }




# Get routes --------------------------------------------------


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
            "sold_at": item["sold_at"],
            "seller_id": item["seller_id"],
            "buyer_id": item["buyer_id"],
            "image": item["image"],
            "likes": item.get("likes", 0)
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
            "avatar_url": user.get("avatar_url")
        })
    return users_list





# Likes ----------------------------------------------------------------------------------
@app.post('/likes')
async def like_item(like: LikeRequest):
    # Finds if the user has already liked the item
    existing_like = await likes.find_one({
        "item_id": like.item_id,
        "user_id": like.user_id
    })
    if existing_like:
        raise HTTPException(status_code=400, detail="Already liked")

    try:
        await likes.insert_one({
            "item_id": like.item_id,
            "user_id": like.user_id
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
        


@app.get('/likes/{user_id}')
async def get_user_liked_items(user_id: str):

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
                "sold_at": item["sold_at"],
                "seller_id": item["seller_id"],
                "buyer_id": item["buyer_id"],
                "image": item["image"],
                "likes": item.get("likes", 0)
            })

    return items_list






# Messages ----------------------------------------------------------------------------------

@app.get('/users/{user_id}/inbox')
async def get_inbox(user_id: str):
    conversations_list = []

    async for conversation in conversations.find({"participants": user_id}):
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
                "conversation_id": str(conversation["_id"]),
                "item_id": conversation["item_id"],
                "other_user": other_participant_id,
                "unread_count": unread_count,
                "last_message": last_message,
                "last_updated": conversation["last_updated"]
            })
        except Exception as e:
            print(f"Error processing conversation {conversation.get('_id')}: {e}")
            continue

    return conversations_list





@app.post('/messages/send')
async def send_message(message: MessageSend):
    participants = sorted([message.sender_id, message.receiver_id])

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
        await conversations.update_one(
            {"_id": conversation["_id"]},
            {
                "$push": {"messages": new_message},
                "$set": {"last_updated": datetime.now(tz=timezone.utc).isoformat()}
            }
        )
        return {"conversation_id": str(conversation["_id"])}
    else:
        new_conversation = { # this inserted into the db
            "participants": participants,
            "item_id": message.item_id,
            "messages" : [new_message],
            "last_updated": datetime.now(tz=timezone.utc).isoformat()
        }

        result = await conversations.insert_one(new_conversation)
        return {"conversation_id": str(result.inserted_id)}





# Load messages of a conversation
@app.get('/conversation/{conversation_id}/messages')
async def load_messages(conversation_id: str):
    try:
        conversation = await conversations.find_one({"_id": ObjectId(conversation_id)})
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
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
async def fetch_conversation_id(user_id: str, item_id: str):
    try:
        conversation = await conversations.find_one({
            "participants": user_id,
            "item_id": item_id})
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID or item ID")

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
async def update_item_sold(item_id: str, user_id: str, status: str):
    try:
        item = await items.find_one({"_id": ObjectId(item_id)})
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

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
        return {"success": True}

    except:
        raise HTTPException(status_code=400, detail="Invalid request")
            
