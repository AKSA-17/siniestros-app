#crud/crud_Agent.py

from typing import Any, Dict, Optional, Union
from sqlalchemy.orm import Session
from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate

class CRUDAgent(CRUDBase[Agent, AgentCreate, AgentUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[Agent]:
        return db.query(Agent).filter(Agent.email == email).first()

    def create(self, db: Session, *, obj_in: AgentCreate) -> Agent:
        db_obj = Agent(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            # Assuming that the agent does not handle documents directly
            # but you could still add them if relevant
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: Agent, obj_in: Union[AgentUpdate, Dict[str, Any]]
    ) -> Agent:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        if update_data.get("password"):
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        
        
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def assign_users(self, db: Session, agent: Agent, assigned_users: list) -> Agent:
        """Assigns a list of users to an agent."""
        for user in assigned_users:
            agent.assigned_users.append(user)  # Adds the user to the agent's list of users
        db.commit()
        db.refresh(agent)
        return agent

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[Agent]:
        agent = self.get_by_email(db, email=email)
        if not agent:
            return None
        if not verify_password(password, agent.hashed_password):
            return None
        return agent

    def is_active(self, agent: Agent) -> bool:
        return agent.is_active

agent = CRUDAgent(Agent)
