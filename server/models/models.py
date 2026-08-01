from pydantic import BaseModel

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
