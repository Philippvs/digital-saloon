import type * as React from 'react'
import { Alert, CircularProgress, Paper, Stack, Typography } from '@mui/material'

import type { BookingSettings } from '../../data/schemas'
import { useLocale } from '../../i18n'

export type AdminSettingsPageProps = {
  settings: BookingSettings | null | undefined
  isLoading: boolean
  isError: boolean
}

export const AdminSettingsPage: React.FunctionComponent<AdminSettingsPageProps> = ({
  settings,
  isLoading,
  isError,
}) => {
  const { t } = useLocale()

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          {t('admin.settings')}
        </Typography>
        <Typography color="text.secondary">{t('admin.settingsSubtitle')}</Typography>
      </Paper>

      {isLoading ? <CircularProgress aria-label={t('admin.settingsLoading')} /> : null}
      {isError ? <Alert severity="error">{t('admin.settingsError')}</Alert> : null}

      {settings ? (
        <Paper sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Typography>
              {t('admin.confirmationMode', { mode: settings.confirmationMode })}
            </Typography>
            <Typography>
              {t('admin.slotInterval', { minutes: settings.slotIntervalMinutes })}
            </Typography>
            <Typography>
              {t('admin.minAdvance', { minutes: settings.minAdvanceBookingMinutes })}
            </Typography>
            <Typography>
              {t('admin.maxAdvance', { days: settings.maxAdvanceBookingDays })}
            </Typography>
            <Typography>
              {t('admin.pendingExpiration', { hours: settings.pendingExpirationHours })}
            </Typography>
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  )
}
