# Registra todos los routers de la API.

from fastapi import APIRouter

from app.api.endpoints import login, users, siniestros, documents, health

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(siniestros.router, prefix="/siniestros", tags=["siniestros"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])