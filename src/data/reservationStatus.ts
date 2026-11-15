export const reservationStatusLabel: Record<string, string> = {
  PENDING: 'Ausstehend',
  CONFIRMED: 'Bestätigt',
  DECLINED: 'Abgelehnt',
  CANCELLED: 'Storniert',
  COMPLETED: 'Erledigt',
}

export const reservationStatusColor: Record<
  string,
  'warning' | 'success' | 'error' | 'default' | 'info'
> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  DECLINED: 'error',
  CANCELLED: 'default',
  COMPLETED: 'info',
}
