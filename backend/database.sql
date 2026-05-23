-- ============================================
-- GIRAFFE MOTORS — Esquema completo + datos
-- ============================================
-- Compatible con Render PostgreSQL (sin CREATE DATABASE)
-- Ejecutar directamente sobre la base de datos creada en Render

-- ============================================
-- TABLAS
-- ============================================

CREATE TABLE IF NOT EXISTS usuarios (
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

CREATE TABLE IF NOT EXISTS contactos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  motivo VARCHAR(50) NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marcas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS autos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  "año" INTEGER NOT NULL,
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

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_contactos_created_at ON contactos(created_at);
CREATE INDEX IF NOT EXISTS idx_autos_marca ON autos(marca);
CREATE INDEX IF NOT EXISTS idx_autos_precio ON autos(precio);

-- ============================================
-- USUARIOS
-- Passwords: admin / giraffe2024admin  |  usuario / giraffe2024
-- ============================================

INSERT INTO usuarios (id, nombre, email, password_hash, rol, activo) VALUES
(
  '136fd43a-ed0d-4075-9c7f-6f590d632bc1',
  'USUARIO ADMINISTRADOR',
  'admin@giraffe.com',
  '$2a$10$nxijaEFbWhZgPsAaTyhRIO9GAh4IoiGlud56vwVUWag1iv1RztQ2S',
  'ADMIN',
  true
),
(
  '2af48990-f81c-4145-8c23-53a5746c53f4',
  'CRISTIAN PEÑALOZA',
  'cpenaloz@gmail.com',
  '$2a$10$UHcDm5E3n14DfnhD3tZbk.83AIgxC.ut.ux.ycHH4M.N6iUECEamS',
  'USER',
  true
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- MARCAS
-- ============================================

INSERT INTO marcas (id, nombre, descripcion) VALUES
('dde924e0-477e-4e61-be56-0fd2b4f9c8b0', 'Mercedes-AMG',  'Autos de lujo alemanes'),
('27455b06-dc90-4d12-8b99-b18c1267a3e5', 'BMW',           'Bavarian Motor Works'),
('5756e6df-4469-4373-8e3b-d688944f5b99', 'Porsche',       'Deportivos icónicos'),
('fefebcb0-3690-4669-890f-bac38cfcde23', 'Aston Martin',  'Elegancia británica'),
('03979927-9e30-4004-8b8d-747c5ad8bcab', 'Lamborghini',   'Superdeportivos italianos'),
('f614fcca-9e7b-4a3b-867e-322a0cd289d1', 'Bentley',       'Lujo británico'),
('a480eae4-814b-44e7-bbdc-7398ffb9e18f', 'Ferrari',       'Leyenda italiana'),
('46a10e19-37f2-4d93-8262-d59b0fecc76f', 'Maserati',      'Elegancia italiana')
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- AUTOS
-- ============================================

INSERT INTO autos (id, marca, modelo, "año", precio, estado, tipo_carroceria, kilometraje, transmision, combustible, descripcion, imagen_url, galeria) VALUES
(
  '27ddaac5-af55-4295-8de2-768cc0d04464',
  'Mercedes-AMG', 'SL 63 Roadster', 2024, 288900.00, 'nuevo', 'Convertible', 0,
  'Automática', 'Gasolina',
  'El Mercedes-AMG SL 63 Roadster combina potencia V8 con elegancia descapotable.',
  'MERCEDES_AMG.png', NULL
),
(
  '483f925a-1df1-4617-afeb-52415f4cf00f',
  'BMW', 'Z4 M40i Roadster', 2023, 96200.00, 'nuevo', 'Convertible', 0,
  'Automática', 'Gasolina',
  'BMW Z4 con motor turbo y capota retráctil.',
  'bmwz4.png', NULL
),
(
  '44e8eaef-023e-4b4d-b011-ae1658dbc085',
  'Porsche', '911 Carrera 4 Cabriolet', 2022, 159900.00, 'usado', 'Convertible', 8200,
  'Automática', 'Gasolina',
  'Porsche 911 descapotable con tracción integral.',
  'porschre_911.png', NULL
),
(
  '3f880327-51bf-4a4f-a562-cb310e89dc43',
  'Aston Martin', 'DB12 Volante', 2024, 293500.00, 'nuevo', 'Convertible', 0,
  'Automática', 'Gasolina',
  'El Aston Martin DB12 Volante ofrece una conducción refinada y distintiva, con un techo retráctil suave que realza su presencia elegante y potente.',
  'ASTON_MARTIN.png', '[]'
),
(
  'c7261ec6-2d54-4d09-9c20-2c6ef069632a',
  'Lamborghini', 'Huracán Tecnica Spyder', 2023, 304900.00, 'usado', 'Convertible', 5300,
  'Automática', 'Gasolina',
  'El Lamborghini Huracán Tecnica Spyder es un superdeportivo descapotable que destaca por su potencia explosiva, diseño agresivo y experiencia de conducción pura.',
  'lambo_huracan.png', '[]'
),
(
  '3b7949f2-4112-41ea-8b97-6f358d9c7977',
  'Bentley', 'Continental GT Convertible', 2023, 238900.00, 'nuevo', 'Convertible', 0,
  'Automática', 'Gasolina',
  'El Bentley Continental GT Convertible combina lujo artesanal con un motor poderoso, entregando confort y presencia en cada viaje descapotable.',
  'bentley_conti.png', '[]'
),
(
  '0df7bedd-8000-411d-8b54-4ae047e97041',
  'Ferrari', 'Portofino M', 2024, 292500.00, 'nuevo', 'Convertible', 0,
  'Automática', 'Gasolina',
  'El Ferrari Portofino M es el descapotable deportivo perfecto para quien busca estilo italiano, lujo y respuesta inmediata en cada ruta abierta.',
  'FERRARI_PORTOFINO.png', '[]'
),
(
  'd397b281-485d-4c60-9203-d8d3c1a8c44e',
  'Maserati', 'MC20 Cielo', 2024, 325000.00, 'nuevo', 'Convertible', 0,
  'Automática', 'Gasolina',
  'El Maserati MC20 Cielo ofrece un diseño exclusivo, techo retráctil y una experiencia de conducción exquisita con una personalidad deportiva inconfundible.',
  'MASERATI_MC.png', '[]'
),
(
  'd21c645b-9144-42f7-baf6-fca3f14c4f87',
  'Lamborghini', 'Aventador', 2020, 425921.00, 'usado', 'Convertible', 20000,
  'Automática', 'Gasolina',
  'Dotado de una aerodinámica basada en los aviones de combate, el Lamborghini Aventador SVJ 2019 se ha presentado en Pebble Beach con el título honorífico de ser el modelo de producción más rápido en el circuito de Nürburgring.',
  'lambo_Aventador.png', NULL
)
ON CONFLICT (id) DO NOTHING;
