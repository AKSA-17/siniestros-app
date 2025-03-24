# Define configuraciones como claves secretas, conexión a base de datos y tiempos de expiración de tokens.

# Define configuraciones como claves secretas, conexión a base de datos y tiempos de expiración de tokens.
from typing import List
from pydantic_settings import BaseSettings
from pydantic import PostgresDsn

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Siniestros App"
    
    # JWT
    SECRET_KEY: str = "tu_clave_secreta_aqui"  # Cambiar en producción
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 días
    
    # Base de datos
    DATABASE_URL: str = "postgresql://postgres:database@localhost/siniestros"
    
    # CORS - Asegúrate de que incluya el origen de tu frontend
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Superusuario inicial
    FIRST_SUPERUSER: str = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin"

    class Config:
        case_sensitive = True

settings = Settings()