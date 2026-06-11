from sqlalchemy import Column, Integer, ForeignKey, String, Text, DateTime, func
from database import Base


class Cita(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    dentista_id = Column(Integer, nullable=False, index=True)
    fecha_hora = Column(DateTime(timezone=True), nullable=False)
    estado = Column(String, default="agendada")
    motivo = Column(Text, nullable=True)
    notas = Column(Text, nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
