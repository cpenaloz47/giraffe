const request = require('supertest');
const app = require('../src/index');
const pool = require('../src/db/pool');

describe('API Tests', () => {
  beforeAll(async () => {
    // Limpiar tablas de prueba si es necesario
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          telefono: '+56987654321',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('token');
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'T',
          email: 'invalid-email',
          password: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 409 for existing email', async () => {
      // Primero registrar un usuario
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'Existing User',
          email: 'existing@example.com',
          password: 'password123',
        });

      // Intentar registrar de nuevo
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'Another User',
          email: 'existing@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeAll(async () => {
      // Registrar un usuario para login
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'Login User',
          email: 'login@example.com',
          password: 'password123',
        });
    });

    it('should login successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email',
          password: '',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/contact', () => {
    it('should send contact message successfully', async () => {
      const response = await request(app)
        .post('/api/v1/contact')
        .send({
          nombre: 'Contact User',
          email: 'contact@example.com',
          telefono: '+56987654321',
          motivo: 'compra',
          mensaje: 'Estoy interesado en comprar un auto.',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/contact')
        .send({
          nombre: 'C',
          email: 'invalid-email',
          motivo: 'invalid',
          mensaje: 'Short',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/v1/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });
});