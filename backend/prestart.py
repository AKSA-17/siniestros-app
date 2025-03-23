# Este archivo se ejecuta antes de iniciar la aplicación para inicializar la base de datos.

import logging

from sqlalchemy.orm import Session

from app.db.init_db import init_db
from app.db.session import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init() -> None:
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()

def main() -> None:
    logger.info("Creando tablas iniciales")
    init()
    logger.info("Tablas iniciales creadas")

if __name__ == "__main__":
    main()