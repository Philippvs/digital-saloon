import type * as React from 'react'
import { Box, Button, Paper, Stack, Typography } from '@mui/material'

import { formatViennaDateTime } from '../data/dateFormat'
import { useLocale } from '../i18n'
import { brand } from '../theme'

export type BookingConfirmedPageProps = {
  status: string
  serviceName: string | null
  startAt: string | null
  onManageClick: () => void
  onMyBookingsClick: () => void
  onHomeClick: () => void
}

export const BookingConfirmedPage: React.FunctionComponent<BookingConfirmedPageProps> = ({
  status,
  serviceName,
  startAt,
  onManageClick,
  onMyBookingsClick,
  onHomeClick,
}) => {
  const { t, intlLocale } = useLocale()
  const pending = status === 'PENDING'

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', width: '100%', py: { xs: 2, sm: 4 } }}>
      <Paper sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
        <Box
          aria-hidden
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: brand.stone,
            border: 1,
            borderColor: brand.orange,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={brand.orange}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </Box>
        <Typography variant="h1" gutterBottom>
          {pending ? t('confirmed.pendingTitle') : t('confirmed.confirmedTitle')}
        </Typography>
        <Typography sx={{ fontSize: '1.05rem', color: 'text.primary', mb: 2 }}>
          {pending ? t('confirmed.pendingBody') : t('confirmed.confirmedBody')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('confirmed.emailSentNote')}
        </Typography>

        {serviceName && startAt ? (
          <Box
            sx={{
              bgcolor: brand.stone,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              mb: 3,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>{serviceName}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {formatViennaDateTime(startAt, intlLocale)}
            </Typography>
          </Box>
        ) : null}

        <Stack spacing={1.25}>
          <Button variant="contained" size="large" onClick={onManageClick}>
            {t('confirmed.manage')}
          </Button>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.25}
            sx={{ justifyContent: 'center' }}
          >
            <Button variant="outlined" onClick={onMyBookingsClick} fullWidth>
              {t('confirmed.myBookings')}
            </Button>
            <Button variant="text" onClick={onHomeClick} fullWidth>
              {t('confirmed.home')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}
