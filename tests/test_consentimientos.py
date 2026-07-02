import uuid
import requests

BASE = "http://127.0.0.1:8000"


def test_consentimientos_basicos():
    email = f"consent-{uuid.uuid4().hex}@example.com"
    password = "password123"

    reg = requests.post(f"{BASE}/auth/registro", json={"email": email, "password": password, "rol": "Dentista"})
    assert reg.status_code in (201, 400)

    login = requests.post(
        f"{BASE}/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login.status_code == 200, login.text
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    paciente = requests.post(
        f"{BASE}/pacientes",
        headers=headers,
        json={
            "nombre": "Ana",
            "apellido": "Silva",
            "email": f"paciente-{uuid.uuid4().hex}@example.com",
            "telefono": "999999999",
            "direccion": "Av. Siempre Viva 123",
        },
    )
    assert paciente.status_code == 201, paciente.text
    paciente_id = paciente.json()["id"]

    create_resp = requests.post(
        f"{BASE}/pacientes/{paciente_id}/consentimientos",
        headers=headers,
        json={
            "tipo": "consentimiento_general",
            "texto": "Autorización para tratamiento odontológico",
            "firmado": True,
            "observaciones": "Pendiente de firma física",
        },
    )
    assert create_resp.status_code == 201, create_resp.text

    list_resp = requests.get(f"{BASE}/pacientes/{paciente_id}/consentimientos", headers=headers)
    assert list_resp.status_code == 200, list_resp.text
    data = list_resp.json()
    assert isinstance(data, list)
    assert any(item.get("tipo") == "consentimiento_general" for item in data)
