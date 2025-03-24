from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.core.config import settings

app = FastAPI(
    title="Siniestros API",
    description="API para la gestión de siniestros de seguros",
    version="0.1.0",
)

# Configurar CORS - Completamente permisivo para desarrollo
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Gestión de Siniestros"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "El servicio está funcionando correctamente"}