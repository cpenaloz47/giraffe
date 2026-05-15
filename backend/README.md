# 🦒 Giraffe Motors — Backend API

API REST para el e-commerce de autos de lujo Giraffe Motors.

## 🚀 Características

- **Autenticación JWT**: Registro, login y refresh de tokens
- **Base de datos PostgreSQL**: Usuarios, contactos, marcas y autos
- **Validación de datos**: express-validator en rutas clave
- **CORS**: Soporte para frontend Vite
- **Tests**: Jest + Supertest
- **Documentación**: Endpoints RESTful en /api/v1

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 12+
- npm

## 🧰 Configuración rápida

1. Copia el archivo de entorno:
   ```bash
   cp .env.example .env
   ```
2. Ajusta las variables de conexión en .env.
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Crea la base de datos y carga el esquema:
   ```bash
   createdb giraffe_db
   psql -d giraffe_db -f database.sql
   ```

   En Windows puedes usar setup-db.bat.

   Para ejecutar pruebas unitarias en el entorno de test:
   ```bash
   NODE_ENV=test npm test
   ```

   En Windows puedes usar setup-db.bat.

## ▶️ Ejecutar servidor

```bash
npm run dev
```

El servidor intenta iniciar en un puerto disponible, preferente 8080, 5000 o 4000.

## 🔍 Verificar salud

```bash
curl http://127.0.0.1:4000/api/v1/health
curl http://127.0.0.1:4000/api/v1/health/db
```

## 📚 Endpoints principales

### Autenticación
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh

### Contacto
- POST /api/v1/contact
- GET /api/v1/contact (admin)

### Marcas
- GET /api/v1/brands
- GET /api/v1/brands/:id
- POST /api/v1/brands (admin)
- PUT /api/v1/brands/:id (admin)
- DELETE /api/v1/brands/:id (admin)

### Autos
- GET /api/v1/cars
- GET /api/v1/cars/:id
- POST /api/v1/cars (admin)
- PUT /api/v1/cars/:id (admin)
- DELETE /api/v1/cars/:id (admin)

## 🧪 Tests

```bash
npm test
```

### Thunder Client

- Si usas la extensión Thunder Client, crea una colección de pruebas con base URL:
  `http://127.0.0.1:4000/api/v1`
- Rutas sugeridas: `/auth/register`, `/auth/login`, `/contact`, `/brands`, `/cars`, `/health`
- Para pruebas unitarias automáticas usa Jest + Supertest en `backend/tests/api.test.js`.

## 🗂️ Estructura del backend

```
backend/
├── src/
│   ├── db/
│   │   └── pool.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── contact.js
│   │   ├── brands.js
│   │   └── cars.js
│   └── index.js
├── tests/
│   └── api.test.js
├── database.sql
├── .env.example
├── package.json
└── setup-db.bat
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Rutas protegidas con middleware
- CORS configurado para frontend

## 💡 Notas

- database.sql incluye esquema y datos iniciales.
- No subas credenciales en .env.
