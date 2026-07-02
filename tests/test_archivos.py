import uuid
import requests

BASE = "http://127.0.0.1:8000"


def test_archivos_basicos():
    email = f"archivos-{uuid.uuid4().hex}@example.com"
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
            "nombre": "Luis",
            "apellido": "Torres",
            "email": f"paciente-{uuid.uuid4().hex}@example.com",
            "telefono": "911111111",
            "direccion": "Calle Falsa 123",
        },
    )
    assert paciente.status_code == 201, paciente.text
    paciente_id = paciente.json()["id"]

    upload_resp = requests.post(
        f"{BASE}/pacientes/{paciente_id}/archivos/upload",
        headers=headers,
        files={"file": ("radiografia.txt", b"contenido de prueba", "text/plain")},
        data={"tipo": "radiografia"},
    )
    assert upload_resp.status_code == 201, upload_resp.text

    list_resp = requests.get(f"{BASE}/pacientes/{paciente_id}/archivos", headers=headers)
    assert list_resp.status_code == 200, list_resp.text
    data = list_resp.json()
    assert isinstance(data, list)
    assert any(item.get("nombre_archivo") == "radiografia.txt" for item in data)

    archivo_id = next(item["id"] for item in data if item.get("nombre_archivo") == "radiografia.txt")
    download_resp = requests.get(f"{BASE}/archivos/{archivo_id}/download", headers=headers)
    assert download_resp.status_code == 200, download_resp.text
