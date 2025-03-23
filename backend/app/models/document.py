# Define el modelo SQLAlchemy para documentos asociados a siniestros.

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    path = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)
    document_type = Column(String, index=True)
    validated = Column(Boolean, default=False)
    
    # Relaciones
    siniestro_id = Column(Integer, ForeignKey("siniestros.id"))
    siniestro = relationship("Siniestro", back_populates="documentos")