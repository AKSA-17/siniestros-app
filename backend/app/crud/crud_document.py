# Implementa operaciones CRUD para documentos.

from typing import List

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate

class CRUDDocument(CRUDBase[Document, DocumentCreate, DocumentUpdate]):
    def create_with_siniestro(
        self, db: Session, *, obj_in: DocumentCreate, siniestro_id: int, path: str
    ) -> Document:
        obj_in_data = obj_in.dict()
        db_obj = Document(**obj_in_data, path=path, siniestro_id=siniestro_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_siniestro(
        self, db: Session, *, siniestro_id: int, skip: int = 0, limit: int = 100
    ) -> List[Document]:
        return (
            db.query(self.model)
            .filter(Document.siniestro_id == siniestro_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

document = CRUDDocument(Document)