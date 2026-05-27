const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db/pool');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = Router();

router.post('/', [
  body('nombre').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('oferta').isNumeric().withMessage('Oferta debe ser un número'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ statusCode: 400, error: 'Bad Request', errors: errors.array() });
    }

    const { nombre, email, telefono, autoId, autoMarca, autoModelo, autoPrecio, oferta, mensaje } = req.body;

    const result = await pool.query(
      `INSERT INTO negociaciones (nombre, email, telefono, auto_id, auto_marca, auto_modelo, auto_precio, oferta, mensaje)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, nombre, email, auto_marca, auto_modelo, oferta, created_at`,
      [nombre, email, telefono || null, autoId || null, autoMarca || null, autoModelo || null, autoPrecio || null, oferta, mensaje || null]
    );

    res.status(201).json({ statusCode: 201, message: 'Oferta enviada exitosamente', data: result.rows[0] });
  } catch (err) {
    console.error('Error en negociación:', err.message);
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM negociaciones ORDER BY created_at DESC'
    );
    res.json({ statusCode: 200, data: result.rows });
  } catch (err) {
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;
