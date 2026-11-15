import type * as React from 'react'
import { Alert, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'

import type { PublicReservation } from '../data/bookingApi'
import { formatViennaDateTime } from '../data/dateFormat'
import { reservationStatusLabel } from '../data/reservationStatus'

export type MyBookingsPageProps = {
  isEmpty: boolean
  actionHint: string | null
  onBookClick: () => void
  onHomeClick: () => void
  children: React.ReactNode
}

export const MyBookingsPage: React.FunctionComponent<MyBookingsPageProps> = ({
  isEmpty,
  actionHint,
  onBookClick,
  onHomeClick,
  children,
}) => {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Meine Termine
        </Typography>
        <Typography color="text.secondary">
          Auf diesem Gerät gespeicherte Verwaltungs-Links. Details werden sicher vom Server geladen.
        </Typography>
      </Paper>

      {actionHint ? <Alert severity="success">{actionHint}</Alert> : null}

      {isEmpty ? (
        <Alert severity="info">
          Noch keine Termine auf diesem Gerät. Nach einer Buchung erscheint der Link hier
          automatisch.
        </Alert>
      ) : null}

      {children}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Button variant="contained" onClick={onBookClick}>
          Neuen Termin buchen
        </Button>
        <Button onClick={onHomeClick}>Zur Startseite</Button>
      </Stack>
    </Stack>
  )
}

export type SavedBookingCardProps = {
  reservation: PublicReservation | undefined
  isLoading: boolean
  isError: boolean
  onOpenManage: () => void
  onRemove: () => void
  onCopyLink: () => void
  onShareLink: () => void
  onMailtoLink: () => void
}

export const SavedBookingCard: React.FunctionComponent<SavedBookingCardProps> = ({
  reservation,
  isLoading,
  isError,
  onOpenManage,
  onRemove,
  onCopyLink,
  onShareLink,
  onMailtoLink,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      {isLoading ? <CircularProgress aria-label="Termin laden" size={28} /> : null}
      {isError ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Link ungültig oder Termin nicht mehr verfügbar (abgelaufen, storniert oder gelöscht).
        </Alert>
      ) : null}
      {reservation ? (
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 600 }}>{reservation.serviceName}</Typography>
          <Typography>{formatViennaDateTime(reservation.startAt)}</Typography>
          <Typography variant="body2" color="text.secondary">
            Status: {reservationStatusLabel[reservation.status] ?? reservation.status}
          </Typography>
        </Stack>
      ) : null}

      <Stack spacing={1}>
        <Button variant="contained" onClick={onOpenManage}>
          Termin öffnen
        </Button>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="outlined" onClick={onCopyLink}>
            Link kopieren
          </Button>
          <Button variant="outlined" onClick={onShareLink}>
            Teilen
          </Button>
          <Button variant="outlined" onClick={onMailtoLink}>
            Per E-Mail senden
          </Button>
        </Stack>
        <Button color="inherit" onClick={onRemove}>
          Von diesem Gerät entfernen
        </Button>
      </Stack>
    </Paper>
  )
}
