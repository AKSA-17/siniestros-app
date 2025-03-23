# Prueba el endpoint directamente
Antes de probar desde el frontend, asegúrate de que el endpoint funciona directamente. Puedes usar el Swagger UI que proporciona FastAPI:

Abre http://localhost:8000/docs en tu navegador
Busca y expande el endpoint POST /api/users/open
Haz clic en "Try it out"
Proporciona un usuario de prueba en formato JSON:

json{
  "email": "test2@example.com",
  "password": "password123",
  "full_name": "Test User",
  "is_agent": true
}

Haz clic en "Execute" y verifica que la respuesta es exitosa