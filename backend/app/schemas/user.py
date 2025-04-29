from typing import Optional, List
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
    is_active: Optional[bool] = True
    documents: Optional[List[str]] = []  # Lista de documentos
    documents_id: Optional[List[str]] = []  # IDs de documentos
    documents_link: Optional[List[str]] = []  # Enlaces a documentos
    documents_status: Optional[List[str]] = []  # Estado del documento (puede ser "pending", "verified", etc.)

# Esquema para actualizar un usuario
class UserUpdate(UserBase):
    password: Optional[str] = None
    is_active: Optional[bool] = None  # Puede actualizar el estado de actividad
    documents: Optional[List[str]] = []  # Lista de documentos
    documents_id: Optional[List[str]] = []  # IDs de documentos
    documents_link: Optional[List[str]] = []  # Enlaces a documentos
    documents_status: Optional[List[str]] = []  # Estado del documento

# Esquema para devolver un usuario
class User(UserBase):
    id: int
    is_active: bool
    documents: List[str]  # Lista de documentos
    documents_id: List[str]  # IDs de documentos
    documents_link: List[str]  # Enlaces a documentos
    documents_status: List[str]  # Estado del documento

    class Config:
        from_attributes = True
