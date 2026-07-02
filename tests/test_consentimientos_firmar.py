import uuid
import requests

BASE = "http://127.0.0.1:8000"


def test_firmar_consentimiento_basico():
    email = f"firma-{uuid.uuid4().hex}@example.com"
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
            "nombre": "Marta",
            "apellido": "Pérez",
            "email": f"paciente-{uuid.uuid4().hex}@example.com",
            "telefono": "922222222",
            "direccion": "Calle Falsa 321",
        },
    )
    assert paciente.status_code == 201, paciente.text
    paciente_id = paciente.json()["id"]

    create_resp = requests.post(
        f"{BASE}/pacientes/{paciente_id}/consentimientos",
        headers=headers,
        json={
            "tipo": "consentimiento_general",
            "texto": "Autorización para tratamiento",
            "firmado": False,
        },
    )
    assert create_resp.status_code == 201, create_resp.text
    consentimiento_id = create_resp.json()["id"]

    sign_resp = requests.put(
        f"{BASE}/consentimientos/{consentimiento_id}/firmar",
        headers=headers,
        json={"firma_digital": "firma-demo"},
    )
    assert sign_resp.status_code == 200, sign_resp.text
    body = sign_resp.json()
    assert body["firmado"] is True
    assert body["firma_digital"] == "firma-demo"
