import type * as React from 'react'
import { Alert, Button, Paper, Stack, Typography } from '@mui/material'

import { formatViennaDateTime } from '../data/dateFormat'

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
            : 'Ihr Termin ist gebucht.'}
        </Typography>
        {serviceName && startAt ? (
          <Typography sx={{ mt: 2 }}>
            {serviceName} · {formatViennaDateTime(startAt)}
          </Typography>
        ) : null}
      </Paper>

      <Alert severity="warning">
        Speichern Sie diesen persönlichen Link. Ohne Kundenkonto ist er der einzige Zugang zum
        Termin. Er wurde auf diesem Gerät unter „Meine Termine“ hinterlegt.
      </Alert>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h2" sx={{ fontSize: '1.15rem', mb: 1 }}>
          Ihr Verwaltungs-Link
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
            Termin verwalten
          </Button>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" onClick={onCopyLink}>
              Link kopieren
            </Button>
            <Button variant="outlined" onClick={onShareLink}>
              Teilen
            </Button>
            <Button variant="outlined" onClick={onMailtoLink}>
              Per E-Mail senden
            </Button>
          </Stack>
          <Button onClick={onMyBookingsClick}>Meine Termine</Button>
          <Button onClick={onHomeClick}>Zur Startseite</Button>
        </Stack>
      </Paper>
    </Stack>
  )
}
