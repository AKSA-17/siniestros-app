# Define la clase base para todos los modelos SQLAlchemy.

from typing import Any
from sqlalchemy.ext.declarative import as_declarative, declared_attr

@as_declarative()
class Base:
    id: Any
    __name__: str
    
    # Genera tablename automáticamente
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()