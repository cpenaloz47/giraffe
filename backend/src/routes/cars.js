const { Router } = require('express');
const pool = require('../db/pool');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = Router();

// GET /cars — Público con filtros y paginación
router.get('/', async (req, res) => {
  try {
    const {
      page = 1, limit = 12,
      brandId, categoryId,
      minPrice, maxPrice,
      minYear, maxYear,
      color, status, featured,
      search, sortBy = 'created_at', sortOrder = 'desc',
    } = req.query;

    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let paramIdx = 1;

    if (brandId)    { conditions.push(`a.marca_id = $${paramIdx++}`);     params.push(brandId); }
    if (categoryId) { conditions.push(`a.categoria_id = $${paramIdx++}`); params.push(categoryId); }
    if (minPrice)   { conditions.push(`a.precio >= $${paramIdx++}`);      params.push(minPrice); }
    if (maxPrice)   { conditions.push(`a.precio <= $${paramIdx++}`);      params.push(maxPrice); }
    if (minYear)    { conditions.push(`a.anio >= $${paramIdx++}`);        params.push(minYear); }
    if (maxYear)    { conditions.push(`a.anio <= $${paramIdx++}`);        params.push(maxYear); }
    if (color)      { conditions.push(`a.color ILIKE $${paramIdx++}`);    params.push(`%${color}%`); }
    if (status)     { conditions.push(`a.estado = $${paramIdx++}`);       params.push(status); }
    if (featured)   { conditions.push(`a.destacado = $${paramIdx++}`);    params.push(featured === 'true'); }
    if (search)     { conditions.push(`a.modelo ILIKE $${paramIdx++}`);   params.push(`%${search}%`); }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSort = ['precio', 'anio', 'created_at', 'modelo'];
    const sortField = allowedSort.includes(sortBy) ? `a.${sortBy}` : 'a.created_at';
    const order = sortOrder === 'asc' ? 'ASC' : 'DESC';

    // Count total
    const countResult = await pool.query(`SELECT COUNT(*) FROM autos a ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count);

    // Fetch data
    const dataQuery = `
      SELECT
        a.id, a.modelo, a.anio, a.precio, a.color, a.estado, a.destacado,
        json_build_object('id', m.id, 'nombre', m.nombre) AS marca,
        json_build_object('id', c.id, 'nombre', c.nombre) AS categoria,
        (SELECT url FROM imagenes WHERE auto_id = a.id AND es_portada = true LIMIT 1) AS "imagenPortada",
        COALESCE(AVG(r.calificacion), 0) AS "promedioResenas",
        COUNT(r.id) AS "totalResenas"
      FROM autos a
      JOIN marcas m ON a.marca_id = m.id
      JOIN categorias c ON a.categoria_id = c.id
      LEFT JOIN resenas r ON r.auto_id = a.id
      ${whereClause}
      GROUP BY a.id, m.id, c.id
      ORDER BY ${sortField} ${order}
      LIMIT $${paramIdx++} OFFSET $${paramIdx++}
    `;
    params.push(limit, offset);

    const result = await pool.query(dataQuery, params);

    res.json({
      data: result.rows,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
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
        a.*,
        json_build_object('id', m.id, 'nombre', m.nombre, 'logoUrl', m.logo_url, 'pais', m.pais) AS marca,
        json_build_object('id', c.id, 'nombre', c.nombre) AS categoria
       FROM autos a
       JOIN marcas m ON a.marca_id = m.id
       JOIN categorias c ON a.categoria_id = c.id
       WHERE a.id = $1`,
      [req.params.id]
    );

    if (autoResult.rows.length === 0) {
      return res.status(404).json({ statusCode: 404, error: 'Not Found', message: 'Auto no encontrado' });
    }

    const auto = autoResult.rows[0];

    // Imágenes
    const imgResult = await pool.query(
      'SELECT id, url, orden, es_portada AS "esPortada" FROM imagenes WHERE auto_id = $1 ORDER BY orden',
      [req.params.id]
    );

    // Resumen reseñas
    const revResult = await pool.query(
      'SELECT COALESCE(AVG(calificacion), 0) AS promedio, COUNT(*) AS total FROM resenas WHERE auto_id = $1',
      [req.params.id]
    );

    res.json({
      ...auto,
      imagenes: imgResult.rows,
      resenas: {
        promedio: parseFloat(revResult.rows[0].promedio),
        total: parseInt(revResult.rows[0].total),
      },
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
      color, motor, caballosFuerza, transmision,
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
      `INSERT INTO autos (marca_id, categoria_id, modelo, anio, precio, color, motor, caballos_fuerza, transmision, kilometraje, descripcion, estado, destacado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [marcaId, categoriaId, modelo, anio, precio, color, motor, caballosFuerza, transmision, kilometraje || 0, descripcion, estado || 'AVAILABLE', destacado || false]
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
      anio: 'anio', precio: 'precio', color: 'color', motor: 'motor',
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
