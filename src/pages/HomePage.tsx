import type * as React from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

import type { ServiceWithId } from '../data/services'
import type { Salon } from '../data/schemas'

export type HomePageProps = {
  salon: Salon | null | undefined
  services: ServiceWithId[] | undefined
  salonLoading: boolean
  servicesLoading: boolean
  servicesError: boolean
  usesEmulators: boolean
  onBookClick: () => void
}

function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`
}

export const HomePage: React.FunctionComponent<HomePageProps> = ({
  salon,
  services,
  salonLoading,
  servicesLoading,
  servicesError,
  usesEmulators,
  onBookClick,
}) => {
  const title = salon?.name ?? 'SalonFlow'

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h1" gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
          Online Termine buchen — ohne Registrierung. Wählen Sie eine Leistung und einen freien
          Zeitslot.
        </Typography>
        <Button variant="contained" size="large" onClick={onBookClick} sx={{ mt: 3 }}>
          Termin buchen
        </Button>
      </Box>

      {usesEmulators ? <Alert severity="info">Lokale Firebase-Emulatoren aktiv.</Alert> : null}

      <Paper sx={{ p: 3 }} component="section" aria-labelledby="services-heading">
        <Typography id="services-heading" variant="h2" sx={{ fontSize: '1.35rem', mb: 2 }}>
          Leistungen
        </Typography>
        {servicesLoading || salonLoading ? <CircularProgress aria-label="Laden" /> : null}
        {servicesError ? (
          <Alert severity="error">Leistungen konnten nicht geladen werden.</Alert>
        ) : null}
        {services && services.length === 0 ? (
          <Typography color="text.secondary">Noch keine Leistungen hinterlegt.</Typography>
        ) : null}
        <Stack divider={<Divider />} spacing={2}>
          {services?.map((service) => (
            <Box key={service.id}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  gap: 0.5,
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>{service.name}</Typography>
                <Typography color="text.secondary">
                  {service.durationMinutes} Min · {formatPrice(service.priceCents)}
                </Typography>
              </Box>
              {service.description ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {service.description}
                </Typography>
              ) : null}
            </Box>
          ))}
        </Stack>
      </Paper>

      {salon ? (
        <Paper sx={{ p: 3 }} component="section" aria-labelledby="contact-heading">
          <Typography id="contact-heading" variant="h2" sx={{ fontSize: '1.35rem', mb: 1 }}>
            Kontakt
          </Typography>
          <Typography>{salon.address}</Typography>
          <Typography>{salon.phone}</Typography>
          <Typography>{salon.email}</Typography>
        </Paper>
      ) : null}
    </Stack>
  )
}
