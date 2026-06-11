import requests
import pytest
import uuid
from datetime import datetime, timedelta, timezone

BASE = "http://127.0.0.1:8000"


def test_register_and_login_and_flow():
    # Registrar (acepta 201 o 400 si ya existe)
    reg_payload = {"email": "dev@example.com", "password": "password123", "rol": "admin"}
    r = requests.post(f"{BASE}/auth/registro", json=reg_payload)
    assert r.status_code in (201, 400, 422)

    # Login
    data = {"username": "dev@example.com", "password": "password123"}
    r = requests.post(f"{BASE}/auth/login", data=data)
    assert r.status_code == 200, r.text
    token = r.json().get("access_token")
    assert token
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Crear paciente con email único para evitar datos duplicados en la base existente
    paciente = {
        "nombre": "Test",
        "apellido": "Paciente",
        "email": f"test.paciente+{uuid.uuid4().hex}@example.com",
        "telefono": "00000000",
        "direccion": "Calle Test 1"
    }
    r = requests.post(f"{BASE}/pacientes", headers=headers, json=paciente)
    assert r.status_code == 201, r.text

    # Obtener lista pacientes
    r = requests.get(f"{BASE}/pacientes", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    pacientes = r.json()
    assert isinstance(pacientes, list)
    paciente_id = None
    for p in pacientes:
        if p.get("email") == paciente["email"]:
            paciente_id = p.get("id")
            break
    assert paciente_id is not None

    # Crear historia clinica
    historia = {
        "fecha": "2026-06-11",
        "motivo": "Chequeo",
        "diagnostico": "OK",
        "tratamientos": "Ninguno",
        "medicamentos": "Ninguno",
        "notas": "Prueba E2E"
    }
    r = requests.post(f"{BASE}/pacientes/{paciente_id}/historias", headers=headers, json=historia)
    assert r.status_code == 201, r.text

    # Listar historias
    r = requests.get(f"{BASE}/pacientes/{paciente_id}/historias", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    hs = r.json()
    assert isinstance(hs, list) and len(hs) >= 1

    # Obtener odontograma y actualizar un diente
    r = requests.get(f"{BASE}/pacientes/{paciente_id}/odontograma", headers=headers)
    assert r.status_code == 200
    odontograma = r.json()
    assert isinstance(odontograma, list) and len(odontograma) == 32
    primer_diente = odontograma[0]

    r = requests.put(
        f"{BASE}/pacientes/{paciente_id}/odontograma/{primer_diente['diente_numero']}",
        headers=headers,
        json={"estado": "caries", "anotaciones": "Revisar oclusión"}
    )
    assert r.status_code == 200
    assert r.json().get("estado") == "caries"

    # Crear cita con hora y dentista únicos para evitar conflictos
    dentista_id = (uuid.uuid4().int % 10) + 1
    minutos_offset = uuid.uuid4().int % (60 * 24)
    fecha_cita = (datetime.now(timezone.utc) + timedelta(days=1, minutes=minutos_offset)).isoformat(timespec="minutes")
    cita = {
        "paciente_id": paciente_id,
        "dentista_id": dentista_id,
        "fecha_hora": fecha_cita,
        "motivo": "Limpieza",
        "notas": "Cita de prueba"
    }
    r = requests.post(f"{BASE}/citas", headers=headers, json=cita)
    assert r.status_code == 201, r.text
    cita_id = r.json().get("id")
    assert cita_id

    # Listar citas
    r = requests.get(f"{BASE}/citas", headers=headers)
    assert r.status_code == 200
    citas = r.json()
    assert isinstance(citas, list)

    # Obtener agenda por dentista
    r = requests.get(f"{BASE}/citas/agenda/{dentista_id}", headers=headers)
    assert r.status_code == 200
    agenda = r.json()
    assert isinstance(agenda, list)

    # Registrar transacciones de finanzas
    r = requests.post(
        f"{BASE}/pacientes/{paciente_id}/transacciones",
        headers=headers,
        json={"tipo": "cargo", "monto": 200.0, "descripcion": "Tratamiento"}
    )
    assert r.status_code == 201

    r = requests.post(
        f"{BASE}/pacientes/{paciente_id}/transacciones",
        headers=headers,
        json={"tipo": "pago", "monto": 100.0, "descripcion": "Abono"}
    )
    assert r.status_code == 201

    # Obtener estado de cuenta
    r = requests.get(f"{BASE}/pacientes/{paciente_id}/estado-cuenta", headers=headers)
    assert r.status_code == 200
    cuenta = r.json()
    assert cuenta["paciente_id"] == paciente_id
    assert cuenta["total_cargos"] >= 200.0
    assert cuenta["total_pagos"] >= 100.0
    assert cuenta["saldo"] == pytest.approx(cuenta["total_pagos"] - cuenta["total_cargos"])
