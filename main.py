# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, pacientes

# Esto crea las tablas en PostgreSQL automáticamente al iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Clínica Dental",
    description="Backend de gestión médica",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas
app.include_router(auth.router)
app.include_router(pacientes.router)

@app.get("/")
def root():
    return {"mensaje": "API de Clínica Dental en línea y funcionando"}