import requests
import pytest

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

    # Crear paciente (acepta 201 o 400 si ya existe)
    paciente = {
        "nombre": "Test",
        "apellido": "Paciente",
        "email": "test.paciente@example.com",
        "telefono": "00000000",
        "direccion": "Calle Test 1"
    }
    r = requests.post(f"{BASE}/pacientes", headers=headers, json=paciente)
    assert r.status_code in (201, 400), r.text

    # Obtener lista pacientes
    r = requests.get(f"{BASE}/pacientes", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    pacientes = r.json()
    assert isinstance(pacientes, list)
    # Buscar paciente creado
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
