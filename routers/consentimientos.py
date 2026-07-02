from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.consentimiento import Consentimiento
from schemas.consentimiento import ConsentimientoCreate, ConsentimientoResponse, ConsentimientoUpdate
from security import get_current_user

router = APIRouter(prefix="", tags=["Consentimientos"])


@router.put("/consentimientos/{consentimiento_id}/firmar", response_model=ConsentimientoResponse)
def firmar_consentimiento(
    consentimiento_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    item = db.query(Consentimiento).filter(Consentimiento.id == consentimiento_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consentimiento no encontrado")

    firma = payload.get("firma_digital")
    if not firma:
        raise HTTPException(status_code=400, detail="La firma digital es obligatoria")

    item.firmado = True
    item.firma_digital = firma
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.post("/pacientes/{paciente_id}/consentimientos", response_model=ConsentimientoResponse, status_code=status.HTTP_201_CREATED)
def crear_consentimiento(
    paciente_id: int,
    consentimiento: ConsentimientoCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    nuevo = Consentimiento(paciente_id=paciente_id, **consentimiento.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.get("/pacientes/{paciente_id}/consentimientos", response_model=list[ConsentimientoResponse])
def listar_consentimientos(
    paciente_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Consentimiento).filter(Consentimiento.paciente_id == paciente_id).all()


@router.put("/pacientes/{paciente_id}/consentimientos/{consentimiento_id}", response_model=ConsentimientoResponse)
def actualizar_consentimiento(
    paciente_id: int,
    consentimiento_id: int,
    consentimiento: ConsentimientoUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    item = db.query(Consentimiento).filter(
        Consentimiento.id == consentimiento_id,
        Consentimiento.paciente_id == paciente_id,
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consentimiento no encontrado")

    for field, value in consentimiento.dict(exclude_unset=True).items():
        setattr(item, field, value)

    db.add(item)
    db.commit()
    db.refresh(item)
    return item
