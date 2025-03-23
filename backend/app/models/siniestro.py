# Define el modelo SQLAlchemy para siniestros.

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Siniestro(Base):
    __tablename__ = "siniestros"

    id = Column(Integer, primary_key=True, index=True)
    numero_poliza = Column(String, index=True)
    asegurado = Column(String, index=True)
    fecha_siniestro = Column(DateTime, default=datetime.utcnow)
    fecha_reporte = Column(DateTime, default=datetime.utcnow)
    tipo_siniestro = Column(String, index=True)
    descripcion = Column(Text)
    estado = Column(String, index=True, default="Nuevo")
    prioridad = Column(String, index=True, default="Media")
    
    # Relaciones
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="siniestros")
    documentos = relationship("Document", back_populates="siniestro")