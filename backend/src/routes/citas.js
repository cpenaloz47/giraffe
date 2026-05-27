const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db/pool');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = Router();

router.post('/', [
  body('nombre').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('fecha').isDate().withMessage('Fecha inválida'),
  body('hora').matches(/^\d{2}:\d{2}$/).withMessage('Hora inválida'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ statusCode: 400, error: 'Bad Request', errors: errors.array() });
    }

    const { nombre, email, telefono, autoId, autoMarca, autoModelo, fecha, hora, comentario } = req.body;

    const result = await pool.query(
      `INSERT INTO citas (nombre, email, telefono, auto_id, auto_marca, auto_modelo, fecha, hora, comentario)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, nombre, email, auto_marca, auto_modelo, fecha, hora, created_at`,
      [nombre, email, telefono || null, autoId || null, autoMarca || null, autoModelo || null, fecha, hora, comentario || null]
    );

    res.status(201).json({ statusCode: 201, message: 'Cita agendada exitosamente', data: result.rows[0] });
  } catch (err) {
    console.error('Error en cita:', err.message);
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM citas ORDER BY fecha ASC, hora ASC'
    );
    res.json({ statusCode: 200, data: result.rows });
  } catch (err) {
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;
