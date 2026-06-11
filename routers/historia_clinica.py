from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.historia_clinica import HistoriaClinica
from schemas.historia_clinica import HistoriaCreate, HistoriaResponse, HistoriaUpdate
from security import get_current_user

router = APIRouter(tags=["HistoriaClinica"])


@router.post("/pacientes/{paciente_id}/historias", response_model=HistoriaResponse, status_code=status.HTTP_201_CREATED)
def crear_historia(paciente_id: int, historia: HistoriaCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    nueva = HistoriaClinica(paciente_id=paciente_id, **historia.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.get("/pacientes/{paciente_id}/historias", response_model=list[HistoriaResponse])
def listar_historias(paciente_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(HistoriaClinica).filter(HistoriaClinica.paciente_id == paciente_id).all()


@router.get("/historias/{historia_id}", response_model=HistoriaResponse)
def obtener_historia(historia_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    h = db.query(HistoriaClinica).filter(HistoriaClinica.id == historia_id).first()
    if not h:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historia no encontrada")
    return h


@router.put("/historias/{historia_id}", response_model=HistoriaResponse)
def actualizar_historia(historia_id: int, historia: HistoriaUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    h = db.query(HistoriaClinica).filter(HistoriaClinica.id == historia_id).first()
    if not h:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historia no encontrada")

    for field, value in historia.dict(exclude_unset=True).items():
        setattr(h, field, value)

    db.add(h)
    db.commit()
    db.refresh(h)
    return h


@router.delete("/historias/{historia_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_historia(historia_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    h = db.query(HistoriaClinica).filter(HistoriaClinica.id == historia_id).first()
    if not h:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historia no encontrada")
    db.delete(h)
    db.commit()
