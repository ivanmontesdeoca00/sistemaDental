from datetime import datetime
from typing import Optional, Any

from pydantic import BaseModel


class HistoriaBase(BaseModel):
    motivo: Optional[str] = None
    diagnostico: Optional[str] = None
    tratamientos: Optional[str] = None
    medicamentos: Optional[str] = None
    notas: Optional[str] = None
    anexos: Optional[Any] = None  # JSON / lista de URLs


class HistoriaCreate(HistoriaBase):
    pass


class HistoriaUpdate(BaseModel):
    motivo: Optional[str] = None
    diagnostico: Optional[str] = None
    tratamientos: Optional[str] = None
    medicamentos: Optional[str] = None
    notas: Optional[str] = None
    anexos: Optional[Any] = None


class HistoriaResponse(HistoriaBase):
    id: int
    paciente_id: int
    fecha: datetime
    creado_en: datetime
    actualizado_en: Optional[datetime] = None

    class Config:
        from_attributes = True
