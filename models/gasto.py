from sqlalchemy import Column, Integer, String, Float, DateTime, func
from database import Base


class Gasto(Base):
    __tablename__ = "gastos"

    id = Column(Integer, primary_key=True, index=True)
    concepto = Column(String, nullable=False)
    monto = Column(Float, nullable=False)
    fecha = Column(DateTime(timezone=True), server_default=func.now())
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
