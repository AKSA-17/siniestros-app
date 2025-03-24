# Proporciona un endpoint para verificar la salud del sistema.

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps

router = APIRouter()

@router.get("/")
def health_check():
    return {"status": "ok", "message": "El servicio está funcionando correctamente"}

@router.get("/db-check")
def db_health_check(db: Session = Depends(deps.get_db)):
    try:
        # Intenta hacer una consulta simple
        result = db.execute("SELECT 1").fetchone()
        if result:
            return {"status": "ok", "message": "Conexión a la base de datos establecida"}
        return {"status": "error", "message": "No se pudo verificar la conexión a la base de datos"}
    except Exception as e:
        return {"status": "error", "message": f"Error en la conexión a la base de datos: {str(e)}"}