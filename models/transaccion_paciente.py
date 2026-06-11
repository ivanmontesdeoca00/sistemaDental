from sqlalchemy import Column, Integer, ForeignKey, String, Float, DateTime, func
from database import Base


class TransaccionPaciente(Base):
    __tablename__ = "transacciones_paciente"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False, index=True)
    tipo = Column(String, nullable=False)  # pago o cargo
    monto = Column(Float, nullable=False)
    descripcion = Column(String, nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    fecha = Column(DateTime(timezone=True), server_default=func.now())
