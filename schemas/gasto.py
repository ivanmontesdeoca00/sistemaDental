from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class GastoBase(BaseModel):
    concepto: str
    monto: float
    fecha: Optional[datetime] = None


class GastoCreate(GastoBase):
    pass


class GastoResponse(GastoBase):
    id: int
    creado_en: datetime

    class Config:
        from_attributes = True
