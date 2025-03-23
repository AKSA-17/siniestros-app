# Define el modelo SQLAlchemy para usuarios.

from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    is_agent = Column(Boolean(), default=False)
    is_active = Column(Boolean(), default=True)
    
    # Relaciones
    siniestros = relationship("Siniestro", back_populates="owner")