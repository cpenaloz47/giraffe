# 🦒 Giraffe Motors — Backend API

API REST para el sistema de e-commerce de autos de lujo Giraffe Motors.

## 🚀 Características

- **Autenticación JWT**: Registro, login y refresh tokens
- **Base de datos PostgreSQL**: Gestión de usuarios, contactos y catálogo
- **Validación de datos**: Middlewares con express-validator
- **CORS**: Soporte para orígenes cruzados
- **Tests**: Cobertura de rutas API con Jest y Supertest
- **Documentación**: Endpoints RESTful

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 12+
- npm o yarn

## � Inicio rápido

1. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales de PostgreSQL
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Crear base de datos**
   - Asegúrate de tener PostgreSQL instalado y ejecutándose
   - Ejecuta el script de configuración: `setup-db.bat` (como administrador)
   - O configura manualmente:
     ```bash
     # Establecer contraseña para usuario postgres
     psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'dino13';"

     # Crear base de datos
     createdb -U postgres giraffe_db

     # Ejecutar esquema
     psql -U postgres -d giraffe_db -f database.sql
     ```

4. **Ejecutar servidor**
   ```bash
   npm run dev  # Puerto por defecto: 8080 (o 5000 si está ocupado)
   ```

   El servidor iniciará automáticamente en un puerto disponible (8080, 5000, 4000, etc.)

## 🔍 Verificar Conexión

**Health Check General:**
```bash
curl http://127.0.0.1:4000/api/v1/health
```

**Verificar Conexión a Base de Datos:**
```bash
curl http://127.0.0.1:4000/api/v1/health/db
```
Si la conexión es exitosa, verás información sobre PostgreSQL.

## 📚 API Endpoints

### Autenticación
- `POST /api/v1/auth/register` — Registrar usuario
- `POST /api/v1/auth/login` — Iniciar sesión
- `POST /api/v1/auth/refresh` — Refrescar token

### Contacto
- `POST /api/v1/contact` — Enviar mensaje de contacto
- `GET /api/v1/contact` — Listar mensajes (solo admin)

### Catálogo
- `GET /api/v1/brands` — Listar marcas
- `GET /api/v1/cars` — Listar autos
- `GET /api/v1/cars/:id` — Detalles de auto

### Health
- `GET /api/v1/health` — Estado del servidor

## 🧪 Tests

Los tests cubren:
- Registro de usuarios (éxito, validación, conflicto)
- Login (éxito, credenciales inválidas, validación)
- Contacto (envío, validación)
- Health check

```bash
npm test
```

## 🔧 Scripts

- `npm run dev` — Desarrollo con nodemon
- `npm test` — Ejecutar tests
- `npm run start` — Producción

## 📁 Estructura del proyecto

```
backend/
├── src/
│   ├── db/
│   │   └── pool.js          # Conexión PostgreSQL
│   ├── middleware/
│   │   └── auth.js          # Autenticación JWT
│   ├── routes/
│   │   ├── auth.js          # Rutas de autenticación
│   │   ├── contact.js       # Rutas de contacto
│   │   ├── brands.js        # Rutas de marcas
│   │   └── cars.js          # Rutas de autos
│   └── index.js             # Servidor principal
├── tests/
│   └── api.test.js          # Tests de API
├── database.sql             # Esquema de BD
├── .env.example             # Variables de entorno
└── package.json
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Validación de entrada en todas las rutas
- CORS configurado para frontend

## 📝 Notas

Para ejecutar los tests completamente, asegúrate de tener PostgreSQL configurado con las credenciales correctas en `.env`.