import type * as React from 'react'
import { Alert, Button, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material'

import { formatViennaDateTime } from '../../data/dateFormat'
import { reservationStatusColor, reservationStatusLabel } from '../../data/reservationStatus'
import type { ReservationWithId } from '../../data/reservations'

export type AdminReservationDetailPageProps = {
  reservation: ReservationWithId | undefined
  isLoading: boolean
  actionError: string | null
  busy: boolean
  onBackClick: () => void
  onConfirm: () => void
  onDecline: () => void
  onCancel: () => void
  onComplete: () => void
}

export const AdminReservationDetailPage: React.FunctionComponent<
  AdminReservationDetailPageProps
> = ({
  reservation,
  isLoading,
  actionError,
  busy,
  onBackClick,
  onConfirm,
  onDecline,
  onCancel,
  onComplete,
}) => {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Termin-Details
        </Typography>
        <Button onClick={onBackClick}>Zurück zum Kalender</Button>
      </Paper>

      {isLoading ? <CircularProgress aria-label="Termin laden" /> : null}
      {!isLoading && !reservation ? <Alert severity="error">Termin nicht gefunden.</Alert> : null}

      {reservation ? (
        <Paper sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Chip
              size="small"
              sx={{ alignSelf: 'flex-start' }}
              color={reservationStatusColor[reservation.status] ?? 'default'}
              label={reservationStatusLabel[reservation.status] ?? reservation.status}
            />
            <Typography sx={{ fontWeight: 600 }}>{reservation.serviceName}</Typography>
            <Typography>{formatViennaDateTime(reservation.startAt)}</Typography>
            <Typography>
              {reservation.firstName} {reservation.lastName}
            </Typography>
            <Typography>{reservation.phone}</Typography>
            {reservation.email ? <Typography>{reservation.email}</Typography> : null}
            <Typography variant="body2" color="text.secondary">
              Quelle: {reservation.source}
            </Typography>
            {reservation.internalNote ? (
              <Typography variant="body2">Notiz: {reservation.internalNote}</Typography>
            ) : null}
          </Stack>

          {actionError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          ) : null}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 3 }}>
            {reservation.status === 'PENDING' ? (
              <>
                <Button variant="contained" disabled={busy} onClick={onConfirm}>
                  Bestätigen
                </Button>
                <Button color="error" variant="outlined" disabled={busy} onClick={onDecline}>
                  Ablehnen
                </Button>
              </>
            ) : null}
            {reservation.status === 'CONFIRMED' ? (
              <Button variant="contained" disabled={busy} onClick={onComplete}>
                Als erledigt markieren
              </Button>
            ) : null}
            {reservation.status === 'PENDING' || reservation.status === 'CONFIRMED' ? (
              <Button color="error" disabled={busy} onClick={onCancel}>
                Stornieren
              </Button>
            ) : null}
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  )
}
