#Maneja la autenticación y generación de tokens.

from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core import security
from app.core.config import settings

router = APIRouter()

@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    
    if user:
        print("Iniciando como Usuario")

        if not crud.user.is_active(user):
            raise HTTPException(status_code=400, detail="Inactive user")
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return {
            "access_token": security.create_access_token(
                user.id, expires_delta=access_token_expires
            ),
            "token_type": "bearer",
            "user_type": "user"
        }
    else:
        print("Iniciando como Agente")
        
        agent = crud.agent.authenticate(
            db, email=form_data.username, password=form_data.password
        )
        if not agent:
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        
        # Aquí verificaría si el agente está activo, similar a lo que haces con users
        # if not crud.agent.is_active(agent):
        #     raise HTTPException(status_code=400, detail="Inactive agent")
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return {
            "access_token": security.create_access_token(
                agent.id, expires_delta=access_token_expires
            ),
            "token_type": "bearer",
            "user_type": "agent"
        }
    
@router.post("/login/test-token", response_model=schemas.User)
def test_token(current_user: models.User = Depends(deps.get_current_user)) -> Any:
    """
    Test access token
    """
    return current_user

@router.post("/login/test-agent-token", response_model=schemas.Agent)
def test_agent_token(current_agent: models.Agent = Depends(deps.get_current_agent)) -> Any:
    """
    Test access token for agents
    """
    return current_agent



@router.post("/test-simple")
def test_simple_login():
    """
    Simple login test endpoint (no DB, no dependencies)
    """
    return {"status": "success", "message": "API funcionando correctamente"}
