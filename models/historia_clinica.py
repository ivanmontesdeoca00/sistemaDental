from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, func, JSON
from database import Base


class HistoriaClinica(Base):
    __tablename__ = "historias_clinicas"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    fecha = Column(DateTime(timezone=True), server_default=func.now())
    motivo = Column(Text, nullable=True)
    diagnostico = Column(Text, nullable=True)
    tratamientos = Column(Text, nullable=True)
    medicamentos = Column(Text, nullable=True)
    notas = Column(Text, nullable=True)
    anexos = Column(JSON, nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())
