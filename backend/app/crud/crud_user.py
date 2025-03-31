from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            is_active=obj_in.is_active,
            documents=obj_in.documents,  # New field for documents
            documents_id=obj_in.documents_id,  # New field for document IDs
            documents_link=obj_in.documents_link,  # New field for document links
            documents_status=obj_in.documents_status,  # New field for document status
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        
        if update_data.get("password"):
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        
        # Include the documents fields in the update if they are present
        if update_data.get("documents"):
            db_obj.documents = update_data["documents"]
        if update_data.get("documents_id"):
            db_obj.documents_id = update_data["documents_id"]
        if update_data.get("documents_link"):
            db_obj.documents_link = update_data["documents_link"]
        if update_data.get("documents_status"):
            db_obj.documents_status = update_data["documents_status"]

        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_agent(self, user: User) -> bool:
        return user.is_agent

user = CRUDUser(User)
