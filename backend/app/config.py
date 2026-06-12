from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://ethara:changeme@postgres:5432/inventory_db"
    cors_origins: str = "*"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
