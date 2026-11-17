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
import { reservationStatusColor } from '../../data/reservationStatus'
import type { ReservationWithId } from '../../data/reservations'
import { useLocale } from '../../i18n'
import type { MessageKey } from '../../i18n'

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
  const { t, intlLocale } = useLocale()
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          {t('admin.reservations')}
        </Typography>
        <Button onClick={onCalendarClick}>{t('admin.toCalendar')}</Button>
      </Paper>

      {isLoading ? <CircularProgress aria-label={t('admin.loading')} /> : null}
      {isError ? <Alert severity="error">{t('admin.reservationsError')}</Alert> : null}

      {reservations && reservations.length === 0 ? (
        <Alert severity="info">{t('admin.noReservations')}</Alert>
      ) : null}

      {reservations && reservations.length > 0 ? (
        <Paper sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.time')}</TableCell>
                <TableCell>{t('admin.customer')}</TableCell>
                <TableCell>{t('admin.services')}</TableCell>
                <TableCell>{t('admin.status')}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id} hover>
                  <TableCell>{formatViennaDateTime(reservation.startAt, intlLocale)}</TableCell>
                  <TableCell>
                    {reservation.firstName} {reservation.lastName}
                  </TableCell>
                  <TableCell>{reservation.serviceName}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={reservationStatusColor[reservation.status] ?? 'default'}
                      label={t(`status.${reservation.status}` as MessageKey)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => onSelectReservation(reservation.id)}>
                      {t('admin.open')}
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
