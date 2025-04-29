# app/models/agent.py

from sqlalchemy import Column, Integer, ForeignKey, Boolean, String, Table
from sqlalchemy.orm import relationship
from app.db.base_class import Base

# Association table for many-to-many relationship between agents and users
agent_user = Table(
    "agent_user",
    Base.metadata,
    Column("agent_id", Integer, ForeignKey("agents.id", ondelete="CASCADE"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
)

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    is_agent = Column(Boolean(), default=True)  # Default to True since it's an Agent
    is_active = Column(Boolean(), default=True)

    # Many-to-many relationship with Users
    assigned_users = relationship("User", secondary=agent_user, back_populates="assigned_agents")
