from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ArchivoPacienteBase(BaseModel):
    nombre_archivo: str
    tipo: str
    ruta: str
    mime_type: Optional[str] = None
    descripcion: Optional[str] = None


class ArchivoPacienteCreate(ArchivoPacienteBase):
    paciente_id: int


class ArchivoPacienteResponse(ArchivoPacienteBase):
    id: int
    paciente_id: int
    creado_en: datetime

    class Config:
        from_attributes = True
