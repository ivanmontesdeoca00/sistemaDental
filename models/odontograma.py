from sqlalchemy import Column, Integer, ForeignKey, String, Text, DateTime, func
from database import Base


class Odontograma(Base):
    __tablename__ = "odontograma"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    diente_numero = Column(Integer, nullable=False, index=True)
    estado = Column(String, default="sano")
    anotaciones = Column(Text, nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())
