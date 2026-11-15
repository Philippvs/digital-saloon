import type * as React from 'react'
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'

import type { AvailableSlotDto, PublicReservation } from '../data/bookingApi'
import { formatViennaDateTime, formatViennaTime } from '../data/dateFormat'

export type ManageReservationPageProps = {
  reservation: PublicReservation | undefined
  isLoading: boolean
  isError: boolean
  cancelPending: boolean
  reschedulePending: boolean
  actionError: string | null
  rescheduleSlots: AvailableSlotDto[] | undefined
  rescheduleLoading: boolean
  showReschedule: boolean
  onToggleReschedule: () => void
  onCancel: () => void
  onReschedule: (startAt: string) => void
  onHomeClick: () => void
}

export const ManageReservationPage: React.FunctionComponent<ManageReservationPageProps> = ({
  reservation,
  isLoading,
  isError,
  cancelPending,
  reschedulePending,
  actionError,
  rescheduleSlots,
  rescheduleLoading,
  showReschedule,
  onToggleReschedule,
  onCancel,
  onReschedule,
  onHomeClick,
}) => {
  const canChange = reservation?.status === 'PENDING' || reservation?.status === 'CONFIRMED'

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Termin verwalten
        </Typography>
        <Typography color="text.secondary">Persönlicher Link — kein Login erforderlich.</Typography>
      </Paper>

      {isLoading ? <CircularProgress aria-label="Termin laden" /> : null}
      {isError ? <Alert severity="error">Termin nicht gefunden oder Link ungültig.</Alert> : null}

      {reservation ? (
        <Paper sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 600 }}>{reservation.serviceName}</Typography>
            <Typography>{formatViennaDateTime(reservation.startAt)}</Typography>
            <Typography>
              {reservation.firstName} {reservation.lastName} · {reservation.phone}
            </Typography>
            <Typography>Status: {reservation.status}</Typography>
          </Stack>

          {actionError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          ) : null}

          {canChange ? (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={onToggleReschedule}
                disabled={cancelPending || reschedulePending}
              >
                {showReschedule ? 'Abbrechen' : 'Umbuchen'}
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={onCancel}
                disabled={cancelPending || reschedulePending}
              >
                {cancelPending ? 'Wird storniert…' : 'Stornieren'}
              </Button>
            </Stack>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              Dieser Termin kann nicht mehr geändert werden.
            </Alert>
          )}
        </Paper>
      ) : null}

      {showReschedule && canChange ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h2" sx={{ fontSize: '1.2rem', mb: 2 }}>
            Neue Uhrzeit wählen
          </Typography>
          {rescheduleLoading ? <CircularProgress aria-label="Slots laden" /> : null}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {rescheduleSlots?.map((slot) => (
              <Button
                key={slot.startAt}
                variant="outlined"
                disabled={reschedulePending}
                onClick={() => onReschedule(slot.startAt)}
              >
                {formatViennaTime(slot.startAt)}
              </Button>
            ))}
          </Box>
          {rescheduleSlots && rescheduleSlots.length === 0 ? (
            <Alert severity="info">Keine Alternativen in den nächsten Tagen.</Alert>
          ) : null}
        </Paper>
      ) : null}

      <Button onClick={onHomeClick}>Zur Startseite</Button>
    </Stack>
  )
}
