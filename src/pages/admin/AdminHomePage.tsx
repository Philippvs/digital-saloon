import type * as React from 'react'
import { Alert, Button, Paper, Stack, Typography } from '@mui/material'

import { useLocale } from '../../i18n'

export type AdminHomePageProps = {
  salonName: string
  opsBusy: boolean
  opsMessage: string | null
  opsError: string | null
  onCalendarClick: () => void
  onServicesClick: () => void
  onSettingsClick: () => void
  onProcessPendingClick: () => void
}

export const AdminHomePage: React.FunctionComponent<AdminHomePageProps> = ({
  salonName,
  opsBusy,
  opsMessage,
  opsError,
  onCalendarClick,
  onServicesClick,
  onSettingsClick,
  onProcessPendingClick,
}) => {
  const { t } = useLocale()

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          {t('admin.title')}
        </Typography>
        <Typography color="text.secondary">{salonName}</Typography>
      </Paper>
      <Stack spacing={1}>
        <Button variant="contained" onClick={onCalendarClick}>
          {t('admin.calendar')}
        </Button>
        <Button variant="outlined" onClick={onServicesClick}>
          {t('admin.services')}
        </Button>
        <Button variant="outlined" onClick={onSettingsClick}>
          {t('admin.settings')}
        </Button>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h2" gutterBottom sx={{ fontSize: '1.25rem' }}>
          {t('admin.maintenance')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t('admin.maintenanceHint')}
        </Typography>
        <Button variant="outlined" disabled={opsBusy} onClick={onProcessPendingClick}>
          {t('admin.expirePending')}
        </Button>
        {opsMessage ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            {opsMessage}
          </Alert>
        ) : null}
        {opsError ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {opsError}
          </Alert>
        ) : null}
      </Paper>
    </Stack>
  )
}
