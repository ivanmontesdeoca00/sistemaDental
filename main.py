# main.py
from fastapi import FastAPI
from database import engine, Base
from routers import auth

# Esto crea las tablas en PostgreSQL automáticamente al iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Clínica Dental",
    description="Backend de gestión médica",
    version="1.0.0"
)

# Incluir las rutas
app.include_router(auth.router)

@app.get("/")
def root():
    return {"mensaje": "API de Clínica Dental en línea y funcionando"}