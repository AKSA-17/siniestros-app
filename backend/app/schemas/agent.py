from typing import List, Optional
from pydantic import BaseModel, EmailStr

# Esquema base para Agentes
class AgentBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_agent: bool = True  # Agents are always marked as True
    assigned_users: Optional[List[int]] = []  # List of user IDs assigned to this agent

# Esquema para crear un agente
class AgentCreate(AgentBase):
    email: EmailStr
    password: str  # Password is required for creating an agent

# Esquema para actualizar un agente
class AgentUpdate(AgentBase):
    password: Optional[str] = None  # Password is optional for updates

# Esquema para devolver un agente
class Agent(AgentBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
