from sqlalchemy import Column, Integer, ForeignKey, String, Boolean, Text, DateTime, func
from database import Base


class Consentimiento(Base):
    __tablename__ = "consentimientos"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    tipo = Column(String(100), nullable=False)
    texto = Column(Text, nullable=False)
    firmado = Column(Boolean, default=False)
    firma_digital = Column(String(255), nullable=True)
    observaciones = Column(Text, nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())
