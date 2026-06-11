from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

class PacienteBase(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    edad: Optional[int] = None
    lugar_origen: Optional[str] = None
    contacto_emergencia: Optional[str] = None
    patologias: Optional[str] = None

class PacienteCreate(PacienteBase):
    pass

class PacienteUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    edad: Optional[int] = None
    lugar_origen: Optional[str] = None
    contacto_emergencia: Optional[str] = None
    patologias: Optional[str] = None

class PacienteResponse(PacienteBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
