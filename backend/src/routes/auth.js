const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const { authenticate } = require('../middleware/auth');

const router = Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Nombre, email y password son requeridos',
      });
    }

    // Verificar si el email ya existe
    const exists = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({
        statusCode: 409,
        error: 'Conflict',
        message: 'El email ya está registrado',
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, telefono)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol, telefono, avatar_url, created_at`,
      [nombre, email, password_hash, telefono || null]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      token,
      expiresIn: 86400,
    });
  } catch (err) {
    console.error('Error en registro:', err.message);
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Email y password son requeridos',
      });
    }

    const result = await pool.query(
      'SELECT id, nombre, email, password_hash, rol, activo FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Credenciales inválidas',
      });
    }

    const user = result.rows[0];

    if (!user.activo) {
      return res.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Cuenta desactivada',
      });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Credenciales inválidas',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      token,
      expiresIn: 86400,
    });
  } catch (err) {
    console.error('Error en login:', err.message);
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

// POST /auth/refresh
router.post('/refresh', authenticate, async (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, rol: req.user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token, expiresIn: 86400 });
  } catch (err) {
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;
