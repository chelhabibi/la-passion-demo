from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5432/lapassion"
    allowed_origins: str = "http://localhost:3000"
    admin_api_key: str = ""
    resend_api_key: str = ""
    from_email: str = "La Passion <noreply@lapassion.vn>"
    restaurant_url: str = "https://frontend-production-01ff.up.railway.app"

    class Config:
        env_file = ".env"


settings = Settings()
