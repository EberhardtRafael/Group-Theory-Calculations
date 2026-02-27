"""
Application configuration using Pydantic settings
"""

from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Group Theory Calculator"
    VERSION: str = "0.1.0"
    
    # Database
    DATABASE_URL: str = Field(
        default="postgresql://grouptheory:grouptheory_pass@localhost:5432/grouptheory",
        description="PostgreSQL database URL"
    )
    
    # Redis
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Redis cache URL"
    )
    
    # Celery
    CELERY_BROKER_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Celery broker URL"
    )
    CELERY_RESULT_BACKEND: str = Field(
        default="redis://localhost:6379/0",
        description="Celery result backend URL"
    )
    
    # Security
    SECRET_KEY: str = Field(
        default="dev-secret-key-change-in-production",
        description="Secret key for JWT tokens"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        description="List of allowed CORS origins"
    )
    
    # Computation
    SAGE_PATH: str = Field(
        default="sage",
        description="Path to Sage executable"
    )
    LIE_PATH: str = Field(
        default="lie",
        description="Path to LiE executable (optional)"
    )
    COMPUTATION_TIMEOUT: int = Field(
        default=300,
        description="Timeout for heavy calculations (seconds)"
    )
    
    # Caching
    CACHE_TTL: int = Field(
        default=86400,
        description="Cache time-to-live (seconds)"
    )
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
