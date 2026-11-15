import type * as React from 'react'
import {
  Alert,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@mui/material'

import { formatViennaDateTime } from '../../data/dateFormat'
import { reservationStatusColor, reservationStatusLabel } from '../../data/reservationStatus'
import type { ReservationWithId } from '../../data/reservations'

export type AdminReservationsPageProps = {
  reservations: ReservationWithId[] | undefined
  isLoading: boolean
  isError: boolean
  onSelectReservation: (reservationId: string) => void
  onCalendarClick: () => void
}

export const AdminReservationsPage: React.FunctionComponent<AdminReservationsPageProps> = ({
  reservations,
  isLoading,
  isError,
  onSelectReservation,
  onCalendarClick,
}) => {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Termine
        </Typography>
        <Button onClick={onCalendarClick}>Zum Kalender</Button>
      </Paper>

      {isLoading ? <CircularProgress aria-label="Termine laden" /> : null}
      {isError ? <Alert severity="error">Termine konnten nicht geladen werden.</Alert> : null}

      {reservations && reservations.length === 0 ? (
        <Alert severity="info">Keine Termine im Zeitraum.</Alert>
      ) : null}

      {reservations && reservations.length > 0 ? (
        <Paper sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Zeit</TableCell>
                <TableCell>Kunde</TableCell>
                <TableCell>Leistung</TableCell>
                <TableCell>Status</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id} hover>
                  <TableCell>{formatViennaDateTime(reservation.startAt)}</TableCell>
                  <TableCell>
                    {reservation.firstName} {reservation.lastName}
                  </TableCell>
                  <TableCell>{reservation.serviceName}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={reservationStatusColor[reservation.status] ?? 'default'}
                      label={reservationStatusLabel[reservation.status] ?? reservation.status}
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => onSelectReservation(reservation.id)}>
                      Öffnen
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : null}
    </Stack>
  )
}
