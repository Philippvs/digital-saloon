import type * as React from 'react'
import { Alert, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'

import type { PublicReservation } from '../data/bookingApi'
import { formatViennaDateTime } from '../data/dateFormat'
import { useLocale } from '../i18n'
import type { MessageKey } from '../i18n'

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
  const { t } = useLocale()

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          {t('myBookings.title')}
        </Typography>
        <Typography color="text.secondary">{t('myBookings.subtitle')}</Typography>
      </Paper>

      {actionHint ? <Alert severity="success">{actionHint}</Alert> : null}

      {isEmpty ? <Alert severity="info">{t('myBookings.empty')}</Alert> : null}

      {children}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Button variant="contained" onClick={onBookClick}>
          {t('myBookings.bookNew')}
        </Button>
        <Button onClick={onHomeClick}>{t('myBookings.home')}</Button>
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

function statusLabel(status: string, t: (key: MessageKey) => string): string {
  const key = `status.${status}` as MessageKey
  return t(key)
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
  const { t, intlLocale } = useLocale()

  return (
    <Paper sx={{ p: 3 }}>
      {isLoading ? <CircularProgress aria-label={t('myBookings.loading')} size={28} /> : null}
      {isError ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('myBookings.invalid')}
        </Alert>
      ) : null}
      {reservation ? (
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 600 }}>{reservation.serviceName}</Typography>
          <Typography>{formatViennaDateTime(reservation.startAt, intlLocale)}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('myBookings.status', { status: statusLabel(reservation.status, t) })}
          </Typography>
        </Stack>
      ) : null}

      <Stack spacing={1}>
        <Button variant="contained" onClick={onOpenManage}>
          {t('myBookings.open')}
        </Button>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="outlined" onClick={onCopyLink}>
            {t('myBookings.copy')}
          </Button>
          <Button variant="outlined" onClick={onShareLink}>
            {t('myBookings.share')}
          </Button>
          <Button variant="outlined" onClick={onMailtoLink}>
            {t('myBookings.mailto')}
          </Button>
        </Stack>
        <Button color="inherit" onClick={onRemove}>
          {t('myBookings.remove')}
        </Button>
      </Stack>
    </Paper>
  )
}
