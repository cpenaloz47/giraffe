require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const brandsRoutes = require('./routes/brands');
const carsRoutes = require('./routes/cars');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Giraffe Motors API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
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
app.listen(PORT, () => {
  console.log(`
  🦒 Giraffe Motors API
  ─────────────────────────────
  🌐 http://localhost:${PORT}/api/v1
  📋 Health: http://localhost:${PORT}/api/v1/health
  🔧 Entorno: ${process.env.NODE_ENV || 'development'}
  ─────────────────────────────
  `);
});
