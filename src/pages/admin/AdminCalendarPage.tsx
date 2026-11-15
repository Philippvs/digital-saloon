import type * as React from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'

import { formatViennaDate, formatViennaTime } from '../../data/dateFormat'
import { reservationStatusColor, reservationStatusLabel } from '../../data/reservationStatus'
import type { ReservationWithId } from '../../data/reservations'

export type AdminCalendarView = 'day' | 'week'

export type AdminCalendarPageProps = {
  view: AdminCalendarView
  anchorDateYmd: string
  rangeLabel: string
  reservations: ReservationWithId[] | undefined
  isLoading: boolean
  isError: boolean
  onViewChange: (view: AdminCalendarView) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onSelectReservation: (reservationId: string) => void
  onManualClick: () => void
  onReservationsClick: () => void
}

export const AdminCalendarPage: React.FunctionComponent<AdminCalendarPageProps> = ({
  view,
  anchorDateYmd,
  rangeLabel,
  reservations,
  isLoading,
  isError,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onSelectReservation,
  onManualClick,
  onReservationsClick,
}) => {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Kalender
        </Typography>
        <Typography color="text.secondary">{rangeLabel}</Typography>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <ToggleButtonGroup
            exclusive
            size="small"
            value={view}
            onChange={(_event, next) => {
              if (next === 'day' || next === 'week') onViewChange(next)
            }}
          >
            <ToggleButton value="day">Tag</ToggleButton>
            <ToggleButton value="week">Woche</ToggleButton>
          </ToggleButtonGroup>
          <Button onClick={onPrev}>Zurück</Button>
          <Button onClick={onToday}>Heute</Button>
          <Button onClick={onNext}>Weiter</Button>
          <Button variant="contained" onClick={onManualClick}>
            Manueller Termin
          </Button>
          <Button variant="outlined" onClick={onReservationsClick}>
            Alle Termine
          </Button>
        </Box>
      </Paper>

      {isLoading ? <CircularProgress aria-label="Kalender laden" /> : null}
      {isError ? <Alert severity="error">Termine konnten nicht geladen werden.</Alert> : null}

      <Stack spacing={1}>
        {reservations?.length === 0 ? (
          <Alert severity="info">Keine Termine in diesem Zeitraum.</Alert>
        ) : null}
        {reservations?.map((reservation) => (
          <Paper
            key={reservation.id}
            sx={{ p: 2, cursor: 'pointer' }}
            onClick={() => onSelectReservation(reservation.id)}
            component="button"
            type="button"
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                gap: 1,
                textAlign: 'left',
                width: '100%',
              }}
            >
              <Stack spacing={0.5}>
                <Typography sx={{ fontWeight: 600 }}>
                  {formatViennaTime(reservation.startAt)}–{formatViennaTime(reservation.endAt)} ·{' '}
                  {reservation.serviceName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reservation.firstName} {reservation.lastName} ·{' '}
                  {formatViennaDate(reservation.startAt)} · {reservation.source}
                </Typography>
              </Stack>
              <Chip
                size="small"
                color={reservationStatusColor[reservation.status] ?? 'default'}
                label={reservationStatusLabel[reservation.status] ?? reservation.status}
              />
            </Box>
          </Paper>
        ))}
      </Stack>

      <Typography variant="caption" color="text.secondary">
        Ankerdatum: {anchorDateYmd}
      </Typography>
    </Stack>
  )
}
