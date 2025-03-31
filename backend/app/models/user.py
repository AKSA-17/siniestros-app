# backend/app/models/user.py

from sqlalchemy import Boolean, Column, Integer, String, JSON
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.models.agent import agent_user

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    is_agent = Column(Boolean(), default=False)
    is_active = Column(Boolean(), default=True)

    # Document fields
    documents = Column(JSON, nullable=True)  # JSON field to store document names/labels
    documents_id = Column(JSON, nullable=True)  # JSON field to store document IDs
    documents_link = Column(JSON, nullable=True)  # JSON field to store links to documents
    documents_status = Column(JSON, nullable=True)  # Use JSON if tracking multiple statuses

    # Relationships
    siniestros = relationship("Siniestro", back_populates="owner")
    assigned_agents = relationship("Agent", secondary=agent_user, back_populates="assigned_users")
