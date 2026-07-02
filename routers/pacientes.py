from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.paciente import Paciente
from schemas.paciente import PacienteCreate, PacienteResponse, PacienteUpdate
from security import get_current_user

router = APIRouter(prefix="/pacientes", tags=["Pacientes"])

@router.post("", response_model=PacienteResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=PacienteResponse, status_code=status.HTTP_201_CREATED)
def crear_paciente(
    paciente: PacienteCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_paciente = db.query(Paciente).filter(Paciente.email == paciente.email).first()
    if db_paciente:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El email del paciente ya está registrado")

    nuevo_paciente = Paciente(**paciente.dict())
    db.add(nuevo_paciente)
    db.commit()
    db.refresh(nuevo_paciente)
    return nuevo_paciente

@router.get("", response_model=list[PacienteResponse])
@router.get("/", response_model=list[PacienteResponse])
def listar_pacientes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Paciente).filter(Paciente.is_active == True).all()

@router.get("/{paciente_id}", response_model=PacienteResponse)
def obtener_paciente(
    paciente_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id, Paciente.is_active == True).first()
    if not paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")
    return paciente

@router.put("/{paciente_id}", response_model=PacienteResponse)
def actualizar_paciente(
    paciente_id: int,
    paciente: PacienteUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_paciente = db.query(Paciente).filter(Paciente.id == paciente_id, Paciente.is_active == True).first()
    if not db_paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")

    if paciente.email and paciente.email != db_paciente.email:
        existing = db.query(Paciente).filter(Paciente.email == paciente.email).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El email del paciente ya está registrado")

    for field, value in paciente.dict(exclude_unset=True).items():
        setattr(db_paciente, field, value)

    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

@router.delete("/{paciente_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_paciente(
    paciente_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id, Paciente.is_active == True).first()
    if not paciente:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")

    paciente.is_active = False
    db.add(paciente)
    db.commit()
