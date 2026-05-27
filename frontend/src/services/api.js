const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000/api/v1';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('giraffe_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error de conexión' }));
    throw error;
  }

  if (res.status === 204) return null;
  return res.json();
}

// ============================================
// AUTENTICACIÓN
// ============================================

export async function registerUser(nombre, email, password, telefono) {
  // No enviar telefono si está vacío
  const body = { nombre, email, password };
  if (telefono && telefono.trim()) {
    body.telefono = telefono;
  }
  
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function loginUser(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshToken(token) {
  return apiRequest('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

// ============================================
// CONTACTO
// ============================================

export async function sendContactMessage(nombre, email, telefono, motivo, mensaje) {
  return apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, telefono, motivo, mensaje }),
  });
}

export async function getContactMessages() {
  return apiRequest('/contact', { method: 'GET' });
}

// ============================================
// CATÁLOGO
// ============================================

export async function getBrands() {
  return apiRequest('/brands', { method: 'GET' });
}

export async function getCars(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  return apiRequest(`/cars${query ? `?${query}` : ''}`, { method: 'GET' });
}

export async function getCarById(id) {
  return apiRequest(`/cars/${id}`, { method: 'GET' });
}

export async function deleteCar(id) {
  return apiRequest(`/cars/${id}`, {
    method: 'DELETE',
  });
}

export async function createCar(carData) {
  return apiRequest('/cars', {
    method: 'POST',
    body: JSON.stringify(carData),
  });
}

export async function createNegociacion(data) {
  return apiRequest('/negociaciones', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createCita(data) {
  return apiRequest('/citas', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
