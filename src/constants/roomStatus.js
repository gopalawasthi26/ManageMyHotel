export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  NEEDS_CLEANING: 'needs_cleaning',
  BOOKED: 'booked'
};

export const ROOM_STATUS_COLORS = {
  [ROOM_STATUS.AVAILABLE]: 'success',
  [ROOM_STATUS.OCCUPIED]: 'warning',
  [ROOM_STATUS.MAINTENANCE]: 'error',
  [ROOM_STATUS.NEEDS_CLEANING]: 'info',
  [ROOM_STATUS.BOOKED]: 'primary'
};

export const ROOM_STATUS_LABELS = {
  [ROOM_STATUS.AVAILABLE]: 'Available',
  [ROOM_STATUS.OCCUPIED]: 'Occupied',
  [ROOM_STATUS.MAINTENANCE]: 'Maintenance',
  [ROOM_STATUS.NEEDS_CLEANING]: 'Needs Cleaning',
  [ROOM_STATUS.BOOKED]: 'Booked'
}; 