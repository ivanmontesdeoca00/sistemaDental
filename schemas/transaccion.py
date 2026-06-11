from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TransaccionBase(BaseModel):
    tipo: str
    monto: float
    descripcion: Optional[str] = None


class TransaccionCreate(TransaccionBase):
    pass


class TransaccionResponse(TransaccionBase):
    id: int
    paciente_id: int
    fecha: datetime
    creado_en: datetime

    class Config:
        from_attributes = True


class EstadoCuentaResponse(BaseModel):
    paciente_id: int
    total_cargos: float
    total_pagos: float
    saldo: float
