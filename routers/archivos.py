import os
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import get_db
from models.archivo_paciente import ArchivoPaciente
from schemas.archivo_paciente import ArchivoPacienteResponse
from security import get_current_user

router = APIRouter(tags=["Archivos"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/pacientes/{paciente_id}/archivos/upload", response_model=ArchivoPacienteResponse, status_code=status.HTTP_201_CREATED)
def subir_archivo(
    paciente_id: int,
    file: UploadFile = File(...),
    tipo: str = "archivo",
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    file_path = UPLOAD_DIR / f"{paciente_id}_{file.filename}"
    with file_path.open("wb") as buffer:
        buffer.write(file.file.read())

    archivo = ArchivoPaciente(
        paciente_id=paciente_id,
        nombre_archivo=file.filename,
        tipo=tipo,
        ruta=str(file_path),
        mime_type=file.content_type,
    )
    db.add(archivo)
    db.commit()
    db.refresh(archivo)
    return archivo


@router.get("/pacientes/{paciente_id}/archivos", response_model=List[ArchivoPacienteResponse])
def listar_archivos(
    paciente_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(ArchivoPaciente).filter(ArchivoPaciente.paciente_id == paciente_id).all()


@router.delete("/archivos/{archivo_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_archivo(
    archivo_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    archivo = db.query(ArchivoPaciente).filter(ArchivoPaciente.id == archivo_id).first()
    if not archivo:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    if os.path.exists(archivo.ruta):
        os.remove(archivo.ruta)
    db.delete(archivo)
    db.commit()


@router.get("/archivos/{archivo_id}/download")
def descargar_archivo(
    archivo_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    archivo = db.query(ArchivoPaciente).filter(ArchivoPaciente.id == archivo_id).first()
    if not archivo:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    if not os.path.exists(archivo.ruta):
        raise HTTPException(status_code=404, detail="Archivo no encontrado en disco")
    return FileResponse(archivo.ruta, media_type=archivo.mime_type or "application/octet-stream", filename=archivo.nombre_archivo)
