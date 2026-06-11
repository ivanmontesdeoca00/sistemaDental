import requests

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXZAZXhhbXBsZS5jb20iLCJyb2wiOiJhZG1pbiIsImV4cCI6MTc4MTIxOTI5M30.WrkZrdWFAkXPu0ljFHSiXM53FUaTpG7izzQC5S00XCU'
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Crear paciente de prueba
payload = {
    'nombre': 'Juan',
    'apellido': 'Perez',
    'email': 'juan.perez@example.com',
    'telefono': '12345678',
    'direccion': 'Calle Falsa 123'
}

r = requests.post('http://127.0.0.1:8000/pacientes', headers=headers, json=payload)
print(r.status_code)
print(r.text)

# Listar pacientes
r2 = requests.get('http://127.0.0.1:8000/pacientes', headers={'Authorization': f'Bearer {token}'})
print(r2.status_code)
print(r2.text)

# Crear historia clinica para paciente id=1
hist = {
    'fecha': '2026-06-11',
    'motivo': 'Dolor de muela',
    'diagnostico': 'Caries',
    'tratamientos': 'Obturación',
    'medicamentos': 'Ibuprofeno',
    'notas': 'Paciente con sensibilidad',
}

r3 = requests.post('http://127.0.0.1:8000/pacientes/1/historias', headers=headers, json=hist)
print(r3.status_code)
print(r3.text)

# Listar historias del paciente 1
r4 = requests.get('http://127.0.0.1:8000/pacientes/1/historias', headers={'Authorization': f'Bearer {token}'})
print(r4.status_code)
print(r4.text)
