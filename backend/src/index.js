const path = require('path');
const envFile = process.env.NODE_ENV === 'test'
  ? path.resolve(__dirname, '../.env.test')
  : path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envFile });
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const brandsRoutes = require('./routes/brands');
const carsRoutes = require('./routes/cars');
const contactRoutes = require('./routes/contact');

const app = express();
const HOST = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
// ============================================
// Middlewares globales
// ============================================
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// ============================================
// Rutas
// ============================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/brands', brandsRoutes);
app.use('/api/v1/cars', carsRoutes);
app.use('/api/v1/contact', contactRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Giraffe Motors API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Database connection test
app.get('/api/v1/health/db', async (req, res) => {
  try {
    const pool = require('./db/pool');
    const result = await pool.query('SELECT NOW() as current_time, version() as postgres_version');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: result.rows[0].current_time,
      postgres_version: result.rows[0].postgres_version,
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
      },
    });
  }
});

// ============================================
// Manejo de errores global
// ============================================
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    error: 'Not Found',
    message: `Ruta ${req.method} ${req.url} no encontrada`,
  });
});

app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    statusCode: 500,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor',
  });
});

// ============================================
// Iniciar servidor
// ============================================
const DEFAULT_PORT = Number(process.env.PORT) || 4000; // Puerto por defecto unificado a 4000
const availablePorts = [DEFAULT_PORT, 5000, 8080, 3000, 8000];
let currentPortIndex = 0;

function startServer(port) {
  const server = app.listen(port, HOST, () => {
    console.log(`
  🦒 Giraffe Motors API
  ─────────────────────────────
  🌐 http://${HOST}:${port}/api/v1
  📋 Health: http://${HOST}:${port}/api/v1/health
  🔧 Entorno: ${process.env.NODE_ENV || 'development'}
  ─────────────────────────────
  `);
  });

  server.on('error', (err) => {
    if ((err.code === 'EACCES' || err.code === 'EADDRINUSE') && currentPortIndex < availablePorts.length - 1) {
      console.warn(`Advertencia: no se pudo usar el puerto ${port} (${err.code}). Intentando el siguiente puerto...`);
      currentPortIndex += 1;
      startServer(availablePorts[currentPortIndex]);
      return;
    }

    if (err.code === 'EACCES') {
      console.error(`Error: permiso denegado para escuchar en el puerto ${port} en ${HOST}.`);
      console.error(`Solución: Ejecuta como administrador o usa un puerto específico con PORT=<puerto> npm run dev`);
      console.error(`Ejemplo: PORT=4000 npm run dev`);
      process.exit(1);
    }

    if (err.code === 'EADDRINUSE') {
      console.error(`Error: el puerto ${port} ya está en uso. Cambia a otro puerto usando PORT=<puerto> npm run dev.`);
      process.exit(1);
    }

    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  });
}

if (require.main === module) {
  startServer(availablePorts[currentPortIndex]);
}

module.exports = app;
