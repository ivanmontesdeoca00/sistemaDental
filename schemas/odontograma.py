from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class OdontogramaBase(BaseModel):
    estado: Optional[str] = "sano"
    anotaciones: Optional[str] = None


class OdontogramaUpdate(OdontogramaBase):
    pass


class OdontogramaResponse(OdontogramaBase):
    id: int
    paciente_id: int
    diente_numero: int
    creado_en: datetime
    actualizado_en: Optional[datetime] = None

    class Config:
        from_attributes = True
