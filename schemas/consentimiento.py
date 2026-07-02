from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ConsentimientoBase(BaseModel):
    tipo: str
    texto: str
    firmado: bool = False
    firma_digital: Optional[str] = None
    observaciones: Optional[str] = None


class ConsentimientoCreate(ConsentimientoBase):
    pass


class ConsentimientoUpdate(BaseModel):
    tipo: Optional[str] = None
    texto: Optional[str] = None
    firmado: Optional[bool] = None
    firma_digital: Optional[str] = None
    observaciones: Optional[str] = None


class ConsentimientoResponse(ConsentimientoBase):
    id: int
    paciente_id: int
    creado_en: datetime
    actualizado_en: Optional[datetime] = None

    class Config:
        from_attributes = True
