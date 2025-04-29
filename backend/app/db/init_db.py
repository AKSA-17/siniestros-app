from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.config import settings
from app.db import base  # noqa: F401
from app.db.base_class import Base
from sqlalchemy import create_engine
from app.db.session import engine

# Crea la base de datos con los datos necesarios
def init_db(db: Session) -> None:
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        
       # -------------------- CREAR USUARIO TEST 1 --------------------
        test_user = crud.user.get_by_email(db, email="test@example.com")
        if not test_user:
            test_in = schemas.UserCreate(
                email="test@example.com",
                password="password123",
                full_name="Fulano",
                is_agent=False,  # No es un agente
                is_active=True,
                documents=["test_documents1", "test_documents2"],
                documents_id=["test_doc_001", "test_doc_002"],
                documents_link=[
                    "http://link_to_documents.com/test1",
                    "http://link_to_documents.com/test2"
                ],
                documents_status=["verified",
                                  "incompleted"],
            )
            test_user = crud.user.create(db, obj_in=test_in)
            print(f"✅ Usuario de prueba creado: {test_user.email}")

        # -------------------- CREAR USUARIO TEST 2 --------------------
        test_user_2 = crud.user.get_by_email(db, email="test_2@example.com")  # <- Se corrigió el email
        if not test_user_2:
            test_in_2 = schemas.UserCreate(
                email="test_2@example.com",
                password="password123",
                full_name="Juan Camaney",
                is_agent=False,
                is_active=True,
                documents=["test_documents3", "test_documents4"],
                documents_id=["test_doc_003", "test_doc_004"],
                documents_link=[
                    "http://link_to_documents.com/test3",
                    "http://link_to_documents.com/test4"
                ],
                documents_status=["pending",
                                  "verified"],
            )
            test_user_2 = crud.user.create(db, obj_in=test_in_2)
            print(f"✅ Usuario de prueba creado: {test_user_2.email}")

        
        # -------------------- CREAR AGENTE --------------------
        agent_user = crud.agent.get_by_email(db, email="agent@example.com")
        if not agent_user:
            agent_in = schemas.AgentCreate(
                email="agent@example.com",
                password="agentpass",
                full_name="Agent User",
            )
            agent_user = crud.agent.create(db, obj_in=agent_in)
            print(f"✅ Usuario agente creado: {agent_user.email}")

        # -------------------- CREAR AGENTE CON USUARIOS --------------------
        agent_for_users = crud.agent.get_by_email(db, email="agent_for_users@example.com")
        if not agent_for_users:
            agent_for_users_in = schemas.AgentCreate(
                email="agent_for_users@example.com",
                password="agentpassforusers",
                full_name="Agent with Users",
            )
            agent_for_users = crud.agent.create(db, obj_in=agent_for_users_in)
            print(f"✅ Usuario agente con asignación de usuarios creado: {agent_for_users.email}")

            # Asignar usuarios al agente
            test_user_list = [test_user, test_user_2]  # Ahora incluye ambos usuarios
            crud.agent.assign_users(db, agent=agent_for_users, assigned_users=test_user_list)
            print(f"✅ Usuarios asignados al agente {agent_for_users.email}: {[u.email for u in test_user_list]}")


    except Exception as e:
        print(f"OCurrió el error {e}")
