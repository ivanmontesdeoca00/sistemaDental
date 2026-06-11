# GUÍA DE INICIO RÁPIDO - Sistema de Gestión Clínica Dental

## 📋 Requisitos Previos

- **Python** 3.11+ instalado
- **Node.js** 18+ instalado
- **PostgreSQL** 13+ en ejecución
- **Git** (opcional)

---

## 🚀 PASO 1: Configurar Variables de Entorno

### Backend (.env)

1. Ve a `c:\Users\Gamer\sistemaDental\`
2. Copia `.env.example` a `.env`:

```bash
copy .env.example .env
```

3. Edita `.env` con tus valores:

```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/clinica_dental
SECRET_KEY=tu_clave_secreta_super_segura_aqui_minimo_32_caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Importante**: Genera una clave segura con:
```python
import secrets
print(secrets.token_urlsafe(32))
```

### Frontend (.env.local)

1. Ve a `c:\Users\Gamer\sistemaDental\clinica-frontend\`
2. Copia `.env.local.example` a `.env.local`:

```bash
copy .env.local.example .env.local
```

3. El contenido debe ser:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## 🗄️ PASO 2: Preparar Base de Datos

1. Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE clinica_dental;
```

2. Las tablas se crearán automáticamente cuando arranques el backend.

---

## 🔧 PASO 3: Instalar Dependencias

### Backend

```bash
cd c:\Users\Gamer\sistemaDental
python -m pip install -r requirements.txt
```

### Frontend

```bash
cd c:\Users\Gamer\sistemaDental\clinica-frontend
npm install
```

---

## ⚡ PASO 4: Arrancar el Sistema

### Terminal 1: Backend (Python)

```bash
cd c:\Users\Gamer\sistemaDental

# Activar el entorno virtual
.\venv\Scripts\activate

# Arrancar el servidor FastAPI
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Esperado**:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

✅ Backend listo en: `http://127.0.0.1:8000`  
📖 Documentación API: `http://127.0.0.1:8000/docs`

### Terminal 2: Frontend (Next.js)

```bash
cd c:\Users\Gamer\sistemaDental\clinica-frontend
npm run dev
```

**Esperado**:
```
▲ Next.js 16.2.7
- Local:        http://localhost:3000
- Environments: .env.local
```

✅ Frontend listo en: `http://localhost:3000`

---

## 🎯 PASO 5: Acceder al Sistema

### 🏠 Página de Inicio
URL: `http://localhost:3000`
- Muestra información de la clínica
- Modal de servicios
- Botón de WhatsApp

### 🔐 Inicio de Sesión
URL: `http://localhost:3000/login`

**Crear primera cuenta**:
1. Click en "Regístrate aquí"
2. Completa:
   - Email: `dentista@clinica.com`
   - Contraseña: algo seguro (min 8 caracteres)
   - Rol: Dentista
3. Click en "Crear Cuenta"

### 📊 Dashboard
URL: `http://localhost:3000/dashboard` (solo si estás autenticado)

**Funcionalidades disponibles actualmente**:
- ✅ Listar pacientes desde la base de datos
- ✅ Ver total de pacientes
- ✅ Botón para agregar nuevo paciente (en desarrollo)
- 🔜 Agenda de citas
- 🔜 Gestión financiera
- 🔜 Historia clínica
- 🔜 Odontograma

### 📚 API Documentation
URL: `http://127.0.0.1:8000/docs`

Puedes probar todos los endpoints desde aquí de forma interactiva.

---

## ✅ Verificar que Todo Funciona

### 1️⃣ Backend está corriendo
```bash
curl http://127.0.0.1:8000/
```
Respuesta esperada:
```json
{"mensaje":"API de Clínica Dental en línea y funcionando"}
```

### 2️⃣ Frontend está corriendo
Abre `http://localhost:3000` en tu navegador.

### 3️⃣ CORS está configurado
El frontend debe conectar sin problemas con el backend.

### 4️⃣ Base de datos está conectada
Intenta registrar un usuario; debería guardarse en PostgreSQL.

---

## 📞 Números de WhatsApp

Para actualizar el número de WhatsApp, edita:
**Archivo**: `clinica-frontend\src\app\page.tsx`

Busca la línea:
```tsx
href="http://wa.me/+56935130026"
```

Reemplaza con tu número en formato internacional:
```tsx
href="http://wa.me/+CODIGOPAIS9NUMEROPERSONAL"
```

**Ejemplos**:
- Chile: `http://wa.me/+569XXXXXXXX`
- Colombia: `http://wa.me/+573XXXXXXXXX`
- España: `http://wa.me/+34XXXXXXXXX`

---

## 🐛 Solución de Problemas

### Error: "Cannot GET /pacientes"
**Causa**: Backend no está corriendo.
**Solución**: Verifica que la Terminal 1 esté activa y mostrando "Uvicorn running..."

### Error: "CORS error"
**Causa**: El backend no reconoce el origen del frontend.
**Solución**: Verifica que en `main.py` esté `http://localhost:3000` en la lista de `origins`.

### Error: "Connection refused" en base de datos
**Causa**: PostgreSQL no está corriendo.
**Solución**: Inicia el servicio PostgreSQL:
```bash
pg_ctl -D "C:\Program Files\PostgreSQL\data" start
```

### Error: "Secret key required"
**Causa**: La variable `SECRET_KEY` en `.env` no está definida.
**Solución**: Asegúrate de tener `SECRET_KEY` en tu archivo `.env`.

---

## 📁 Estructura del Proyecto

```
sistemaDental/
├── backend (Python)
│   ├── main.py                 # Entrada de la aplicación
│   ├── database.py             # Conexión a PostgreSQL
│   ├── security.py             # JWT y autenticación
│   ├── models/                 # Modelos SQLAlchemy
│   ├── schemas/                # Esquemas Pydantic
│   ├── routers/                # Endpoints (auth, pacientes, etc.)
│   ├── requirements.txt         # Dependencias Python
│   └── .env                    # Variables de entorno (crear)
│
├── clinica-frontend (Next.js)
│   ├── src/
│   │   ├── app/                # Rutas (pages)
│   │   │   ├── page.tsx        # Inicio
│   │   │   ├── login/          # Autenticación
│   │   │   └── dashboard/      # Panel principal
│   │   ├── lib/                # Utilidades
│   │   │   └── api.ts          # Cliente HTTP
│   │   ├── context/            # Contextos React
│   │   │   └── AuthContext.tsx # Autenticación global
│   │   └── components/         # Componentes reutilizables
│   ├── package.json            # Dependencias Node
│   └── .env.local              # Variables de entorno (crear)
│
├── ARQUITECTURA_SISTEMA.md     # Documentación técnica completa
└── README.md                   # Este archivo
```

---

## 🎓 Próximos Pasos

1. **FASE 1** (Completada ✅):
   - [x] Backend con FastAPI
   - [x] Autenticación JWT
   - [x] CRUD de pacientes
   - [x] Frontend con Next.js
   - [x] Login/Registro
   - [x] Dashboard básico

2. **FASE 2** (En desarrollo 🔄):
   - [ ] Historia Clínica Digital
   - [ ] Odontograma Interactivo
   - [ ] Citas y Agenda
   - [ ] Finanzas

3. **FASE 3** (Próximas):
   - [ ] Reportes y Analytics
   - [ ] Tests E2E
   - [ ] Deployment en producción

Revisa `ARQUITECTURA_SISTEMA.md` para el roadmap detallado.

---

## 📖 Recursos Útiles

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Next.js Docs**: https://nextjs.org/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **React Hooks**: https://react.dev/reference/react

---

## 💡 Tips

- Usa `http://127.0.0.1:8000/docs` para probar endpoints rápidamente
- Guarda los tokens JWT en localStorage automáticamente
- Las contraseñas se encriptan con bcrypt (seguridad)
- Los tokens expiran cada 30 minutos (configurable en `.env`)

---

## ❓ ¿Preguntas?

Revisa los logs en la terminal para ver detalles de errores.

**¡Bienvenido al Sistema de Gestión de Clínica Dental Fuenzalida! 🦷💜**

---

**Última actualización**: 10 de Junio de 2026
