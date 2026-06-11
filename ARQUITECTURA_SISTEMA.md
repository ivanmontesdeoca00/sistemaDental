# Sistema Integral de Gestión - Clínica Dental Fuenzalida

**Documento de Arquitectura y Especificaciones Técnicas**

---

## 1. STACK TECNOLÓGICO SUGERIDO

### Backend: FastAPI (Python)
**Justificación:**
- ✅ **Velocidad < 2 seg**: FastAPI es una de las opciones más rápidas en Python. Benchmarks recientes lo posicionan entre los frameworks más veloces (comparable con Node.js y Go en latencia).
- ✅ **Asincronismo nativo**: Soporta async/await para operaciones I/O sin bloqueo (bases de datos, archivos).
- ✅ **Validación automática**: Usa Pydantic para validar datos de entrada automáticamente (crucial para datos sensibles de salud).
- ✅ **OpenAPI/Swagger integrado**: Documentación interactiva y generación automática de clientes.
- ✅ **Seguridad**: Soporte nativo para OAuth2, JWT y encriptación.
- **Alternativa rechazada**: Django es más lento (overhead mayor) y más orientado a aplicaciones monolíticas.

### Frontend: Next.js 16+ (TypeScript/React)
**Justificación:**
- ✅ **Server-Side Rendering (SSR) y Static Generation**: Mejora velocidad y SEO.
- ✅ **TypeScript**: Seguridad de tipos en tiempo de compilación.
- ✅ **API Routes integradas**: Middleware entre Frontend y Backend si es necesario.
- ✅ **Optimización automática**: Next.js maneja optimización de imágenes (crucial para radiografías).
- ✅ **UI/UX fluida**: React + TailwindCSS para interfaces intuitivas.
- **Complemento**: Para el odontograma interactivo, usar **Konva.js** (canvas 2D) + **React-Konva** o **Fabric.js**. Son librerías open-source maduras para dibujos dinámicos de dientes.

### Base de Datos: PostgreSQL
**Justificación:**
- ✅ **HIPAA-compliant**: Soporta encriptación nativa (pgcrypto, datos sensibles).
- ✅ **Integridad referencial**: Constraints y triggers para datos críticos de salud.
- ✅ **Escalabilidad**: Soporta 1000+ usuarios sin problemas.
- ✅ **Auditoría integrada**: Registrar cambios en datos sensibles automáticamente.
- ✅ **JSON/JSONB**: Para estructuras heterogéneas (antecedentes médicos flexibles).

### Almacenamiento de Archivos
- **Local/Producción**: AWS S3 o MinIO (open-source, self-hosted).
- **Encriptación**: AES-256 para radiografías y documentos sensibles.
- **Acceso restringido**: URLs temporales con expiración (30 min).

### Seguridad y Autenticación
- **JWT (JSON Web Tokens)**: Autenticación stateless.
- **OAuth2**: Para futuros integradores.
- **Encriptación End-to-End**: Bcrypt para contraseñas, AES-256 para datos sensibles.
- **CORS restringido**: Solo desde dominios autorizados.
- **Rate limiting**: Protección contra ataques DDoS.
- **Logging auditado**: Todas las acciones registradas con timestamp y usuario.

---

## 2. ESQUEMA DE BASE DE DATOS (DIAGRAMA E-R)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLÍNICA DENTAL FUENZALIDA                     │
│                      Esquema de Base de Datos                       │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│      USUARIOS            │
├──────────────────────────┤
│ id (PK)                  │
│ email (UNIQUE)           │
│ password_hash            │
│ nombre_completo          │
│ rol (Dentista, Admin)    │
│ telefono                 │
│ is_active                │
│ created_at               │
│ updated_at               │
└──────────────────────────┘
           │
           │ 1:N
           ▼
┌──────────────────────────────────┐
│      PACIENTES                   │
├──────────────────────────────────┤
│ id (PK)                          │
│ nombre                           │
│ apellido                         │
│ email (UNIQUE)                   │
│ telefono                         │
│ fecha_nacimiento                 │
│ genero                           │
│ direccion                        │
│ ciudad                           │
│ is_active                        │
│ created_at                       │
│ updated_at                       │
└──────────────────────────────────┘
           │
           │ 1:1
           ▼
┌───────────────────────────────────────┐
│  HISTORIA_CLINICA                     │
├───────────────────────────────────────┤
│ id (PK)                               │
│ paciente_id (FK)                      │
│ alergias (TEXT)                       │
│ medicamentos_actuales (TEXT)          │
│ enfermedades_sistemicas (JSONB)       │
│   - diabetes, hipertensión, etc.      │
│ problemas_cardiovasculares (TEXT)     │
│ alteraciones_coagulacion (TEXT)       │
│ intervenciones_quirurgicas (TEXT)     │
│ habitos (JSONB)                       │
│   - tabaquismo, bruxismo, etc.        │
│ observaciones (TEXT)                  │
│ updated_at                            │
└───────────────────────────────────────┘
           │
           │ 1:1
           ▼
┌──────────────────────────────────────┐
│      ODONTOGRAMA                     │
├──────────────────────────────────────┤
│ id (PK)                              │
│ paciente_id (FK)                     │
│ diente_numero (INT 1-32)             │
│ estado (sano, cariado, ausente...)   │
│ anotaciones (TEXT)                   │
│ imagen_url (si hay foto)             │
│ updated_at                           │
└──────────────────────────────────────┘
           │
           │ 1:N
           ▼
┌──────────────────────────────────────┐
│   ARCHIVOS_PACIENTE                  │
├──────────────────────────────────────┤
│ id (PK)                              │
│ paciente_id (FK)                     │
│ nombre_archivo                       │
│ tipo (radiografia, documento, etc.)  │
│ url_s3 (encriptada)                  │
│ fecha_subida                         │
│ subido_por (user_id FK)              │
│ tamaño_bytes                         │
│ es_sensible (boolean)                │
└──────────────────────────────────────┘
           │
           │ 1:N
           ▼
┌──────────────────────────────────────┐
│  CONSENTIMIENTOS_INFORMADOS          │
├──────────────────────────────────────┤
│ id (PK)                              │
│ paciente_id (FK)                     │
│ tipo_tratamiento                     │
│ contenido_html                       │
│ fecha_generacion                     │
│ fecha_firma                          │
│ firma_digital (o PDF)                │
│ estado (pendiente, firmado, etc.)    │
│ updated_at                           │
└──────────────────────────────────────┘

           CITAS y AGENDA
┌──────────────────────────────────────┐
│      CITAS                           │
├──────────────────────────────────────┤
│ id (PK)                              │
│ paciente_id (FK)                     │
│ dentista_id (user_id FK)             │
│ fecha_hora (TIMESTAMP)               │
│ duracion_minutos (INT)               │
│ motivo_cita (TEXT)                   │
│ estado (agendada, completada,...)    │
│ tipo_cita (consulta, tratamiento...) │
│ sillaId (INT)                        │
│ notas_pre_cita (TEXT)                │
│ notas_post_cita (TEXT)               │
│ created_at                           │
│ updated_at                           │
└──────────────────────────────────────┘
           │
           │ 1:N
           ▼
┌────────────────────────────────────────┐
│      TRATAMIENTOS                      │
├────────────────────────────────────────┤
│ id (PK)                                │
│ cita_id (FK)                           │
│ paciente_id (FK)                       │
│ dentista_id (user_id FK)               │
│ descripcion (TEXT)                     │
│ tipo (operatoria, endodoncia, etc.)    │
│ dientes_afectados (ARRAY INT)          │
│ estado (planificado, en_progreso...)   │
│ costo (DECIMAL)                        │
│ diagnostico (TEXT)                     │
│ plan_tratamiento (JSONB)               │
│ fecha_inicio                           │
│ fecha_finalizacion_estimada            │
│ fecha_finalizacion_real                │
│ created_at                             │
│ updated_at                             │
└────────────────────────────────────────┘

         FINANZAS Y PAGOS
┌────────────────────────────────────────┐
│      TRANSACCIONES_PACIENTE            │
├────────────────────────────────────────┤
│ id (PK)                                │
│ paciente_id (FK)                       │
│ tratamiento_id (FK, nullable)          │
│ tipo (pago, abono, deuda, etc.)        │
│ monto (DECIMAL)                        │
│ fecha_transaccion (TIMESTAMP)          │
│ metodo_pago (efectivo, tarjeta, etc.)  │
│ referencia (comprobante, cheque, etc.) │
│ usuario_registro (user_id FK)          │
│ observaciones (TEXT)                   │
│ created_at                             │
└────────────────────────────────────────┘
           │
           │ 1:N
           ▼
┌────────────────────────────────────────┐
│    ESTADO_CUENTA_PACIENTE              │
├────────────────────────────────────────┤
│ id (PK)                                │
│ paciente_id (FK, UNIQUE)               │
│ saldo_actual (DECIMAL)                 │
│ total_pagado (DECIMAL)                 │
│ total_adeudado (DECIMAL)               │
│ servicios_pendientes (INT)             │
│ ultima_actualizacion (TIMESTAMP)       │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│       ARQUEO_CAJA_DIARIO               │
├────────────────────────────────────────┤
│ id (PK)                                │
│ fecha (DATE)                           │
│ usuario_id (FK)                        │
│ saldo_inicial (DECIMAL)                │
│ ingresos_dia (DECIMAL)                 │
│ egresos_dia (DECIMAL)                  │
│ saldo_final (DECIMAL)                  │
│ diferencia (DECIMAL, control)          │
│ estado (abierto, cerrado)              │
│ observaciones (TEXT)                   │
│ created_at                             │
│ closed_at                              │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│      GASTOS_OPERATIVOS                 │
├────────────────────────────────────────┤
│ id (PK)                                │
│ categoria (insumos, servicios, etc.)   │
│ descripcion (TEXT)                     │
│ monto (DECIMAL)                        │
│ fecha_gasto (DATE)                     │
│ usuario_registro (user_id FK)          │
│ comprobante_url (nullable, S3)         │
│ centro_costo (operación, admin, etc.)  │
│ created_at                             │
└────────────────────────────────────────┘

         AUDITORÍA Y SEGURIDAD
┌────────────────────────────────────────┐
│        AUDIT_LOG                       │
├────────────────────────────────────────┤
│ id (PK)                                │
│ usuario_id (FK)                        │
│ tabla_afectada (pacientes, etc.)       │
│ accion (INSERT, UPDATE, DELETE)        │
│ datos_anteriores (JSONB)               │
│ datos_nuevos (JSONB)                   │
│ timestamp (TIMESTAMP)                  │
│ ip_address                             │
│ user_agent                             │
└────────────────────────────────────────┘
```

---

## 3. ARQUITECTURA DEL SISTEMA

### Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                     │
│  Next.js Frontend (TypeScript/React) + TailwindCSS          │
│  ├─ Dashboard (Pacientes, Citas, Finanzas)                 │
│  ├─ Odontograma Interactivo (Konva.js + React-Konva)      │
│  ├─ Formularios de Antecedentes Médicos                    │
│  ├─ Gestor de Archivos (Radiografías, PDFs)               │
│  └─ Portal de Citas Online                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS/TLS
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE APLICACIÓN                       │
│           FastAPI (Python) - Backend Principal              │
├─────────────────────────────────────────────────────────────┤
│ MÓDULOS PRINCIPALES:                                        │
│                                                             │
│  1. auth/                                                   │
│     ├─ POST /auth/registro       → Crear usuario           │
│     ├─ POST /auth/login          → JWT + refresh token     │
│     ├─ POST /auth/refresh        → Renovar token           │
│     └─ POST /auth/logout         → Invalidar token         │
│                                                             │
│  2. pacientes/                                              │
│     ├─ GET /pacientes            → Listar todos            │
│     ├─ GET /pacientes/{id}       → Detalle                 │
│     ├─ POST /pacientes           → Crear nuevo             │
│     ├─ PUT /pacientes/{id}       → Actualizar              │
│     ├─ DELETE /pacientes/{id}    → Eliminar (soft)         │
│     └─ GET /pacientes/{id}/estado-cuenta → Estado         │
│                                                             │
│  3. historia_clinica/                                       │
│     ├─ GET /pacientes/{id}/historia                        │
│     ├─ PUT /pacientes/{id}/historia                        │
│     └─ GET /pacientes/{id}/historia/export                 │
│                                                             │
│  4. odontograma/                                            │
│     ├─ GET /pacientes/{id}/odontograma                     │
│     ├─ PUT /pacientes/{id}/odontograma/{diente_id}         │
│     └─ POST /pacientes/{id}/odontograma/reset              │
│                                                             │
│  5. archivos/                                               │
│     ├─ POST /pacientes/{id}/archivos/upload                │
│     ├─ GET /pacientes/{id}/archivos                        │
│     ├─ DELETE /archivos/{archivo_id}                       │
│     └─ GET /archivos/{id}/download (signed URL)            │
│                                                             │
│  6. consentimientos/                                        │
│     ├─ POST /pacientes/{id}/consentimientos                │
│     ├─ GET /pacientes/{id}/consentimientos                 │
│     ├─ PUT /consentimientos/{id}/firmar                    │
│     └─ POST /consentimientos/{id}/enviar-por-email         │
│                                                             │
│  7. citas/                                                  │
│     ├─ GET /citas                                          │
│     ├─ GET /citas/agenda/{dentista_id}                     │
│     ├─ POST /citas                                         │
│     ├─ PUT /citas/{id}                                     │
│     ├─ DELETE /citas/{id}                                  │
│     └─ POST /citas/{id}/confirmar                          │
│                                                             │
│  8. tratamientos/                                           │
│     ├─ POST /pacientes/{id}/tratamientos                   │
│     ├─ GET /pacientes/{id}/tratamientos                    │
│     ├─ PUT /tratamientos/{id}                              │
│     └─ GET /reportes/tratamientos-pendientes               │
│                                                             │
│  9. finanzas/                                               │
│     ├─ POST /pacientes/{id}/transacciones                  │
│     ├─ GET /pacientes/{id}/transacciones                   │
│     ├─ GET /caja/arqueo/hoy                                │
│     ├─ POST /caja/arqueo/cerrar                            │
│     ├─ POST /gastos                                        │
│     ├─ GET /reportes/caja/{fecha}                          │
│     └─ GET /reportes/finanzas/{rango_fechas}              │
│                                                             │
│  10. audit/                                                 │
│      └─ GET /audit/log?usuario={id}&fecha={rango}          │
│                                                             │
│  MIDDLEWARES:                                               │
│  ├─ JWT Validation (OAuth2)                                │
│  ├─ CORS (restringido a dominios autorizados)             │
│  ├─ Rate Limiting (100 req/min por IP)                     │
│  ├─ Logging & Auditing (registra todas las acciones)      │
│  ├─ Error Handling (manejo centralizado)                   │
│  └─ Request/Response Compression (gzip)                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓ SQL/TCP
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                            │
│    PostgreSQL (13+) - Base de Datos Relacional              │
├─────────────────────────────────────────────────────────────┤
│  ├─ Encriptación pgcrypto (datos sensibles)                │
│  ├─ Triggers para auditoría automática                      │
│  ├─ Índices optimizados para búsquedas rápidas            │
│  ├─ Backups automáticos (daily)                            │
│  └─ Connection pooling (máx 20 conexiones)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  SERVICIOS EXTERNOS                         │
│  ├─ AWS S3 / MinIO (Almacenamiento de archivos)            │
│  ├─ SendGrid / SMTP (Correos - consentimientos, citas)     │
│  ├─ Twilio (SMS - recordatorios de citas, opcional)        │
│  └─ Sentry (Monitoreo de errores en producción)            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Comunicación

```
1. AUTENTICACIÓN
   Cliente → POST /auth/login → FastAPI → PostgreSQL
   ← JWT Token + Refresh Token (válido 30 min)

2. OPERACIÓN PROTEGIDA (Ej: GET /pacientes)
   Cliente (con JWT) → GET /pacientes
   → FastAPI (valida JWT) → PostgreSQL
   ← JSON Response (< 2 seg)

3. CARGA DE ARCHIVOS
   Cliente → POST /pacientes/{id}/archivos/upload
   → FastAPI → AWS S3 / MinIO (encriptado)
   ← URL temporal (30 min) + registro en DB

4. AUDITORÍA
   Toda acción → AUDIT_LOG (automático con triggers)
```

---

## 4. PLAN DE DESARROLLO (ROADMAP)

### FASE 1: Cimientos y Autenticación (2-3 semanas)
**Objetivo**: Base de datos, autenticación segura y CRUD básico de pacientes.

**Entregables**:
- [x] Modelos SQLAlchemy (Usuario, Paciente)
- [x] Schemas Pydantic (validación)
- [x] Autenticación JWT + OAuth2
- [ ] Endpoint de registro e login
- [ ] Endpoint CRUD de pacientes (GET, POST, PUT, DELETE)
- [ ] Middleware de CORS y Rate Limiting
- [ ] Tests unitarios (pytest)

**Backend**:
```
✓ database.py (conexión PostgreSQL)
✓ models/usuario.py, models/paciente.py
✓ schemas/usuario.py, schemas/paciente.py
✓ security.py (JWT, bcrypt)
✓ routers/auth.py, routers/pacientes.py
```

**Frontend**:
- Página de login estática
- Integración fetch() → /auth/login
- Almacenamiento JWT en localStorage
- Protección de rutas (redirect a login si no autenticado)

---

### FASE 2: Historia Clínica Digital (3-4 semanas)
**Objetivo**: Antecedentes médicos complejos y búsqueda rápida.

**Entregables**:
- [ ] Modelo HistoriaClinica (alergias, enfermedades sistémicas, etc.)
- [ ] Endpoint GET/PUT /pacientes/{id}/historia
- [ ] UI en React para llenar antecedentes (formularios dinámicos)
- [ ] Validación de campos críticos
- [ ] Búsqueda por alergia, enfermedad, etc. (< 1 seg)
- [ ] Export a PDF (reportlab en Python)

**Backend**:
```
├─ models/historia_clinica.py
├─ schemas/historia_clinica.py
└─ routers/historia_clinica.py
```

**Frontend**:
- Componente `/pacientes/{id}/historia` (form wizard)
- Validaciones en tiempo real
- Exportar como PDF

---

### FASE 3: Odontograma Dinámico (3-4 semanas)
**Objetivo**: Visualización e interacción con dientes.

**Entregables**:
- [ ] Modelo Odontograma (diente_numero, estado, anotaciones)
- [ ] Endpoint GET/PUT /pacientes/{id}/odontograma/{diente_id}
- [ ] Librería **React-Konva** o **Fabric.js** integrada
- [ ] Renderizado dinámico (temporal vs permanente)
- [ ] Anotaciones por diente (caries, ausente, etc.)
- [ ] Exportar odontograma como imagen

**Backend**:
```
├─ models/odontograma.py
├─ schemas/odontograma.py
└─ routers/odontograma.py
```

**Frontend**:
- Componente `<OdontogramaInteractivo />` (Konva)
- Click en diente → formulario emergente
- Renderización diferenciada (niños vs adultos)
- Zoom y navegación suave

---

### FASE 4: Gestión de Archivos (2-3 semanas)
**Objetivo**: Radiografías y documentos encriptados.

**Entregables**:
- [ ] Configuración AWS S3 / MinIO
- [ ] Encriptación AES-256 antes de subir
- [ ] Endpoint POST /pacientes/{id}/archivos/upload (multipart/form-data)
- [ ] Generación de URLs firmadas (30 min expiration)
- [ ] Galería de archivos en perfil del paciente
- [ ] Delete + vinculación en audit log

**Backend**:
```
├─ models/archivo_paciente.py
├─ schemas/archivo_paciente.py
├─ services/s3_service.py (encriptación, upload, download)
└─ routers/archivos.py
```

**Frontend**:
- Dropzone para subir archivos
- Galería con preview (imágenes, PDFs)
- Validación de tipo MIME
- Barra de progreso de carga

---

### FASE 5: Consentimientos Informados (2 semanas)
**Objetivo**: Generación, envío y firma digital.

**Entregables**:
- [ ] Modelo ConsentimientoInformado (contenido, firma, estado)
- [ ] Endpoint POST /pacientes/{id}/consentimientos (generar desde template)
- [ ] Endpoint PUT /consentimientos/{id}/firmar (firma digital básica o PDF)
- [ ] Envío por email (SendGrid)
- [ ] Almacenamiento seguro de firma

**Backend**:
```
├─ models/consentimiento.py
├─ schemas/consentimiento.py
├─ services/email_service.py (SendGrid)
└─ routers/consentimientos.py
```

**Frontend**:
- Modal: seleccionar tipo de tratamiento → generar consentimiento
- Visualización HTML del documento
- Botón "Firmar" → captura digital (canvas o firma manuscrita)
- Envío por email

---

### FASE 6: Agenda y Citas (3-4 semanas)
**Objetivo**: Calendario intuitivo y agendamiento online.

**Entregables**:
- [ ] Modelo Cita (fecha, paciente, dentista, estado)
- [ ] Endpoint GET /citas/agenda/{dentista_id} (retorna eventos)
- [ ] Endpoint POST /citas (crear, validar solapamientos)
- [ ] Endpoint PUT /citas/{id} (reprogramar)
- [ ] Validar horarios disponibles (< 500 ms)
- [ ] Recordatorio por email (24h antes)

**Backend**:
```
├─ models/cita.py
├─ schemas/cita.py
├─ services/agenda_service.py (validación de disponibilidad)
└─ routers/citas.py
```

**Frontend**:
- Calendar component (react-big-calendar o similar)
- Vista por dentista y por sillón
- Formulario: paciente + fecha/hora → crear cita
- Drag & drop para reprogramar
- Mostrar disponibilidad en tiempo real

---

### FASE 7: Tratamientos y Planes (2-3 semanas)
**Objetivo**: Registro de tratamientos realizados y planes futuros.

**Entregables**:
- [ ] Modelo Tratamiento (descripción, tipo, dientes afectados, costo, estado)
- [ ] Endpoint POST /pacientes/{id}/tratamientos
- [ ] Endpoint GET /pacientes/{id}/tratamientos
- [ ] Endpoint PUT /tratamientos/{id} (actualizar estado)
- [ ] Cálculo automático de saldos adeudados
- [ ] Reporte de tratamientos pendientes

**Backend**:
```
├─ models/tratamiento.py
├─ schemas/tratamiento.py
├─ services/tratamiento_service.py
└─ routers/tratamientos.py
```

**Frontend**:
- Tabla de tratamientos por paciente
- Formulario para agregar plan de tratamiento
- Seguimiento de progreso (% completado)
- Estimado de costo

---

### FASE 8: Gestión Financiera (4 semanas)
**Objetivo**: Control de caja, transacciones y reportes.

**Entregables**:
- [ ] Modelo TransaccionPaciente y EstadoCuentaPaciente
- [ ] Endpoint POST /pacientes/{id}/transacciones (registrar pago/deuda)
- [ ] Endpoint GET /pacientes/{id}/estado-cuenta
- [ ] Endpoint POST /caja/arqueo/cerrar (cierre diario)
- [ ] Endpoint POST /gastos (registrar gastos operativos)
- [ ] Reportes mensuales (ingresos, egresos, ganancias)
- [ ] Gráficos de ingresos vs egresos

**Backend**:
```
├─ models/transaccion_paciente.py
├─ models/estado_cuenta.py
├─ models/arqueo_caja.py
├─ models/gasto_operativo.py
├─ schemas/finanzas.py
├─ services/finanzas_service.py
└─ routers/finanzas.py
```

**Frontend**:
- Dashboard: ingresos hoy, saldo en caja
- Módulo de pagos (formulario rápido)
- Cierre de caja diario (checklist)
- Reportes interactivos (gráficos)
- Tabla de gastos clasificados

---

### FASE 9: Dashboard Ejecutivo y Reportes (3 semanas)
**Objetivo**: Visualización integral de operaciones.

**Entregables**:
- [ ] Dashboard principal (KPIs: pacientes activos, citas hoy, ingresos semana)
- [ ] Gráficos: ingresos vs egresos, servicios más solicitados, dentista/productividad
- [ ] Reportes exportables (PDF, Excel)
- [ ] Filtros por rango de fechas, dentista, servicio
- [ ] Actualizaciones en tiempo real (WebSockets para citas)

**Frontend**:
- Componentes de gráficos (recharts o plotly)
- Tarjetas de KPI
- Tablas interactivas con ordenamiento

---

### FASE 10: Auditoría, Seguridad y Testing (2 semanas)
**Objetivo**: Compliance, monitoreo y calidad.

**Entregables**:
- [ ] Logging centralizado de todas las acciones (AUDIT_LOG)
- [ ] Endpoint GET /audit/log (filtros: usuario, fecha, acción)
- [ ] Pruebas E2E (Cypress o Playwright)
- [ ] Test de carga (locust) - verificar < 2 seg en condiciones normales
- [ ] Validación HIPAA compliance (encriptación, acceso restringido)
- [ ] Documentación de seguridad y procedimientos

**Backend**:
- Decoradores para auditar cambios automáticamente
- Tests unitarios (pytest) con >80% coverage

**Frontend**:
- Tests de componentes (Jest + React Testing Library)
- Tests E2E críticos (login, crear paciente, registrar pago)

---

### FASE 11: Optimización y Despliegue (2 semanas)
**Objetivo**: Producción lista.

**Entregables**:
- [ ] Dockerización (Backend + Frontend + PostgreSQL)
- [ ] CI/CD (GitHub Actions, GitLab CI, etc.)
- [ ] Optimización de queries PostgreSQL (índices, EXPLAIN ANALYZE)
- [ ] Caché (Redis) para datos frecuentes
- [ ] CDN para archivos estáticos y radiografías
- [ ] SSL/TLS en producción
- [ ] Backup automático de base de datos (diario)
- [ ] Guía de deployment

---

## 5. CRONOGRAMA ESTIMADO

| Fase | Descripción | Semanas | Hitos |
|------|-------------|---------|-------|
| 1 | Cimientos y Auth | 2-3 | ✓ Login funcional |
| 2 | Historia Clínica | 3-4 | ✓ Antecedentes médicos |
| 3 | Odontograma | 3-4 | ✓ Interacción con dientes |
| 4 | Archivos | 2-3 | ✓ Radiografías subidas |
| 5 | Consentimientos | 2 | ✓ Firma digital |
| 6 | Agenda | 3-4 | ✓ Calendario operativo |
| 7 | Tratamientos | 2-3 | ✓ Plan de tratamiento |
| 8 | Finanzas | 4 | ✓ Control de caja |
| 9 | Dashboard | 3 | ✓ KPIs y reportes |
| 10 | Auditoría + Testing | 2 | ✓ Compliance ready |
| 11 | Deploy | 2 | ✓ **Sistema en Producción** |
| | **TOTAL** | **27-35 semanas** | **~6-8 meses** |

---

## 6. TECNOLOGÍAS COMPLEMENTARIAS POR FASE

### Librerías Recomendadas

#### Backend (Python)
```
fastapi==0.109+
uvicorn==0.27+
sqlalchemy==2.0+
pydantic==2.0+
python-dotenv==1.0+
passlib[bcrypt]==1.7+
python-jose[cryptography]==3.3+
psycopg2-binary==2.9+
python-multipart==0.0+
python-magic-bin==0.4+  # Detección de tipo MIME
cryptography==41+       # Encriptación AES-256
boto3==1.28+           # AWS S3 (opcional)
reportlab==4.0+        # Generación de PDFs
email-validator==2.0+
aiofiles==23.0+        # Manejo asincrónico de archivos
```

#### Frontend (TypeScript/React)
```
next==16.2+
react==19.0+
typescript==5.0+
tailwindcss==4.0+
axios==1.6+            # HTTP client
zustand==4.4+          # State management
react-big-calendar==1.8+ # Componente Calendar
react-konva==18.2+     # Odontograma (Konva.js)
recharts==2.10+        # Gráficos
jspdf==2.5+            # Generación de PDFs
html2canvas==1.4+      # Captura de UI
react-hot-toast==2.4+  # Notificaciones
```

---

## 7. CRITERIOS DE ÉXITO

✅ **Rendimiento**: Todas las operaciones < 2 segundos  
✅ **Seguridad**: Encriptación AES-256, JWT, CORS restringido  
✅ **Usabilidad**: Interfaz intuitiva, sin necesidad de capacitación extensa  
✅ **Escalabilidad**: Soporta 1000+ pacientes sin degradación  
✅ **Disponibilidad**: 99.5% uptime en producción  
✅ **Compliance**: Cumple normativas de protección de datos (HIPAA-like)  
✅ **Testing**: >80% code coverage, E2E críticas automatizadas  

---

## 8. SIGUIENTE PASO INMEDIATO

Comenzar **FASE 1** con:
1. ✓ Crear estructura de carpetas y modelos en FastAPI
2. ✓ Implementar endpoints de registro/login
3. ✓ Crear formularios de login en React
4. ✓ Testing básico con Postman o curl

**Fecha sugerida de inicio**: Inmediatamente después de este documento.

---

**Documento preparado por**: Arquitecto de Software Senior  
**Fecha**: 10 de Junio de 2026  
**Versión**: 1.0
