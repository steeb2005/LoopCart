from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Request
import jwt
from config import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_MINUTE = 60 * 24 * 7 


def create_access_token(user_id: str, email: str) -> str:
    
    payload = {
        "sub": user_id,
        "type": "access",
        "email": email,
        "exp": datetime.now(tz=timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(user_id: str, email: str) -> str:
    payload = {
            "sub": user_id,
            "type": "refresh",
            "email": email,
            "exp": datetime.now(tz=timezone.utc) + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTE)
        }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    
def decode_token(token: str, expected_type: str = "access") -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    if payload["type"] != expected_type:
        raise HTTPException(status_code=401, detail="Invalid token type")

    return payload


async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not Authenticated")
    return decode_token(token, expected_type="access")

