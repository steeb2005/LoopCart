from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

""" Finish this """
app = FastAPI()

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




#add item to database
@app.post("/items")
async def create_item(item: Item):

    result = await items.insert_one({
        "title": item.title,
        "price": item.price,
        "category": item.category,
        "condition": item.condition,
        "description": item.description,
        "created_at": item.created_at,
        "status": item.status,
        "sold_at": item.sold_at,
        "seller_id": item.seller_id,
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
        "seller_id": item.seller_id,
        "buyer_id": item.buyer_id,
        "image": item.image,
        "likes": item.likes
    }










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
        "join_date": user.join_date
    })
    return {
        "_id": str(result.inserted_id),
        "username": user.username,
        "firstname": user.firstname, 
        "lastname": user.lastname, 
        "email": user.email, 
        "password": user.password,
        "join_date": user.join_date
    }











@app.post("/login")
async def login(login_data: LoginRequest):
    #simple login that checks email and password

    user = await users.find_one({"email": login_data.email})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user["password"] != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "user": {
            "_id": str(user["_id"]),
            "username": user["username"],
            "firstname": user["firstname"],
            "lastname": user["lastname"],
            "email": user["email"]
        }
    }












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
        })
    return users_list









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
