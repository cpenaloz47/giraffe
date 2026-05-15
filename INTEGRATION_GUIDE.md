# 🦒 Guía de Integración Front-End y Back-End

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 12+
- npm o yarn
- Dos terminales separadas (una para frontend, otra para backend)

---

## 🚀 Pasos para ejecutar

### 1️⃣ Configurar y ejecutar el Backend

En la **primera terminal**:

```bash
cd backend
npm install        # Solo la primera vez
cp .env.example .env  # Configurar credenciales DB
npm run dev        # Backend en http://127.0.0.1:5000
```

**Verificar que el backend esté funcionando:**
```bash
curl http://127.0.0.1:4000/api/v1/health
# Debería responder: {"status":"ok","service":"Giraffe Motors API",...}
```

### 2️⃣ Configurar y ejecutar el Frontend

En la **segunda terminal**:

```bash
cd frontend
npm install        # Solo la primera vez
npm run dev        # Frontend en http://localhost:5173
```

**Verificar que el frontend esté funcionando:**
- Abre http://localhost:5173 en tu navegador
- Deberías ver la página de inicio de Giraffe Motors

---

## 🔐 Flujo de Autenticación

### Registro
1. Haz clic en **INGRESO** en la esquina superior derecha
2. Selecciona la pestaña **Registrarse**
3. Completa:
   - Nombre completo
   - Email
   - Teléfono (opcional)
   - Contraseña (mínimo 8 caracteres)
4. Clic en **CREAR CUENTA**

### Login
1. Haz clic en **INGRESO**
2. Selecciona la pestaña **Ingresar**
3. Completa:
   - Email
   - Contraseña
4. Clic en **INGRESAR**

### Logout
Una vez autenticado, el botón **INGRESO** mostrará tu nombre. Haz clic para cerrar sesión.

---

## 📡 Estructura de Comunicación

```
Frontend (http://localhost:5173)
    ↓
    └─→ Vite Proxy (/api → http://127.0.0.1:4000)
        ↓
Backend (http://127.0.0.1:4000)
    ↓
    └─→ PostgreSQL
```

### URLs del Backend (desde Frontend)
- **Login**: `POST /api/v1/auth/login`
- **Register**: `POST /api/v1/auth/register`
- **Refresh Token**: `POST /api/v1/auth/refresh`
- **Contacto**: `POST /api/v1/contact`
- **Salud API**: `GET /api/v1/health`

---

## 🔧 Solución de Problemas

### ❌ Frontend no se conecta al Backend
- Verifica que el backend está ejecutándose en `http://127.0.0.1:5000`
- Verifica que el frontend está en `http://localhost:5173`
- Revisa la consola del navegador (F12) para errores de CORS

### ❌ Error "EACCES" al iniciar Backend
- El puerto 5000 está ocupado o bloqueado
- Solución: `PORT=5001 npm run dev` en el backend

### ❌ Base de datos no se conecta
- Verifica credenciales en `.env` del backend
- Asegúrate que PostgreSQL está ejecutándose
- Crea la base de datos: `createdb giraffe_db`
- Ejecuta el esquema: `psql -d giraffe_db -f database.sql`

### ❌ Token JWT no funciona
- Limpia localStorage: Abre DevTools (F12) → Application → Storage → Clear All
- Intenta registrar/login nuevamente

---

## 📝 Tokens y Almacenamiento

Los tokens se almacenan en `localStorage`:
- `giraffe_token`: Token JWT
- `giraffe_user`: Datos del usuario (JSON)

Se incluyen automáticamente en headers como:
```
Authorization: Bearer <token>
```

---

## 🧪 Probar Integración Completa

### 1. Autenticación
1. Ve a http://localhost:5175/contacto
2. Haz clic en **INGRESO** → **Registrarse**
3. Completa el formulario y registra un usuario
4. Cierra sesión y prueba el login

### 2. Formulario de Contacto
1. Ve a http://localhost:5175/contacto
2. Completa el formulario de contacto
3. Envía el mensaje
4. Verifica que se muestra la pantalla de éxito

### 3. Verificar en Base de Datos
```bash
# Conectar a PostgreSQL
psql -U postgres -d giraffe_db

# Ver usuarios registrados
SELECT * FROM usuarios;

# Ver mensajes de contacto
SELECT * FROM contactos;
```

---

## 📞 API de Servicios (Frontend)

Ubicación: `frontend/src/services/api.js`

```javascript
// Autenticación
import { registerUser, loginUser } from './services/api';

// Contacto
import { sendContactMessage } from './services/api';

// Catálogo
import { getBrands, getCars, getCarById } from './services/api';
```

**Ejemplo de uso:**
```javascript
const { login, register } = useAuth();

await login('user@email.com', 'password123');
await register('Juan', 'juan@email.com', 'password123', '+56 9 1234 5678');
```

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcryptjs
- ✅ Tokens JWT con expiración
- ✅ CORS configurado (solo http://localhost:5173)
- ✅ Validación de entrada en todas las rutas
- ✅ Middlewares de autenticación

---

## 📚 Documentación Completa

- Backend: `backend/README.md`
- Esquema DB: `backend/database.sql`
- Variables de entorno: `backend/.env.example`
