-- ============================================
-- GIRAFFE MOTORS — Esquema de base de datos
-- ============================================

-- Crear base de datos
CREATE DATABASE giraffe_db;

-- Usar la base de datos
\c giraffe_db;

-- Tabla de usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  rol VARCHAR(20) DEFAULT 'USER' CHECK (rol IN ('USER', 'ADMIN')),
  activo BOOLEAN DEFAULT TRUE,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de contactos
CREATE TABLE contactos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  motivo VARCHAR(50) NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de marcas
CREATE TABLE marcas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de autos
CREATE TABLE autos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  año INTEGER NOT NULL,
  precio DECIMAL(12,2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'usado')),
  tipo_carroceria VARCHAR(50) NOT NULL,
  kilometraje INTEGER DEFAULT 0,
  transmision VARCHAR(20) NOT NULL,
  combustible VARCHAR(20) NOT NULL,
  descripcion TEXT,
  imagen_url VARCHAR(500),
  galeria JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor rendimiento
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_contactos_created_at ON contactos(created_at);
CREATE INDEX idx_autos_marca ON autos(marca);
CREATE INDEX idx_autos_precio ON autos(precio);

-- Insertar datos de ejemplo
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
('Admin User', 'admin@giraffe.com', '$2a$10$example.hash.here', 'ADMIN'),
('Test User', 'test@giraffe.com', '$2a$10$example.hash.here', 'USER');

INSERT INTO marcas (nombre, descripcion) VALUES
('Mercedes-AMG', 'Autos de lujo alemanes'),
('BMW', 'Bavarian Motor Works'),
('Porsche', 'Deportivos icónicos'),
('Aston Martin', 'Elegancia británica'),
('Lamborghini', 'Superdeportivos italianos'),
('Bentley', 'Lujo británico'),
('Ferrari', 'Leyenda italiana'),
('Maserati', 'Elegancia italiana');

-- Insertar algunos autos de ejemplo
INSERT INTO autos (marca, modelo, año, precio, estado, tipo_carroceria, kilometraje, transmision, combustible, descripcion) VALUES
('Mercedes-AMG', 'SL 63 Roadster', 2024, 288900, 'nuevo', 'Convertible', 0, 'Automática', 'Gasolina', 'El Mercedes-AMG SL 63 Roadster combina potencia V8 con elegancia descapotable.'),
('BMW', 'Z4 M40i Roadster', 2023, 96200, 'nuevo', 'Convertible', 0, 'Automática', 'Gasolina', 'BMW Z4 con motor turbo y capota retráctil.'),
('Porsche', '911 Carrera 4 Cabriolet', 2022, 159900, 'usado', 'Convertible', 8200, 'Automática', 'Gasolina', 'Porsche 911 descapotable con tracción integral.');