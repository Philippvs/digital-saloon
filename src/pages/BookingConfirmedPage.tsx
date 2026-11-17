import type * as React from 'react'
import { Alert, Button, Paper, Stack, Typography } from '@mui/material'

import { formatViennaDateTime } from '../data/dateFormat'
import { useLocale } from '../i18n'

export type BookingConfirmedPageProps = {
  status: string
  serviceName: string | null
  startAt: string | null
  managementUrl: string
  shareHint: string | null
  onManageClick: () => void
  onCopyLink: () => void
  onShareLink: () => void
  onMailtoLink: () => void
  onMyBookingsClick: () => void
  onHomeClick: () => void
}

export const BookingConfirmedPage: React.FunctionComponent<BookingConfirmedPageProps> = ({
  status,
  serviceName,
  startAt,
  managementUrl,
  shareHint,
  onManageClick,
  onCopyLink,
  onShareLink,
  onMailtoLink,
  onMyBookingsClick,
  onHomeClick,
}) => {
  const { t, intlLocale } = useLocale()
  const pending = status === 'PENDING'

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          {pending ? t('confirmed.pendingTitle') : t('confirmed.confirmedTitle')}
        </Typography>
        <Typography color="text.secondary">
          {pending ? t('confirmed.pendingBody') : t('confirmed.confirmedBody')}
        </Typography>
        {serviceName && startAt ? (
          <Typography sx={{ mt: 2 }}>
            {serviceName} · {formatViennaDateTime(startAt, intlLocale)}
          </Typography>
        ) : null}
      </Paper>

      <Alert severity="warning">{t('confirmed.saveWarning')}</Alert>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h2" sx={{ fontSize: '1.15rem', mb: 1 }}>
          {t('confirmed.linkHeading')}
        </Typography>
        <Typography
          variant="body2"
          sx={{ wordBreak: 'break-all', mb: 2, fontFamily: 'ui-monospace, monospace' }}
        >
          {managementUrl}
        </Typography>
        {shareHint ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {shareHint}
          </Alert>
        ) : null}
        <Stack spacing={1}>
          <Button variant="contained" onClick={onManageClick}>
            {t('confirmed.manage')}
          </Button>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" onClick={onCopyLink}>
              {t('confirmed.copy')}
            </Button>
            <Button variant="outlined" onClick={onShareLink}>
              {t('confirmed.share')}
            </Button>
            <Button variant="outlined" onClick={onMailtoLink}>
              {t('confirmed.mailto')}
            </Button>
          </Stack>
          <Button onClick={onMyBookingsClick}>{t('confirmed.myBookings')}</Button>
          <Button onClick={onHomeClick}>{t('confirmed.home')}</Button>
        </Stack>
      </Paper>
    </Stack>
  )
}
