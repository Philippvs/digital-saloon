import type * as React from 'react'
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import type { AvailableSlotDto } from '../../data/bookingApi'
import { formatViennaDate, formatViennaTime } from '../../data/dateFormat'
import type { ServiceWithId } from '../../data/services'

export type AdminManualBookingPageProps = {
  services: ServiceWithId[] | undefined
  dates: string[]
  selectedServiceId: string | null
  selectedDate: string | null
  slots: AvailableSlotDto[] | undefined
  slotsLoading: boolean
  isSubmitting: boolean
  submitError: string | null
  onBackClick: () => void
  onServiceChange: (serviceId: string) => void
  onDateChange: (dateYmd: string) => void
  onSubmit: (input: {
    serviceId: string
    startAt: string
    firstName: string
    lastName: string
    phone: string
    email: string | null
    internalNote: string | null
  }) => void
}

export const AdminManualBookingPage: React.FunctionComponent<AdminManualBookingPageProps> = ({
  services,
  dates,
  selectedServiceId,
  selectedDate,
  slots,
  slotsLoading,
  isSubmitting,
  submitError,
  onBackClick,
  onServiceChange,
  onDateChange,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [internalNote, setInternalNote] = useState('')
  const [startAt, setStartAt] = useState<string | null>(null)

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Manueller Termin
        </Typography>
        <Typography color="text.secondary">
          Für Telefonbuchungen — wird sofort bestätigt. Advance-Limits gelten nicht.
        </Typography>
        <Button onClick={onBackClick} sx={{ mt: 2 }}>
          Zurück
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField
            select
            label="Leistung"
            value={selectedServiceId ?? ''}
            onChange={(event) => onServiceChange(event.target.value)}
            fullWidth
          >
            {(services ?? []).map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {service.name}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="subtitle2">Tag</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {dates.map((dateYmd) => (
              <Button
                key={dateYmd}
                size="small"
                variant={selectedDate === dateYmd ? 'contained' : 'outlined'}
                onClick={() => {
                  setStartAt(null)
                  onDateChange(dateYmd)
                }}
              >
                {formatViennaDate(dateYmd)}
              </Button>
            ))}
          </Box>

          {selectedDate && selectedServiceId ? (
            <>
              <Typography variant="subtitle2">Uhrzeit</Typography>
              {slotsLoading ? <CircularProgress size={24} /> : null}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {slots?.map((slot) => (
                  <Button
                    key={slot.startAt}
                    size="small"
                    variant={startAt === slot.startAt ? 'contained' : 'outlined'}
                    onClick={() => setStartAt(slot.startAt)}
                  >
                    {formatViennaTime(slot.startAt)}
                  </Button>
                ))}
              </Box>
              {slots && slots.length === 0 ? (
                <Alert severity="info">Keine freien Slots.</Alert>
              ) : null}
            </>
          ) : null}

          <TextField
            label="Vorname"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Nachname"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Telefon"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="E-Mail (optional)"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
          />
          <TextField
            label="Interne Notiz (optional)"
            value={internalNote}
            onChange={(event) => setInternalNote(event.target.value)}
            fullWidth
            multiline
            minRows={2}
          />

          {submitError ? <Alert severity="error">{submitError}</Alert> : null}

          <Button
            variant="contained"
            disabled={
              isSubmitting ||
              !selectedServiceId ||
              !startAt ||
              firstName.trim().length === 0 ||
              lastName.trim().length === 0 ||
              phone.trim().length === 0
            }
            onClick={() => {
              if (!selectedServiceId || !startAt) return
              onSubmit({
                serviceId: selectedServiceId,
                startAt,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phone: phone.trim(),
                email: email.trim().length > 0 ? email.trim() : null,
                internalNote: internalNote.trim().length > 0 ? internalNote.trim() : null,
              })
            }}
          >
            {isSubmitting ? 'Wird gespeichert…' : 'Termin anlegen'}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  )
}
