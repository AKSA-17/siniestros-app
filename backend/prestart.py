import logging
from sqlalchemy.orm import Session
from app.db.init_db import init_db
from app.db.session import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init() -> None:
    db = SessionLocal()
    try:
        logger.info("Iniciando la inicialización de la base de datos...")
        init_db(db)
        logger.info("Base de datos inicializada correctamente.")
    except Exception as e:
        logger.error(f"Error al inicializar la base de datos: {e}")
    finally:
        db.close()

def main() -> None:
    logger.info("Creando tablas iniciales...")
    init()
    logger.info("Proceso de creación de tablas finalizado.")

if __name__ == "__main__":
    main()
