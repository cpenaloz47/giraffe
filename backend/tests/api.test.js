const request = require('supertest');
const app = require('../src/index');
const pool = require('../src/db/pool');

const randomId = Date.now();
const testUsers = {
  register: 'test+register.' + randomId + '@example.com',
  existing: 'test+existing.' + randomId + '@example.com',
  login: 'test+login.' + randomId + '@example.com',
};

let firstBrandId;
let firstCarId;

describe('Giraffe Motors Backend API', () => {
  beforeAll(async () => {
    await pool.query('DELETE FROM contactos WHERE email LIKE $1', ['test+%@example.com']);
    await pool.query('DELETE FROM usuarios WHERE email LIKE $1', ['test+%@example.com']);
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('Rutas de autenticación', () => {
    it('registra un usuario nuevo correctamente', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'Test User',
          email: testUsers.register,
          password: 'password123',
          telefono: '+56987654321',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe(testUsers.register);
    });

    it('retorna 400 para datos inválidos de registro', async () => {
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

    it('retorna 409 cuando el email ya existe', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'Existing User',
          email: testUsers.existing,
          password: 'password123',
        });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'Another User',
          email: testUsers.existing,
          password: 'password123',
        });

      expect(response.status).toBe(409);
    });

    it('inicia sesión correctamente con credenciales válidas', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: 'Login User',
          email: testUsers.login,
          password: 'password123',
        });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUsers.login,
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe(testUsers.login);
    });

    it('retorna 401 para credenciales de login inválidas', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUsers.login,
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });

    it('retorna 400 para datos de login inválidos', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email',
          password: '',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Rutas de contacto', () => {
    it('envía un mensaje de contacto correctamente', async () => {
      const response = await request(app)
        .post('/api/v1/contact')
        .send({
          nombre: 'Contact User',
          email: 'test+contact.' + randomId + '@example.com',
          telefono: '+56987654321',
          motivo: 'compra',
          mensaje: 'Estoy interesado en comprar un auto.',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.email).toContain('test+contact.');
    });

    it('retorna 400 para datos de contacto inválidos', async () => {
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

  describe('Endpoints públicos', () => {
    it('retorna el estado de salud', async () => {
      const response = await request(app).get('/api/v1/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });

    it('retorna la lista de marcas', async () => {
      const response = await request(app).get('/api/v1/brands');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      if (response.body.data.length > 0) {
        firstBrandId = response.body.data[0].id;
      }
    });

    it('retorna la lista de autos con metadatos', async () => {
      const response = await request(app).get('/api/v1/cars');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('meta');
      if (response.body.data.length > 0) {
        firstCarId = response.body.data[0].id;
      }
    });

    it('retorna detalles de un auto existente', async () => {
      if (!firstCarId) {
        return;
      }

      const response = await request(app).get(`/api/v1/cars/${firstCarId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', firstCarId);
      expect(response.body).toHaveProperty('marca');
    });

    it('retorna detalles de una marca existente', async () => {
      if (!firstBrandId) {
        return;
      }

      const response = await request(app).get(`/api/v1/brands/${firstBrandId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', firstBrandId);
      expect(response.body).toHaveProperty('nombre');
    });
  });
});
