# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from database import engine, Base
from routers import auth, pacientes, historia_clinica, odontograma, citas, finanzas, consentimientos, archivos

# Crear/actualizar tablas de forma segura para que la DB quede alineada con los modelos.
Base.metadata.create_all(bind=engine)

# Asegurar columnas nuevas en PostgreSQL cuando la tabla ya existe.
def ensure_patient_columns() -> None:
    inspector = inspect(engine)
    if "pacientes" not in inspector.get_table_names():
        return

    existing_columns = {col["name"] for col in inspector.get_columns("pacientes")}
    required_columns = {
        "edad": "INTEGER",
        "lugar_origen": "TEXT",
        "contacto_emergencia": "TEXT",
        "patologias": "TEXT",
    }

    for column_name, column_type in required_columns.items():
        if column_name in existing_columns:
            continue
        with engine.begin() as connection:
            connection.execute(
                text(f'ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS {column_name} {column_type}')
            )


ensure_patient_columns()

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
app.include_router(historia_clinica.router)
app.include_router(odontograma.router)
app.include_router(citas.router)
app.include_router(finanzas.router)
app.include_router(consentimientos.router)
app.include_router(archivos.router)

@app.get("/")
def root():
    return {"mensaje": "API de Clínica Dental en línea y funcionando"}