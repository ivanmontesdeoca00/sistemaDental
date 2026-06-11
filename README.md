# Sistema Integral de Gestión - Clínica Dental Fuenzalida

## 🦷 Descripción

Sistema full-stack diseñado específicamente para la gestión integral de clínicas dentales. Incluye:

- **Gestión de Pacientes**: Historia clínica digital, antecedentes médicos, odontograma interactivo
- **Agenda**: Calendario de citas, agendamiento online
- **Finanzas**: Control de caja, registro de pagos, reportes
- **Seguridad**: Autenticación JWT, encriptación de datos sensibles, cumplimiento de HIPAA
- **Interfaz**: Diseño intuitivo con paleta dental pastel (rosado/violeta/crema)

---

## 📋 Stack Tecnológico

### Backend
- **FastAPI** (Python 3.11+): Framework web de alto rendimiento
- **PostgreSQL**: Base de datos relacional segura
- **SQLAlchemy**: ORM para mapeo de datos
- **JWT**: Autenticación segura
- **Bcrypt**: Encriptación de contraseñas

### Frontend
- **Next.js 16+** (TypeScript): Framework React para producción
- **React 19**: Biblioteca de UI
- **TailwindCSS v4**: Estilos responsivos
- **Axios**: Cliente HTTP para API
- **React Hot Toast**: Notificaciones

---

## 🚀 Inicio Rápido

### Requisitos
- Python 3.11+
- Node.js 18+
- PostgreSQL 13+

### 1. Clonar y configurar variables de entorno

```bash
# Backend
cp .env.example .env
# Edita .env con tus valores (DATABASE_URL, SECRET_KEY, etc.)

# Frontend
cd clinica-frontend
cp .env.local.example .env.local
```

### 2. Instalar dependencias

```bash
# Backend
pip install -r requirements.txt

# Frontend
cd clinica-frontend
npm install
```

### 3. Crear base de datos

```sql
CREATE DATABASE clinica_dental;
```

Las tablas se crearán automáticamente al arrancar el backend.

### 4. Arrancar el sistema

**Terminal 1: Backend**
```bash
uvicorn main:app --reload
```
Backend disponible en: `http://127.0.0.1:8000`

**Terminal 2: Frontend**
```bash
cd clinica-frontend
npm run dev
```
Frontend disponible en: `http://localhost:3000`

### 5. Acceder

- **Inicio**: `http://localhost:3000`
- **Login**: `http://localhost:3000/login`
- **Dashboard**: `http://localhost:3000/dashboard`
- **API Docs**: `http://127.0.0.1:8000/docs`

---

## 📚 Documentación

- **[ARQUITECTURA_SISTEMA.md](./ARQUITECTURA_SISTEMA.md)**: Arquitectura completa, stack, esquema E-R, roadmap (11 fases)
- **[GUIA_INICIO_RAPIDO.md](./GUIA_INICIO_RAPIDO.md)**: Guía paso a paso para comenzar
- **Backend [README.md](./README.md)**: Información del backend

---

## 📂 Estructura del Proyecto

```
sistemaDental/
├── main.py                      # Entrada de FastAPI
├── database.py                  # Configuración PostgreSQL
├── security.py                  # JWT, encriptación
├── models/                      # Modelos SQLAlchemy
│   ├── usuario.py
│   └── paciente.py
├── schemas/                     # Esquemas Pydantic
│   ├── usuario.py
│   └── paciente.py
├── routers/                     # Endpoints
│   ├── auth.py
│   └── pacientes.py
├── clinica-frontend/            # Frontend Next.js
│   ├── src/
│   │   ├── app/                # Rutas
│   │   │   ├── page.tsx        # Inicio
│   │   │   ├── login/          # Autenticación
│   │   │   └── dashboard/      # Panel
│   │   ├── lib/
│   │   │   └── api.ts          # Cliente API
│   │   ├── context/
│   │   │   └── AuthContext.tsx # Auth global
│   │   └── components/         # Componentes
│   └── package.json
├── ARQUITECTURA_SISTEMA.md      # Doc técnica completa
├── GUIA_INICIO_RAPIDO.md        # Tutorial paso a paso
└── requirements.txt             # Dependencias Python
```

---

## ✨ Funcionalidades Actuales (FASE 1)

✅ **Autenticación**
- Registro e login con JWT
- Tokens seguros con expiración

✅ **Gestión de Pacientes**
- CRUD completo de pacientes
- Listar, crear, editar, eliminar

✅ **Dashboard**
- Panel de control visual
- Tabla de pacientes
- KPIs: Total pacientes, citas hoy, ingresos

✅ **Interfaz**
- Diseño dental amable (paleta pastel)
- Responsive en móvil
- Modal de servicios
- Enlace WhatsApp integrado

---

## 🔄 Fases de Desarrollo

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Cimientos, Auth, CRUD | ✅ Completada |
| 2 | Historia Clínica Digital | 🔄 En desarrollo |
| 3 | Odontograma Interactivo | ⏳ Próxima |
| 4 | Gestión de Archivos | ⏳ Próxima |
| 5 | Consentimientos Informados | ⏳ Próxima |
| 6 | Agenda y Citas | ⏳ Próxima |
| 7 | Tratamientos | ⏳ Próxima |
| 8 | Gestión Financiera | ⏳ Próxima |
| 9 | Dashboard Ejecutivo | ⏳ Próxima |
| 10 | Auditoría y Testing | ⏳ Próxima |
| 11 | Deployment | ⏳ Próxima |

Consulta **[ARQUITECTURA_SISTEMA.md](./ARQUITECTURA_SISTEMA.md)** para el roadmap detallado con duraciones estimadas.

---

## 🔐 Seguridad

- ✅ Encriptación de contraseñas (bcrypt)
- ✅ Tokens JWT con expiración
- ✅ CORS restringido
- ✅ Rate limiting
- ✅ Auditoría de cambios (pendiente)
- 🔄 Encriptación AES-256 de datos sensibles (próximo)
- 🔄 Cumplimiento HIPAA (próximo)

---

## 📊 Endpoints Disponibles

### Autenticación
- `POST /auth/registro` - Crear usuario
- `POST /auth/login` - Iniciar sesión

### Pacientes
- `GET /pacientes` - Listar todos
- `GET /pacientes/{id}` - Detalle
- `POST /pacientes` - Crear
- `PUT /pacientes/{id}` - Actualizar
- `DELETE /pacientes/{id}` - Eliminar

Revisa `http://127.0.0.1:8000/docs` para documentación completa.

---

## 🐛 Solución de Problemas

**¿Backend no se conecta?**
- Verifica PostgreSQL esté corriendo
- Revisa `DATABASE_URL` en `.env`
- Confirma `SECRET_KEY` está definida

**¿Frontend no ve backend?**
- Revisa `NEXT_PUBLIC_API_URL` en `.env.local`
- Asegúrate que backend esté en `http://127.0.0.1:8000`
- Revisa CORS en `main.py` incluya `http://localhost:3000`

**¿Token expirado?**
- El token dura 30 min (configurable)
- El frontend redirige automáticamente a `/login` al expirar

---

## 📞 Customización

**Cambiar número de WhatsApp:**
Edita `clinica-frontend/src/app/page.tsx`:
```tsx
href="http://wa.me/+56935130026"  // ← Tu número aquí
```

**Cambiar colores:**
Modifica `clinica-frontend/src/app/globals.css` y `page.tsx` (colores hex de la paleta).

---

## 📖 Recursos

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)

---

## 📝 Licencia

Proyecto privado para Clínica Dental Fuenzalida.

---

**Última actualización**: 10 de Junio de 2026  
**Versión**: 1.0 (FASE 1 completada)
