import cloudinary
import cloudinary.uploader
import asyncio
from config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUDNAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    timeout=30,
    secure=True
)

async def upload_image(file_source, folder: str, public_id: str):
    
    return await asyncio.to_thread(
        cloudinary.uploader.upload,
        file_source,
        folder=folder,
        public_id=public_id,
        overwrite=True,
        invalidate=True,
        transformation=[
            {"quality": "auto", "fetch_format": "auto"} 
        ]
    )