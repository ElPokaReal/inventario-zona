// Types are now handled as PropTypes or simple object structures
// No TypeScript interfaces needed in JSX

export const UserRoles = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
};

export const ProductStatus = {
  AVAILABLE: 'available',
  IN_USE: 'in_use',
  MAINTENANCE: 'maintenance',
  REPAIR: 'repair',
  RETIRED: 'retired'
};

export const EquipmentTypes = {
  COMPUTER: 'computer',
  PERIPHERAL: 'peripheral',
  ACCESSORY: 'accessory',
  NETWORK: 'network',
  AUDIO_VISUAL: 'audio_visual'
};

export const EquipmentStatus = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  REPAIR: 'repair',
  RETIRED: 'retired',
  LOST: 'lost'
};

export const MovementTypes = {
  ENTRY: 'entry',
  EXIT: 'exit',
  TRANSFER: 'transfer',
  ASSIGNMENT: 'assignment',
  RETURN: 'return',
  MAINTENANCE: 'maintenance'
};

export const AlertTypes = {
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  MAINTENANCE_DUE: 'maintenance_due'
};