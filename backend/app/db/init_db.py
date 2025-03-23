# Inicializa la base de datos con datos necesarios, como el primer usuario administrador.

from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.config import settings
from app.db import base  # noqa: F401
from app.db.base_class import Base
from sqlalchemy import create_engine

from app.db.session import engine

# create first superuser
def init_db(db: Session) -> None:
    # Tables should be created with Alembic migrations
    # But for simplicity in this MVP, create tables directly
    Base.metadata.create_all(bind=engine)
    
    # Crear usuario administrador
    admin_user = crud.user.get_by_email(db, email="admin@example.com")
    if not admin_user:
        admin_in = schemas.UserCreate(
            email="admin@example.com",
            password="adminpassword",
            full_name="Admin User",
            is_agent=True,
        )
        admin_user = crud.user.create(db, obj_in=admin_in)
        print(f"Usuario admin creado: {admin_user.email}")
    
    # Crear usuario normal de prueba
    test_user = crud.user.get_by_email(db, email="test@example.com")
    if not test_user:
        test_in = schemas.UserCreate(
            email="test@example.com",
            password="password123",
            full_name="Test User",
            is_agent=False,
        )
        test_user = crud.user.create(db, obj_in=test_in)
        print(f"Usuario de prueba creado: {test_user.email}")
    
    # Crear usuario agente adicional
    agent_user = crud.user.get_by_email(db, email="agent@example.com")
    if not agent_user:
        agent_in = schemas.UserCreate(
            email="agent@example.com",
            password="agentpass",
            full_name="Agent User",
            is_agent=True,
        )
        agent_user = crud.user.create(db, obj_in=agent_in)
        print(f"Usuario agente creado: {agent_user.email}")