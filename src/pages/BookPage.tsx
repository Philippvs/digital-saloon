import type * as React from 'react'
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material'

import type { ServiceWithId } from '../data/services'

export type BookPageProps = {
  services: ServiceWithId[] | undefined
  isLoading: boolean
  isError: boolean
  onBackClick: () => void
  onSelectService: (serviceId: string) => void
}

export const BookPage: React.FunctionComponent<BookPageProps> = ({
  services,
  isLoading,
  isError,
  onBackClick,
  onSelectService,
}) => {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Termin buchen
        </Typography>
        <Typography color="text.secondary">
          Schritt 1 von 3: Leistung wählen — ohne Kundenkonto.
        </Typography>
        <Button onClick={onBackClick} sx={{ mt: 2 }}>
          Zurück zur Startseite
        </Button>
      </Paper>

      {isLoading ? <Typography>Leistungen werden geladen…</Typography> : null}
      {isError ? <Alert severity="error">Leistungen konnten nicht geladen werden.</Alert> : null}

      <Stack spacing={1}>
        {services?.map((service) => (
          <Paper key={service.id} sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { sm: 'center' },
                gap: 1,
              }}
            >
              <Stack>
                <Typography sx={{ fontWeight: 600 }}>{service.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.durationMinutes} Min · €{(service.priceCents / 100).toFixed(2)}
                </Typography>
              </Stack>
              <Button variant="outlined" onClick={() => onSelectService(service.id)}>
                Auswählen
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Stack>
  )
}
