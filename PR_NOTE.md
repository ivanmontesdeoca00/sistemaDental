Resumen del PR: Reemplazo de bcrypt por PBKDF2 y pruebas E2E

- Reemplaza el uso de `bcrypt`/`passlib` por una implementación con
  PBKDF2-HMAC-SHA256 en `security.py` para evitar problemas locales de
  compatibilidad con la librería `bcrypt` durante el desarrollo.
- Se agregó `test_api.py` con pruebas rápidas e2e: registro/login,
  creación de paciente y creación/listado de historias clínicas.

Commits: 65e5f9ef

Este archivo se añade únicamente para crear un diff en la rama y facilitar
la creación automática del Pull Request en GitHub.
