const jwt = require('jsonwebtoken');

// Verificar token JWT
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token de autenticación requerido',
    });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token inválido o expirado',
    });
  }
};

// Verificar rol ADMIN
const authorizeAdmin = (req, res, next) => {
  if (req.user.rol !== 'ADMIN') {
    return res.status(403).json({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Acceso restringido a administradores',
    });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
