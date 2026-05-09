# 🦒 Giraffe Roadster — E-commerce de Autos Descapotables de Lujo

Proyecto de laboratorio para curso de desarrollo Full Stack.

## Stack tecnológico

| Capa      | Tecnología                              |
|-----------|-----------------------------------------|
| Frontend  | Vite + Bootstrap 5 + Bootstrap Icons    |
| Backend   | Express + cors + dotenv + pg + nodemon  |
| Base datos| PostgreSQL                              |
| Auth      | JWT (jsonwebtoken + bcryptjs)            |

## Estructura del proyecto

```
giraffe-ecommerce/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── pool.js            # Pool de conexión PostgreSQL
│   │   ├── middleware/
│   │   │   └── auth.js            # Middleware JWT + roles
│   │   ├── routes/
│   │   │   ├── auth.js            # Login, registro, refresh
│   │   │   ├── brands.js          # CRUD marcas
│   │   │   └── cars.js            # CRUD autos + filtros
│   │   └── index.js               # Entry point Express
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── css/
│   │   │   └── main.css           # Estilos + Bootstrap
│   │   └── js/
│   │       └── main.js            # Lógica + interacciones
│   ├── index.html                 # Home page (wireframe)
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

## Instalación

### 1. Clonar y configurar

```bash
git clone <repo-url>
cd giraffe-ecommerce
```

### 2. Base de datos

```bash
# Crear la base de datos en PostgreSQL
createdb giraffe_db

# Ejecutar el script DDL (archivo giraffe-database.sql)
psql -d giraffe_db -f giraffe-database.sql
```

### 3. Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
npm install
npm run dev
```

El servidor inicia en `http://localhost:3000/api/v1`

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

La app inicia en `http://localhost:5173`

El proxy de Vite redirige `/api` al backend automáticamente.

## Paleta de colores

| Color           | Hex       | Uso                        |
|-----------------|-----------|----------------------------|
| Dark            | `#1C1917` | Textos principales         |
| Charcoal        | `#2E2A27` | Títulos secundarios        |
| Stone           | `#78716C` | Textos descriptivos        |
| Accent (dorado) | `#C2A76E` | Botones, acentos, CTAs     |
| Cream           | `#FAF8F5` | Fondo principal            |
| Pearl           | `#F3F0EB` | Fondo secundario / footer  |
| Silk            | `#EDE8E0` | Bordes y separadores       |

## Tipografía

- **Display:** Cormorant Garamond (títulos, headers)
- **Body:** Libre Franklin (textos, navegación, botones)

## Endpoints disponibles

| Método | Ruta               | Acceso  | Descripción          |
|--------|--------------------|---------|-----------------------|
| POST   | /auth/register     | Público | Registro de usuario   |
| POST   | /auth/login        | Público | Inicio de sesión      |
| POST   | /auth/refresh      | 🔒     | Renovar token         |
| GET    | /brands            | Público | Listar marcas         |
| POST   | /brands            | 🔒👑   | Crear marca           |
| PUT    | /brands/:id        | 🔒👑   | Actualizar marca      |
| DELETE | /brands/:id        | 🔒👑   | Eliminar marca        |
| GET    | /cars              | Público | Catálogo con filtros   |
| GET    | /cars/:id          | Público | Detalle de un auto    |
| POST   | /cars              | 🔒👑   | Crear auto            |
| PUT    | /cars/:id          | 🔒👑   | Actualizar auto       |
| DELETE | /cars/:id          | 🔒👑   | Eliminar auto         |

---

*Proyecto académico — Giraffe Motors 2026*
