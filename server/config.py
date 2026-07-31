from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MONGODB_URL : str = ""
    SECRET_KEY : str = ""
    ALGORITHM : str = ""
    PORT : int = 8000
    
    CLOUDINARY_CLOUDNAME : str = ""
    CLOUDINARY_API_KEY : str = ""
    CLOUDINARY_API_SECRET : str = ""

    GOOGLE_CLIENT_ID : str = ""
    GOOGLE_CLIENT_SECRET : str = ""

    API_URL : str = ""
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()