const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db/pool');

const router = Router();

// POST /contact
router.post('/', [
  body('nombre').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('telefono').optional().isMobilePhone().withMessage('Teléfono inválido'),
  body('motivo').isIn(['compra', 'test-drive', 'financiamiento', 'servicio-tecnico', 'personalizacion', 'seguros', 'reclamo', 'otro']).withMessage('Motivo inválido'),
  body('mensaje').isLength({ min: 10 }).withMessage('Mensaje debe tener al menos 10 caracteres'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Datos inválidos',
        errors: errors.array(),
      });
    }

    const { nombre, email, telefono, motivo, mensaje } = req.body;

    const result = await pool.query(
      `INSERT INTO contactos (nombre, email, telefono, motivo, mensaje)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, email, motivo, created_at`,
      [nombre, email, telefono || null, motivo, mensaje]
    );

    const contacto = result.rows[0];

    res.status(201).json({
      statusCode: 201,
      message: 'Mensaje enviado exitosamente',
      data: contacto,
    });
  } catch (err) {
    console.error('Error en contacto:', err.message);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: err.message,
    });
  }
});

// GET /contact (requiere autenticación para admin)
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, telefono, motivo, mensaje, created_at FROM contactos ORDER BY created_at DESC'
    );

    res.json({
      statusCode: 200,
      data: result.rows,
    });
  } catch (err) {
    console.error('Error obteniendo contactos:', err.message);
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: err.message,
    });
  }
});

module.exports = router;