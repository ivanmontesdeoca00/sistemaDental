from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.odontograma import Odontograma
from models.paciente import Paciente
from schemas.odontograma import OdontogramaResponse, OdontogramaUpdate
from security import get_current_user

router = APIRouter(tags=["Odontograma"])


def crear_odontograma_inicial(paciente_id: int) -> list[Odontograma]:
    registros = []
    for numero in range(1, 33):
        registros.append(Odontograma(paciente_id=paciente_id, diente_numero=numero, estado="sano", anotaciones=""))
    return registros


@router.get("/pacientes/{paciente_id}/odontograma", response_model=list[OdontogramaResponse])
def obtener_odontograma(paciente_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id, Paciente.is_active == True).first()
    if not paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")

    odontograma = db.query(Odontograma).filter(Odontograma.paciente_id == paciente_id).order_by(Odontograma.diente_numero).all()
    if not odontograma:
        odontograma = crear_odontograma_inicial(paciente_id)
        db.add_all(odontograma)
        db.commit()
        odontograma = db.query(Odontograma).filter(Odontograma.paciente_id == paciente_id).order_by(Odontograma.diente_numero).all()
    return odontograma


@router.put("/pacientes/{paciente_id}/odontograma/{diente_id}", response_model=OdontogramaResponse)
def actualizar_diente(paciente_id: int, diente_id: int, datos: OdontogramaUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id, Paciente.is_active == True).first()
    if not paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")

    diente = db.query(Odontograma).filter(Odontograma.paciente_id == paciente_id, Odontograma.diente_numero == diente_id).first()
    if not diente:
        diente = Odontograma(paciente_id=paciente_id, diente_numero=diente_id)

    for field, value in datos.dict(exclude_unset=True).items():
        setattr(diente, field, value)

    db.add(diente)
    db.commit()
    db.refresh(diente)
    return diente


@router.post("/pacientes/{paciente_id}/odontograma/reset", response_model=list[OdontogramaResponse])
def reset_odontograma(paciente_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id, Paciente.is_active == True).first()
    if not paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")

    db.query(Odontograma).filter(Odontograma.paciente_id == paciente_id).delete()
    registros = crear_odontograma_inicial(paciente_id)
    db.add_all(registros)
    db.commit()
    return db.query(Odontograma).filter(Odontograma.paciente_id == paciente_id).order_by(Odontograma.diente_numero).all()
