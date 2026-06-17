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







# Routes ----------------------------------------------------------------------------------------------


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




# Public routes --------------------------------------------------


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
