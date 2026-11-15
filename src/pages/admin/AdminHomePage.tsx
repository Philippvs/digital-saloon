import type * as React from 'react'
import { Alert, Button, Paper, Stack, Typography } from '@mui/material'

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
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Admin
        </Typography>
        <Typography color="text.secondary">{salonName}</Typography>
      </Paper>
      <Stack spacing={1}>
        <Button variant="contained" onClick={onCalendarClick}>
          Kalender
        </Button>
        <Button variant="outlined" onClick={onServicesClick}>
          Leistungen
        </Button>
        <Button variant="outlined" onClick={onSettingsClick}>
          Einstellungen
        </Button>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h2" gutterBottom sx={{ fontSize: '1.25rem' }}>
          Wartung
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Abgelaufene ausstehende Anfragen manuell prüfen (auch per Zeitplan).
        </Typography>
        <Button variant="outlined" disabled={opsBusy} onClick={onProcessPendingClick}>
          Ausstehende Anfragen ablaufen lassen
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
