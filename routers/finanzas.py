from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from database import get_db
from models.paciente import Paciente
from models.transaccion_paciente import TransaccionPaciente
from models.gasto import Gasto
from schemas.transaccion import TransaccionCreate, TransaccionResponse, EstadoCuentaResponse
from schemas.gasto import GastoCreate, GastoResponse
from security import get_current_user

router = APIRouter(tags=["Finanzas"])


@router.post("/pacientes/{paciente_id}/transacciones", response_model=TransaccionResponse, status_code=status.HTTP_201_CREATED)
def registrar_transaccion(paciente_id: int, transaccion: TransaccionCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id, Paciente.is_active == True).first()
    if not paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")

    nueva = TransaccionPaciente(paciente_id=paciente_id, tipo=transaccion.tipo, monto=transaccion.monto, descripcion=transaccion.descripcion)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.get("/pacientes/{paciente_id}/transacciones", response_model=list[TransaccionResponse])
def obtener_transacciones(paciente_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id, Paciente.is_active == True).first()
    if not paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")

    return db.query(TransaccionPaciente).filter(TransaccionPaciente.paciente_id == paciente_id).order_by(TransaccionPaciente.creado_en.desc()).all()


@router.get("/pacientes/{paciente_id}/estado-cuenta", response_model=EstadoCuentaResponse)
def obtener_estado_cuenta(paciente_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id, Paciente.is_active == True).first()
    if not paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")

    cargos = db.query(func.coalesce(func.sum(TransaccionPaciente.monto), 0.0)).filter(TransaccionPaciente.paciente_id == paciente_id, TransaccionPaciente.tipo == "cargo").scalar() or 0.0
    pagos = db.query(func.coalesce(func.sum(TransaccionPaciente.monto), 0.0)).filter(TransaccionPaciente.paciente_id == paciente_id, TransaccionPaciente.tipo == "pago").scalar() or 0.0
    saldo = pagos - cargos
    return EstadoCuentaResponse(paciente_id=paciente_id, total_cargos=float(cargos), total_pagos=float(pagos), saldo=float(saldo))


@router.post("/gastos", response_model=GastoResponse, status_code=status.HTTP_201_CREATED)
def registrar_gasto(gasto: GastoCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    nueva = Gasto(concepto=gasto.concepto, monto=gasto.monto, fecha=gasto.fecha or datetime.utcnow())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.get("/reportes/caja/{fecha}")
def reporte_caja(fecha: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    try:
        fecha_obj = datetime.fromisoformat(fecha).date()
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Formato de fecha inválido, use YYYY-MM-DD")

    ingresos = db.query(func.coalesce(func.sum(TransaccionPaciente.monto), 0.0)).filter(func.date(TransaccionPaciente.creado_en) == fecha_obj, TransaccionPaciente.tipo == "pago").scalar() or 0.0
    gastos = db.query(func.coalesce(func.sum(Gasto.monto), 0.0)).filter(func.date(Gasto.creado_en) == fecha_obj).scalar() or 0.0
    return {"fecha": fecha_obj.isoformat(), "ingresos": float(ingresos), "gastos": float(gastos), "saldo": float(ingresos - gastos)}


@router.post("/caja/arqueo/cerrar")
def cerrar_arqueo_caja(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    fecha_obj = datetime.utcnow().date()
    ingresos = db.query(func.coalesce(func.sum(TransaccionPaciente.monto), 0.0)).filter(func.date(TransaccionPaciente.creado_en) == fecha_obj, TransaccionPaciente.tipo == "pago").scalar() or 0.0
    gastos = db.query(func.coalesce(func.sum(Gasto.monto), 0.0)).filter(func.date(Gasto.creado_en) == fecha_obj).scalar() or 0.0
    return {"fecha": fecha_obj.isoformat(), "ingresos": float(ingresos), "gastos": float(gastos), "saldo": float(ingresos - gastos), "mensaje": "Cierre de caja generado"}
