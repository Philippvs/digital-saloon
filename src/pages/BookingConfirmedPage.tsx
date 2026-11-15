import type * as React from 'react'
import { Alert, Button, Paper, Stack, Typography } from '@mui/material'

import { formatViennaDateTime } from '../data/dateFormat'

export type BookingConfirmedPageProps = {
  status: string
  serviceName: string | null
  startAt: string | null
  managementUrl: string
  onManageClick: () => void
  onHomeClick: () => void
}

export const BookingConfirmedPage: React.FunctionComponent<BookingConfirmedPageProps> = ({
  status,
  serviceName,
  startAt,
  managementUrl,
  onManageClick,
  onHomeClick,
}) => {
  const pending = status === 'PENDING'

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          {pending ? 'Anfrage eingegangen' : 'Termin bestätigt'}
        </Typography>
        <Typography color="text.secondary">
          {pending
            ? 'Der Salon prüft Ihre Anfrage. Der Zeitslot ist vorerst reserviert.'
            : 'Ihr Termin ist gebucht. Bitte speichern Sie den Verwaltungs-Link.'}
        </Typography>
        {serviceName && startAt ? (
          <Typography sx={{ mt: 2 }}>
            {serviceName} · {formatViennaDateTime(startAt)}
          </Typography>
        ) : null}
      </Paper>

      <Alert severity="info">
        Ohne Kundenkonto: Verwalten Sie den Termin über diesen persönlichen Link. Bewahren Sie ihn
        auf.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 2 }}>
          {managementUrl}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="contained" onClick={onManageClick}>
            Termin verwalten
          </Button>
          <Button onClick={onHomeClick}>Zur Startseite</Button>
        </Stack>
      </Paper>
    </Stack>
  )
}
