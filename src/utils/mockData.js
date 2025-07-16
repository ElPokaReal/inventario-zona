export const mockUsers = [
  {
    id: '1',
    username: 'admin',
    name: 'Administrador Sistema',
    email: 'admin@empresa.com',
    role: 'admin',
    department: 'Soporte Técnico',
    position: 'Administrador de Sistema',
    phone: '+1234567890',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '2',
    username: 'manager',
    name: 'Supervisor Técnico',
    email: 'supervisor@empresa.com',
    role: 'manager',
    department: 'Soporte Técnico',
    position: 'Supervisor de Soporte',
    phone: '+1234567891',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    id: '3',
    username: 'user',
    name: 'Técnico Soporte',
    email: 'tecnico@empresa.com',
    role: 'user',
    department: 'Soporte Técnico',
    position: 'Técnico de Soporte',
    phone: '+1234567892',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  }
];

export const mockAreas = [
  {
    id: '1',
    name: 'Administración',
    description: 'Área administrativa principal',
    code: 'ADM',
    responsible: 'María González',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Contabilidad',
    description: 'Departamento de contabilidad',
    code: 'CONT',
    responsible: 'Carlos Ruiz',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Recursos Humanos',
    description: 'Departamento de recursos humanos',
    code: 'RRHH',
    responsible: 'Ana López',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Soporte Técnico',
    description: 'Área de soporte técnico y sistemas',
    code: 'TECH',
    responsible: 'Luis Martínez',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Almacén',
    description: 'Almacén general de equipos',
    code: 'ALM',
    responsible: 'Pedro Sánchez',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockCategories = [
  {
    id: '1',
    name: 'Computadoras',
    description: 'Equipos de cómputo desktop y laptop',
    code: 'COMP',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Periféricos',
    description: 'Dispositivos periféricos (mouse, teclado, monitor)',
    code: 'PERI',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Accesorios',
    description: 'Cables, adaptadores y accesorios varios',
    code: 'ACC',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Equipos de Red',
    description: 'Switches, routers, access points',
    code: 'NET',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Impresoras',
    description: 'Impresoras y equipos de impresión',
    code: 'PRINT',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockEquipment = [
  {
    id: '1',
    inventoryCode: 'COMP-001',
    type: 'computer',
    brand: 'Dell',
    model: 'OptiPlex 7090',
    serialNumber: 'DL7090001',
    status: 'active',
    currentLocation: 'Administración',
    assignedTo: 'María González',
    purchaseDate: '2024-01-15',
    warrantyExpiration: '2027-01-15',
    value: 850,
    description: 'Computadora de escritorio Dell OptiPlex con procesador Intel i5',
    specifications: {
      'Procesador': 'Intel Core i5-11500',
      'RAM': '16GB DDR4',
      'Almacenamiento': '512GB SSD',
      'Sistema Operativo': 'Windows 11 Pro'
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    inventoryCode: 'COMP-002',
    type: 'computer',
    brand: 'HP',
    model: 'EliteBook 840',
    serialNumber: 'HP840002',
    status: 'maintenance',
    currentLocation: 'Soporte Técnico',
    purchaseDate: '2024-02-01',
    warrantyExpiration: '2027-02-01',
    value: 1200,
    description: 'Laptop HP EliteBook para trabajo móvil',
    specifications: {
      'Procesador': 'Intel Core i7-1165G7',
      'RAM': '16GB DDR4',
      'Almacenamiento': '1TB SSD',
      'Pantalla': '14" Full HD'
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  }
];

export const mockProducts = [
  {
    id: '1',
    code: 'MOUSE-001',
    name: 'Mouse Óptico USB',
    description: 'Mouse óptico USB estándar para oficina, ergonómico con scroll',
    categoryId: '2',
    serialNumber: 'MOU001-MOU050',
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    location: 'Almacén - Estante A1',
    status: 'available',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    code: 'CABLE-001',
    name: 'Cable HDMI 2m',
    description: 'Cable HDMI de 2 metros para conexión de monitores y proyectores',
    categoryId: '3',
    currentStock: 5,
    minStock: 15,
    maxStock: 40,
    location: 'Almacén - Estante B2',
    status: 'available',
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    code: 'TECLADO-001',
    name: 'Teclado USB Español',
    description: 'Teclado USB con distribución española, resistente a salpicaduras',
    categoryId: '2',
    serialNumber: 'TEC001-TEC030',
    currentStock: 18,
    minStock: 8,
    maxStock: 35,
    location: 'Almacén - Estante A2',
    status: 'available',
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '4',
    code: 'MONITOR-001',
    name: 'Monitor LED 24"',
    description: 'Monitor LED de 24 pulgadas, resolución Full HD 1920x1080',
    categoryId: '2',
    serialNumber: 'MON001-MON015',
    currentStock: 12,
    minStock: 5,
    maxStock: 20,
    location: 'Almacén - Estante C1',
    status: 'available',
    isActive: true,
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  },
  {
    id: '5',
    code: 'SWITCH-001',
    name: 'Switch 8 Puertos',
    description: 'Switch de red de 8 puertos Gigabit Ethernet',
    categoryId: '4',
    serialNumber: 'SW8001',
    currentStock: 0,
    minStock: 3,
    maxStock: 10,
    location: 'Almacén - Estante D1',
    status: 'available',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '6',
    code: 'PRINT-001',
    name: 'Cartucho Tinta Negro HP',
    description: 'Cartucho de tinta negra compatible con impresoras HP LaserJet',
    categoryId: '5',
    currentStock: 8,
    minStock: 5,
    maxStock: 25,
    location: 'Almacén - Estante E1',
    status: 'available',
    isActive: true,
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z'
  }
];

export const mockMovements = [
  {
    id: '1',
    productId: '1',
    type: 'assignment',
    quantity: 5,
    previousStock: 30,
    newStock: 25,
    reason: 'Asignación a nuevos equipos',
    reference: 'ASG-2024-001',
    userId: '2',
    fromLocation: 'Almacén - Estante A1',
    toLocation: 'Administración',
    assignedTo: 'María González',
    receivedBy: 'María González',
    equipmentAssigned: 'COMP-001, COMP-003, COMP-005',
    notes: 'Entrega de mouse para nuevas estaciones de trabajo',
    createdAt: '2024-02-15T10:30:00Z'
  },
  {
    id: '2',
    productId: '2',
    type: 'exit',
    quantity: 10,
    previousStock: 15,
    newStock: 5,
    reason: 'Instalación de proyectores',
    reference: 'INST-2024-002',
    userId: '3',
    fromLocation: 'Almacén - Estante B2',
    toLocation: 'Salas de Reunión',
    assignedTo: 'Luis Martínez',
    receivedBy: 'Ana López',
    notes: 'Cables para instalación de sistema audiovisual',
    createdAt: '2024-02-14T14:15:00Z'
  },
  {
    id: '3',
    productId: '3',
    type: 'return',
    quantity: 2,
    previousStock: 16,
    newStock: 18,
    reason: 'Devolución por cambio de equipo',
    reference: 'RET-2024-001',
    userId: '1',
    fromLocation: 'Contabilidad',
    toLocation: 'Almacén - Estante A2',
    assignedTo: 'Carlos Ruiz',
    receivedBy: 'Pedro Sánchez',
    notes: 'Teclados en buen estado, listos para reasignación',
    createdAt: '2024-02-13T09:45:00Z'
  },
  {
    id: '4',
    productId: '4',
    type: 'maintenance',
    quantity: 3,
    previousStock: 15,
    newStock: 12,
    reason: 'Mantenimiento preventivo',
    reference: 'MANT-2024-001',
    userId: '2',
    fromLocation: 'Almacén - Estante C1',
    toLocation: 'Soporte Técnico',
    assignedTo: 'Luis Martínez',
    receivedBy: 'Luis Martínez',
    notes: 'Monitores para limpieza y calibración',
    createdAt: '2024-02-12T11:20:00Z'
  },
  {
    id: '5',
    productId: '6',
    type: 'entry',
    quantity: 15,
    previousStock: 3,
    newStock: 18,
    reason: 'Compra de suministros',
    reference: 'COMP-2024-003',
    userId: '1',
    toLocation: 'Almacén - Estante E1',
    receivedBy: 'Pedro Sánchez',
    notes: 'Reposición de cartuchos para impresoras del área administrativa',
    createdAt: '2024-02-10T16:00:00Z'
  }
];