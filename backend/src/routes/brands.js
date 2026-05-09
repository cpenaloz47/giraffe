const { Router } = require('express');
const pool = require('../db/pool');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = Router();

// GET /brands — Público
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, logo_url AS "logoUrl", pais, created_at AS "createdAt" FROM marcas ORDER BY nombre'
    );
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

// GET /brands/:id — Público
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, logo_url AS "logoUrl", pais, created_at AS "createdAt" FROM marcas WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ statusCode: 404, error: 'Not Found', message: 'Marca no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

// POST /brands — Admin
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { nombre, logoUrl, pais } = req.body;
    if (!nombre) {
      return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: 'Nombre es requerido' });
    }
    const result = await pool.query(
      `INSERT INTO marcas (nombre, logo_url, pais) VALUES ($1, $2, $3)
       RETURNING id, nombre, logo_url AS "logoUrl", pais, created_at AS "createdAt"`,
      [nombre, logoUrl || null, pais || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ statusCode: 409, error: 'Conflict', message: 'La marca ya existe' });
    }
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

// PUT /brands/:id — Admin
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { nombre, logoUrl, pais } = req.body;
    const result = await pool.query(
      `UPDATE marcas SET
        nombre = COALESCE($1, nombre),
        logo_url = COALESCE($2, logo_url),
        pais = COALESCE($3, pais)
       WHERE id = $4
       RETURNING id, nombre, logo_url AS "logoUrl", pais, created_at AS "createdAt"`,
      [nombre, logoUrl, pais, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ statusCode: 404, error: 'Not Found', message: 'Marca no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

// DELETE /brands/:id — Admin
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM marcas WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ statusCode: 404, error: 'Not Found', message: 'Marca no encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;
