// ============================================
// DATOS MOCK — Giraffe Roadster
// ============================================

export const offers = [
  'OFERTA ESPECIAL: POR TIEMPO LIMITADO, TASAS PREFERENCIALES EN VEHÍCULOS SELECCIONADOS.',
  'ENVÍO PREMIUM SIN COSTO EN COMPRAS SUPERIORES A USD $200.000.',
  'TEST DRIVE EXCLUSIVO — AGENDA TU EXPERIENCIA EN CIRCUITO PRIVADO.',
  'NUEVOS MODELOS 2026 DISPONIBLES. DESCUBRE LA COLECCIÓN.',
];

export const brands = [
  { nombre: 'Ferrari', color: '#C41E3A' },
  { nombre: 'Lamborghini', color: '#C2A76E' },
  { nombre: 'McLaren', color: '#FF6600' },
  { nombre: 'Porsche', color: '#44403C' },
  { nombre: 'Aston Martin', color: '#1B5E3B' },
  { nombre: 'Bentley', color: '#44403C' },
  { nombre: 'Mercedes-AMG', color: '#44403C' },
  { nombre: 'BMW', color: '#0066B1' },
  { nombre: 'Maserati', color: '#00308F' },
  { nombre: 'Rolls-Royce', color: '#44403C' },
];

export const ciudades = [
  { value: 'santiago', label: 'Santiago' },
  { value: 'valparaiso', label: 'Valparaíso' },
  { value: 'concepcion', label: 'Concepción' },
  { value: 'antofagasta', label: 'Antofagasta' },
  { value: 'temuco', label: 'Temuco' },
  { value: 'vina-del-mar', label: 'Viña del Mar' },
  { value: 'la-serena', label: 'La Serena' },
  { value: 'rancagua', label: 'Rancagua' },
  { value: 'otra', label: 'Otra' },
];

export const motivosContacto = [
  { value: 'compra', label: 'Información de compra' },
  { value: 'test-drive', label: 'Agendar Test Drive' },
  { value: 'financiamiento', label: 'Consulta de financiamiento' },
  { value: 'servicio-tecnico', label: 'Servicio técnico' },
  { value: 'personalizacion', label: 'Personalización de vehículo' },
  { value: 'seguros', label: 'Seguros' },
  { value: 'reclamo', label: 'Reclamo o sugerencia' },
  { value: 'otro', label: 'Otro' },
];

export const contactInfo = {
  horario: ['Lunes a Viernes: 9:00 a.m. - 6:00 p.m.', 'Sábados: 9:00 a.m. - 2:00 p.m.'],
  telefonos: ['+56 2 2345 6789', '+56 9 8765 4321'],
  emails: ['info@girafferoaster.com', 'ventas@girafferoaster.com'],
};

export const autos = [
  {
    id: 1,
    marca: 'Mercedes-AMG',
    modelo: 'SL 63 Roadster',
    año: 2024,
    precio: 288900,
    estado: 'nuevo',
    tipoCarroceria: 'Convertible',
    kilometraje: 0,
    transmision: 'Automática',
    combustible: 'Gasolina',
    imagen: '/autos/MERCEDES_AMG.png',
    descripcion: 'El Mercedes-AMG SL 63 Roadster ofrece una mezcla sublime de potencia V8 y refinamiento descapotable, con acabados interiores de lujo y tecnología avanzada.',
    galeria: [
      '/autos/mercedes_sl_front.png',
      '/autos/mercedes_sl_side.png',
      '/autos/mercedes_sl_rear.png',
    ],
  },
  {
    id: 2,
    marca: 'BMW',
    modelo: 'Z4 M40i Roadster',
    año: 2023,
    precio: 96200,
    estado: 'nuevo',
    tipoCarroceria: 'Convertible',
    kilometraje: 0,
    transmision: 'Automática',
    combustible: 'Gasolina',
    imagen: '/autos/bmwz4.png',
    descripcion: 'El BMW Z4 M40i Roadster fusiona deportividad y elegancia con su capota retráctil, chasis ágil y un motor turbo capaz de entregar un manejo emocionante.',
    galeria: [
      '/autos/bmw_z4_front.png',
      '/autos/bmw_z4_interior.png',
      '/autos/bmw_z4_rear.png',
    ],
  },
  {
    id: 3,
    marca: 'Porsche',
    modelo: '911 Carrera 4 Cabriolet',
    año: 2022,
    precio: 159900,
    estado: 'usado',
    tipoCarroceria: 'Convertible',
    kilometraje: 8200,
    transmision: 'Automática',
    combustible: 'Gasolina',
    imagen: '/autos/porschre_911.png',
    descripcion: 'El Porsche 911 Carrera 4 Cabriolet combina estilo icónico con tracción integral y una experiencia descapotable excepcional para rutas de alta velocidad.',
    galeria: [
      '/autos/porsche_911_front.png',
      '/autos/porsche_911_side.png',
      '/autos/porsche_911_rear.png',
    ],
  },
  {
    id: 4,
    marca: 'Aston Martin',
    modelo: 'DB12 Volante',
    año: 2024,
    precio: 293500,
    estado: 'nuevo',
    tipoCarroceria: 'Convertible',
    kilometraje: 0,
    transmision: 'Automática',
    combustible: 'Gasolina',
    imagen: '/autos/ASTON_MARTIN.png',
    descripcion: 'El Aston Martin DB12 Volante ofrece una conducción refinada y distintiva, con un techo retráctil suave que realza su presencia elegante y potente.',
    galeria: [
      '/autos/aston_db12_front.png',
      '/autos/aston_db12_interior.png',
      '/autos/aston_db12_rear.png',
    ],
  },
  {
    id: 5,
    marca: 'Lamborghini',
    modelo: 'Huracán Tecnica Spyder',
    año: 2023,
    precio: 304900,
    estado: 'usado',
    tipoCarroceria: 'Convertible',
    kilometraje: 5300,
    transmision: 'Automática',
    combustible: 'Gasolina',
    imagen: '/autos/lambo_huracan.png',
    descripcion: 'El Lamborghini Huracán Tecnica Spyder es un superdeportivo descapotable que destaca por su potencia explosiva, diseño agresivo y experiencia de conducción pura.',
    galeria: [
      '/autos/lambo_huracan1.png',
      '/autos/lambo_huracan2.png',
      '/autos/lambo_huracan3.png',
    ],
  },
  {
    id: 6,
    marca: 'Bentley',
    modelo: 'Continental GT Convertible',
    año: 2023,
    precio: 238900,
    estado: 'nuevo',
    tipoCarroceria: 'Convertible',
    kilometraje: 0,
    transmision: 'Automática',
    combustible: 'Gasolina',
    imagen: '/autos/bentley_conti.png',
    descripcion: 'El Bentley Continental GT Convertible combina lujo artesanal con un motor poderoso, entregando confort y presencia en cada viaje descapotable.',
    galeria: [
      '/autos/bentley_conti_front.png',
      '/autos/bentley_conti_interior.png',
      '/autos/bentley_conti_rear.png',
    ],
  },
  {
    id: 7,
    marca: 'Ferrari',
    modelo: 'Portofino M',
    año: 2024,
    precio: 292500,
    estado: 'nuevo',
    tipoCarroceria: 'Convertible',
    kilometraje: 0,
    transmision: 'Automática',
    combustible: 'Gasolina',
    imagen: '/autos/FERRARI_PORTOFINO.png',
    descripcion: 'El Ferrari Portofino M es el descapotable deportivo perfecto para quien busca estilo italiano, lujo y respuesta inmediata en cada ruta abierta.',
    galeria: [
      '/autos/ferrari_portofino_front.png',
      '/autos/ferrari_portofino_side.png',
      '/autos/ferrari_portofino_rear.png',
    ],
  },
  {
    id: 8,
    marca: 'Maserati',
    modelo: 'MC20 Cielo',
    año: 2024,
    precio: 325000,
    estado: 'nuevo',
    tipoCarroceria: 'Convertible',
    kilometraje: 0,
    transmision: 'Automática',
    combustible: 'Gasolina',
    imagen: '/autos/MASERATI_MC.png',
    descripcion: 'El Maserati MC20 Cielo ofrece un diseño exclusivo, techo retráctil y una experiencia de conducción exquisita con una personalidad deportiva inconfundible.',
    galeria: [
      '/autos/maserati_mc20_front.png',
      '/autos/maserati_mc20_side.png',
      '/autos/maserati_mc20_rear.png',
    ],
  },
];

export const marcas = [
  { value: 'todas', label: 'Todas las marcas' },
  ...brands.map((brand) => ({ value: brand.nombre.toLowerCase(), label: brand.nombre })),
];

export const modelos = [
  'Todos los modelos',
  'SL 63 Roadster',
  'Z4 M40i Roadster',
  '911 Carrera 4 Cabriolet',
  'DB12 Volante',
  'Huracán Tecnica Spyder',
  'Continental GT Convertible',
  'Portofino M',
  'MC20 Cielo',
];

export const tiposCarroceria = [
  { value: 'todos', label: 'Todos' },
  { value: 'Convertible', label: 'Convertible' },
  { value: 'Sedán', label: 'Sedán' },
  { value: 'Coupe', label: 'Coupe' },
  { value: 'SUV', label: 'SUV' },
];

export const navLinks = [
  { path: '/catalogo', label: 'CATÁLOGO DE AUTOS' },
  { path: '/servicios', label: 'SERVICIOS' },
  { path: '/financiamiento', label: 'FINANCIAMIENTO' },
  { path: '/contacto', label: 'CONTACTO' },
];
