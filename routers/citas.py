from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.cita import Cita
from models.paciente import Paciente
from schemas.cita import CitaCreate, CitaResponse, CitaUpdate
from security import get_current_user

router = APIRouter(prefix="/citas", tags=["Citas"])


@router.post("/", response_model=CitaResponse, status_code=status.HTTP_201_CREATED)
def crear_cita(cita: CitaCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    paciente = db.query(Paciente).filter(Paciente.id == cita.paciente_id, Paciente.is_active == True).first()
    if not paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")

    conflicto = db.query(Cita).filter(
        Cita.dentista_id == cita.dentista_id,
        Cita.fecha_hora == cita.fecha_hora,
        Cita.estado != "cancelada"
    ).first()
    if conflicto:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ya existe una cita programada en ese horario")

    nueva_cita = Cita(**cita.dict())
    db.add(nueva_cita)
    db.commit()
    db.refresh(nueva_cita)
    return nueva_cita


@router.get("/", response_model=list[CitaResponse])
def listar_citas(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Cita).order_by(Cita.fecha_hora.desc()).all()


@router.get("/agenda/{dentista_id}", response_model=list[CitaResponse])
def obtener_agenda(dentista_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Cita).filter(Cita.dentista_id == dentista_id).order_by(Cita.fecha_hora).all()


@router.put("/{cita_id}", response_model=CitaResponse)
def actualizar_cita(cita_id: int, datos: CitaUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cita no encontrada")

    for field, value in datos.dict(exclude_unset=True).items():
        setattr(cita, field, value)

    db.add(cita)
    db.commit()
    db.refresh(cita)
    return cita


@router.delete("/{cita_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_cita(cita_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    cita = db.query(Cita).filter(Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cita no encontrada")

    db.delete(cita)
    db.commit()
