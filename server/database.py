from config import settings
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URL = settings.MONGODB_URL
client = AsyncIOMotorClient(MONGODB_URL) 

db = client.LoopCart

users = db.users
items = db.items
likes = db.likes
conversations = db.conversations

