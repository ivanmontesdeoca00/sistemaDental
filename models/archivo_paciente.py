from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, func
from database import Base


class ArchivoPaciente(Base):
    __tablename__ = "archivos_paciente"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    nombre_archivo = Column(String(255), nullable=False)
    tipo = Column(String(100), nullable=False)
    ruta = Column(String(500), nullable=False)
    mime_type = Column(String(200), nullable=True)
    descripcion = Column(Text, nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
