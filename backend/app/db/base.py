# Importa todos los modelos para que SQLAlchemy los reconozca.

# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.agent import Agent  # noqa

from app.models.siniestro import Siniestro  # noqa
from app.models.document import Document  # noqa