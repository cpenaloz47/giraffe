# 🦒 Giraffe Roadster — E-commerce de Autos de Lujo

Proyecto Full Stack que integra un frontend React/Vite con un backend Express y PostgreSQL.

## Stack tecnológico

| Capa      | Tecnología                                   |
|-----------|----------------------------------------------|
| Frontend  | React + Vite + Bootstrap 5 + Bootstrap Icons |
| Backend   | Node.js + Express + JSON Web Tokens + pg     |
| Base datos| PostgreSQL                                   |
| Autenticación | JWT + bcryptjs                          |

## Estructura del proyecto

```
giraffe-ecommerce/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── pool.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── brands.js
│   │   │   ├── cars.js
│   │   │   └── contact.js
│   │   └── index.js
│   ├── database.sql
│   ├── .env.example
│   ├── package.json
│   └── tests/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── css/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── INTEGRATION_GUIDE.md
└── README.md
```

## Requisitos

- Node.js 18+
- npm
- PostgreSQL 12+

## Instalación rápida

### 1. Clonar el repositorio

```bash
git clone https://github.com/cpenaloz47/giraffe.git
cd giraffe-ecommerce
```

### 2. Configurar la base de datos

```bash
createdb giraffe_db
psql -d giraffe_db -f backend/database.sql
```

Si prefieres, también puedes ejecutar el script de Windows desde `backend/setup-db.bat`.

### 3. Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales PostgreSQL
npm install
npm run dev
```

El backend arranca en `http://127.0.0.1:4000` o en el primer puerto disponible entre `8080`, `5000` y `4000`.

### 4. Frontend

```bash
cd ../frontend
npm install
npm run dev
```

El frontend arranca en `http://localhost:5173`.

> El proxy de Vite redirige `/api` a `http://127.0.0.1:4000`.

## API disponibles

Todas las rutas usan el prefijo base `/api/v1`.

| Método | Ruta                   | Acceso  | Descripción                     |
|--------|------------------------|---------|---------------------------------|
| POST   | /api/v1/auth/register  | Público | Registro de usuario             |
| POST   | /api/v1/auth/login     | Público | Inicio de sesión                |
| POST   | /api/v1/auth/refresh   | Público | Renovar token                   |
| POST   | /api/v1/contact        | Público | Enviar mensaje de contacto      |
| GET    | /api/v1/contact        | Admin   | Listar mensajes de contacto     |
| GET    | /api/v1/brands         | Público | Listar marcas                   |
| GET    | /api/v1/brands/:id     | Público | Obtener marca                   |
| POST   | /api/v1/brands         | Admin   | Crear marca                     |
| PUT    | /api/v1/brands/:id     | Admin   | Actualizar marca                |
| DELETE | /api/v1/brands/:id     | Admin   | Eliminar marca                  |
| GET    | /api/v1/cars           | Público | Listar autos con filtros        |
| GET    | /api/v1/cars/:id       | Público | Detalle de un auto              |
| POST   | /api/v1/cars           | Admin   | Crear auto                      |
| PUT    | /api/v1/cars/:id       | Admin   | Actualizar auto                 |
| DELETE | /api/v1/cars/:id       | Admin   | Eliminar auto                   |
| GET    | /api/v1/health         | Público | Estado del servidor             |
| GET    | /api/v1/health/db      | Público | Estado de la base de datos      |

## Cómo usar el catálogo

- `GET /api/v1/cars` admite filtros de marca, modelo, tipo, transmisión, combustible, año y precio.
- `GET /api/v1/cars/:id` muestra el detalle completo del auto.

## Tests

El backend incluye pruebas con Jest y Supertest.

```bash
cd backend
npm test
```

## Notas

- El archivo `backend/database.sql` contiene el esquema y los datos iniciales.
- El archivo `INTEGRATION_GUIDE.md` describe la integración frontend/back.
- Si actualizas `.env`, no olvides no subir credenciales al repositorio.
