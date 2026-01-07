from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "DIDP Backend"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "sqlite:///./didp.db"

    # File Upload
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    UPLOAD_DIR: str = "./uploads"

    # Execution Limits
    PYTHON_EXECUTION_TIMEOUT: int = 30
    PYTHON_MAX_OUTPUT_SIZE: int = 1024 * 1024
    SQL_MAX_ROWS: int = 10000
    SQL_TIMEOUT: int = 30

    class Config:
        env_file = ".env"


settings = Settings()
