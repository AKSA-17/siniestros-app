# Define esquemas para validación y serialización de documentos.

from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Base schema
class DocumentBase(BaseModel):
    name: Optional[str] = None
    document_type: Optional[str] = None
    
# Create schema
class DocumentCreate(DocumentBase):
    name: str
    document_type: str
    siniestro_id: int

# Update schema
class DocumentUpdate(DocumentBase):
    validated: Optional[bool] = None

# DB schema
class DocumentInDBBase(DocumentBase):
    id: int
    path: str
    upload_date: datetime
    validated: bool
    siniestro_id: int

    class Config:
        from_attributes = True

# Return schema
class Document(DocumentInDBBase):
    pass