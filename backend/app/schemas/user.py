#Define esquemas para validación y serialización de usuarios.

from typing import Optional
from pydantic import BaseModel, EmailStr

# Esquema base
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_agent: Optional[bool] = False
    full_name: Optional[str] = None

# Esquema para crear un usuario
class UserCreate(UserBase):
    email: EmailStr
    password: str

# Esquema para actualizar un usuario
class UserUpdate(UserBase):
    password: Optional[str] = None

# Esquema para devolver un usuario
class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True