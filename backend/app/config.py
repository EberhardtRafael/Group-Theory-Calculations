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
    
    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        description="Allowed CORS origins"
    )
    
    # Computation limits
    MAX_WEIGHT_SYSTEM_SIZE: int = Field(
        default=1000,
        description="Maximum number of weights to compute for a single irrep"
    )
    MAX_TENSOR_PRODUCT_DIM: int = Field(
        default=10000,
        description="Maximum dimension for tensor product computation"
    )
    
    # Caching
    ENABLE_CACHE: bool = Field(
        default=True,
        description="Enable in-memory caching of computations"
    )
    CACHE_SIZE: int = Field(
        default=128,
        description="LRU cache size for expensive computations"
    )
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
