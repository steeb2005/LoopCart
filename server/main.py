from fastapi import FastAPI
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from contextlib import asynccontextmanager
from database import conversations, client

from routes import auth_routes, items_routes, users_routes, messages_routes, websockets_routes, likes_routes
PORT = settings.PORT

IS_PROD = settings.IS_PROD == "production"

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Starting main.py, LoopCart Port:{PORT}")
    try:
        await conversations.create_index(
            "conversation_key", 
            unique=True,
            sparse=True
        )
    except Exception as e:
        print(f"Index creation skipped or already created: {e}")

    yield

    client.close()
    print("LoopCart stopped")

app = FastAPI(
    lifespan=lifespan,
    docs_url=None if IS_PROD else "/docs",
    redoc_url=None if IS_PROD else "/redoc",
    openapi_url=None if IS_PROD else "/openapi.json",
    )

# Origins should be in the .env
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)


app.include_router(auth_routes.router)
app.include_router(items_routes.router)
app.include_router(users_routes.router)
app.include_router(messages_routes.router)
app.include_router(websockets_routes.router)
app.include_router(likes_routes.router)