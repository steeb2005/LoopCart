from models.models import User, LoginRequest, GoogleAuthRequest
from fastapi import APIRouter, HTTPException, Response, Request
from datetime import datetime, timezone
from database import users
import httpx
from auth import create_access_token, create_refresh_token
from auth import decode_token
from bson import ObjectId


router = APIRouter()
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

def set_auth_cookies(response: Response, access_token: str, refresh_token: str | None = None, remember_me: bool = False):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True, # Change to TRUE in production only works in http currently, switch to true to work for https
        samesite="none", # Set to lax if in development none if in production
        max_age=60 * 15
    )

    if refresh_token:
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True, # Change to TRUE in production only works in http currently, switch to true to work for https
            samesite="none", # Set to lax if in development none if in production
            max_age=60 * 60 * 24 * 7 if remember_me else 60 * 60 * 12  # If remember me is set refresh token is 7 days else its 24 hours  
        )

    
#add user to database
@router.post("/auth/google")
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
        secure=False, # Change to TRUE in production only works in http currently, switch to true to work for https
        samesite="lax", # Set to lax if in development none if in production
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



@router.post("/users")
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
@router.post("/login")
async def login(login_data: LoginRequest, response: Response):
    
    user = await users.find_one({"email": login_data.email}) # Find user by email

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user["password"] != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")


    user_id = str(user["_id"])
    access_token = create_access_token(user_id, login_data.email)
    refresh_token = create_refresh_token(user_id, login_data.email)

    set_auth_cookies(response, access_token, refresh_token, login_data.rememberMe)

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


# Refreshes the token 
@router.post("/refresh")
async def refresh(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token provided")

    payload = decode_token(refresh_token, expected_type="refresh")

    user = await users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access_token = create_access_token(payload["_id"], payload["email"])
    set_auth_cookies(response, new_access_token)

# Logout
@router.post('/logout')
async def logout(response: Response):
    response.delete_cookie(
        "access_token",
        secure=True, # Change to TRUE in production only works in http currently, switch to true to work for https
        samesite="none" # Set to lax if in development none if in production
        )
    
    response.delete_cookie(
        "refresh_token",
        secure=True, # Change to TRUE in production only works in http currently, switch to true to work for https
        samesite="none" # Set to lax if in development none if in production
        )
    return{"success": True}
