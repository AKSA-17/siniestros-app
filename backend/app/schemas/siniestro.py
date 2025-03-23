# Define esquemas para validación y serialización de siniestros.

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

# Base schema
class SiniestroBase(BaseModel):
    numero_poliza: Optional[str] = None
    asegurado: Optional[str] = None
    tipo_siniestro: Optional[str] = None
    descripcion: Optional[str] = None
    estado: Optional[str] = "Nuevo"
    prioridad: Optional[str] = "Media"

# Create schema
class SiniestroCreate(SiniestroBase):
    numero_poliza: str
    asegurado: str
    tipo_siniestro: str

# Update schema
class SiniestroUpdate(SiniestroBase):
    pass

# DB schema
class SiniestroInDBBase(SiniestroBase):
    id: int
    owner_id: int
    fecha_siniestro: datetime
    fecha_reporte: datetime

    class Config:
        from_attributes = True

# Return schema
class Siniestro(SiniestroInDBBase):
    pass