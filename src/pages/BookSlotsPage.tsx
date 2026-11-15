import type * as React from 'react'
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'

import type { AvailableSlotDto } from '../data/bookingApi'
import { formatViennaDate, formatViennaTime } from '../data/dateFormat'
import type { ServiceWithId } from '../data/services'

export type BookSlotsPageProps = {
  service: ServiceWithId | undefined
  dates: string[]
  selectedDate: string | null
  slots: AvailableSlotDto[] | undefined
  slotsLoading: boolean
  slotsError: boolean
  onBackClick: () => void
  onDateSelect: (dateYmd: string) => void
  onSlotSelect: (startAt: string) => void
}

export const BookSlotsPage: React.FunctionComponent<BookSlotsPageProps> = ({
  service,
  dates,
  selectedDate,
  slots,
  slotsLoading,
  slotsError,
  onBackClick,
  onDateSelect,
  onSlotSelect,
}) => {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Datum & Uhrzeit
        </Typography>
        <Typography color="text.secondary">
          {service ? `${service.name} · ${service.durationMinutes} Min` : 'Leistung wird geladen…'}
        </Typography>
        <Button onClick={onBackClick} sx={{ mt: 2 }}>
          Andere Leistung
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h2" sx={{ fontSize: '1.2rem', mb: 2 }}>
          Tag wählen
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {dates.map((dateYmd) => (
            <Button
              key={dateYmd}
              variant={selectedDate === dateYmd ? 'contained' : 'outlined'}
              onClick={() => onDateSelect(dateYmd)}
            >
              {formatViennaDate(dateYmd)}
            </Button>
          ))}
        </Box>
      </Paper>

      {selectedDate ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h2" sx={{ fontSize: '1.2rem', mb: 2 }}>
            Verfügbare Zeiten
          </Typography>
          {slotsLoading ? <CircularProgress aria-label="Slots laden" /> : null}
          {slotsError ? <Alert severity="error">Zeiten konnten nicht geladen werden.</Alert> : null}
          {slots && slots.length === 0 ? (
            <Alert severity="info">Keine freien Termine an diesem Tag.</Alert>
          ) : null}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {slots?.map((slot) => (
              <Button
                key={slot.startAt}
                variant="outlined"
                onClick={() => onSlotSelect(slot.startAt)}
              >
                {formatViennaTime(slot.startAt)}
              </Button>
            ))}
          </Box>
        </Paper>
      ) : null}
    </Stack>
  )
}
