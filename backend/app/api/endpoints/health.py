# Proporciona un endpoint para verificar la salud del sistema.

from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def health_check():
    return {"status": "ok", "message": "El servicio está funcionando correctamente"}