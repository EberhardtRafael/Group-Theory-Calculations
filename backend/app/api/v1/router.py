"""
API v1 Router - Combines all endpoint routers
"""

from fastapi import APIRouter

from app.api.v1.endpoints import groups, irreps, calculations

# Create main API router
api_router = APIRouter()

# Include endpoint routers
api_router.include_router(
    groups.router,
    prefix="/groups",
    tags=["groups"]
)

api_router.include_router(
    irreps.router,
    prefix="/irreps",
    tags=["irreps"]
)

api_router.include_router(
    calculations.router,
    prefix="/calculations",
    tags=["calculations"]
)
