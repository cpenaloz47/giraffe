const { Router } = require('express');
const pool = require('../db/pool');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = Router();

// GET /cars — Público con filtros y paginación
router.get('/', async (req, res) => {
  try {
    const {
      page = 1, limit = 12,
      marca, modelo, tipo, transmision, combustible,
      minPrice, maxPrice,
      minYear, maxYear,
      estado,
      sortBy = 'created_at', sortOrder = 'desc',
    } = req.query;

    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let paramIdx = 1;

    if (marca) { conditions.push(`a.marca ILIKE $${paramIdx++}`); params.push(marca); }
    if (modelo) { conditions.push(`a.modelo ILIKE $${paramIdx++}`); params.push(modelo); }
    if (tipo) { conditions.push(`a.tipo_carroceria ILIKE $${paramIdx++}`); params.push(tipo); }
    if (transmision) { conditions.push(`a.transmision ILIKE $${paramIdx++}`); params.push(transmision); }
    if (combustible) { conditions.push(`a.combustible ILIKE $${paramIdx++}`); params.push(combustible); }
    if (minPrice) { conditions.push(`a.precio >= $${paramIdx++}`); params.push(minPrice); }
    if (maxPrice) { conditions.push(`a.precio <= $${paramIdx++}`); params.push(maxPrice); }
    if (minYear) { conditions.push(`a."a¤o" >= $${paramIdx++}`); params.push(minYear); }
    if (maxYear) { conditions.push(`a."a¤o" <= $${paramIdx++}`); params.push(maxYear); }
    if (estado) { conditions.push(`a.estado = $${paramIdx++}`); params.push(estado); }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const allowedSort = ['precio', 'año', 'created_at', 'modelo'];
    const sortField = allowedSort.includes(sortBy) ? (sortBy === 'año' ? 'a."a¤o"' : `a.${sortBy}`) : 'a.created_at';
    const order = sortOrder === 'asc' ? 'ASC' : 'DESC';

    const countResult = await pool.query(`SELECT COUNT(*) FROM autos a ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count, 10);

    const dataQuery = `
      SELECT
        a.id, a.marca, a.modelo, a."a¤o" AS "anio", a.precio, a.estado, a.tipo_carroceria AS "tipoCarroceria",
        a.transmision, a.combustible, a.kilometraje, a.descripcion,
        a.imagen_url AS "imagenPortada",
        a.galeria
      FROM autos a
      ${whereClause}
      ORDER BY ${sortField} ${order}
      LIMIT $${paramIdx++} OFFSET $${paramIdx++}
    `;
    params.push(limit, offset);

    const result = await pool.query(dataQuery, params);

    res.json({
      data: result.rows,
      meta: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Error listando autos:', err.message);
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

// GET /cars/:id — Público, detalle completo
router.get('/:id', async (req, res) => {
  try {
    const autoResult = await pool.query(
      `SELECT
        id, marca, modelo, "a¤o" AS "anio", precio, estado, tipo_carroceria AS "tipoCarroceria",
        transmision, combustible, kilometraje, descripcion, imagen_url AS "imagenPortada",
        galeria
       FROM autos
       WHERE id = $1`,
      [req.params.id]
    );

    if (autoResult.rows.length === 0) {
      return res.status(404).json({ statusCode: 404, error: 'Not Found', message: 'Auto no encontrado' });
    }

    const auto = autoResult.rows[0];

    res.json({
      ...auto,
      imagenes: auto.galeria || [],
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

// POST /cars — Admin
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const {
      marcaId, categoriaId, modelo, anio, precio,
      motor, caballosFuerza, transmision,
      kilometraje, descripcion, estado, destacado,
    } = req.body;

    if (!marcaId || !categoriaId || !modelo || !anio || !precio) {
      return res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'marcaId, categoriaId, modelo, anio y precio son requeridos',
      });
    }

    const result = await pool.query(
      `INSERT INTO autos (marca_id, categoria_id, modelo, "a¤o", precio, motor, caballos_fuerza, transmision, kilometraje, descripcion, estado, destacado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [marcaId, categoriaId, modelo, anio, precio, motor, caballosFuerza, transmision, kilometraje || 0, descripcion, estado || 'AVAILABLE', destacado || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

// PUT /cars/:id — Admin
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const fields = req.body;
    const sets = [];
    const params = [];
    let idx = 1;

    const fieldMap = {
      marcaId: 'marca_id', categoriaId: 'categoria_id', modelo: 'modelo',
      anio: '"a¤o"', precio: 'precio', motor: 'motor',
      caballosFuerza: 'caballos_fuerza', transmision: 'transmision',
      kilometraje: 'kilometraje', descripcion: 'descripcion',
      estado: 'estado', destacado: 'destacado',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (fields[key] !== undefined) {
        sets.push(`${col} = $${idx++}`);
        params.push(fields[key]);
      }
    }

    if (sets.length === 0) {
      return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: 'No hay campos para actualizar' });
    }

    params.push(req.params.id);
    const result = await pool.query(
      `UPDATE autos SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ statusCode: 404, error: 'Not Found', message: 'Auto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

// DELETE /cars/:id — Admin
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM autos WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ statusCode: 404, error: 'Not Found', message: 'Auto no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;
