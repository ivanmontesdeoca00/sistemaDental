from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CitaBase(BaseModel):
    paciente_id: int
    dentista_id: int
    fecha_hora: datetime
    motivo: Optional[str] = None
    notas: Optional[str] = None


class CitaCreate(CitaBase):
    pass


class CitaUpdate(BaseModel):
    dentista_id: Optional[int] = None
    fecha_hora: Optional[datetime] = None
    motivo: Optional[str] = None
    notas: Optional[str] = None
    estado: Optional[str] = None


class CitaResponse(CitaBase):
    id: int
    estado: str
    creado_en: datetime

    class Config:
        from_attributes = True
