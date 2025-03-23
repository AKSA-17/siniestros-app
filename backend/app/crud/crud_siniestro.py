# Implementa operaciones CRUD para siniestros.

from typing import List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.siniestro import Siniestro
from app.schemas.siniestro import SiniestroCreate, SiniestroUpdate

class CRUDSiniestro(CRUDBase[Siniestro, SiniestroCreate, SiniestroUpdate]):
    def create_with_owner(
        self, db: Session, *, obj_in: SiniestroCreate, owner_id: int
    ) -> Siniestro:
        obj_in_data = obj_in.dict()
        db_obj = Siniestro(**obj_in_data, owner_id=owner_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Siniestro]:
        return (
            db.query(self.model)
            .filter(Siniestro.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_numero_poliza(
        self, db: Session, *, numero_poliza: str
    ) -> Optional[Siniestro]:
        return db.query(Siniestro).filter(Siniestro.numero_poliza == numero_poliza).first()

siniestro = CRUDSiniestro(Siniestro)