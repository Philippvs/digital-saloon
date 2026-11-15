import type * as React from 'react'
import { useState } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import { formatViennaDateTime } from '../data/dateFormat'
import type { ServiceWithId } from '../data/services'

export type BookCheckoutPageProps = {
  service: ServiceWithId | undefined
  startAt: string
  isSubmitting: boolean
  submitError: string | null
  onBackClick: () => void
  onSubmit: (input: {
    firstName: string
    lastName: string
    phone: string
    email: string | null
    privacyAccepted: true
  }) => void
}

export const BookCheckoutPage: React.FunctionComponent<BookCheckoutPageProps> = ({
  service,
  startAt,
  isSubmitting,
  submitError,
  onBackClick,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Ihre Daten
        </Typography>
        <Typography color="text.secondary">
          {service?.name ?? 'Leistung'} · {formatViennaDateTime(startAt)}
        </Typography>
        <Button onClick={onBackClick} sx={{ mt: 2 }} disabled={isSubmitting}>
          Andere Zeit
        </Button>
      </Paper>

      <Paper
        component="form"
        sx={{ p: 3 }}
        onSubmit={(event) => {
          event.preventDefault()
          if (!privacyAccepted) return
          onSubmit({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            email: email.trim().length > 0 ? email.trim() : null,
            privacyAccepted: true,
          })
        }}
      >
        <Stack spacing={2}>
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
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={privacyAccepted}
                onChange={(event) => setPrivacyAccepted(event.target.checked)}
              />
            }
            label="Ich habe die Datenschutzhinweise zur Kenntnis genommen."
          />
          {submitError ? <Alert severity="error">{submitError}</Alert> : null}
          <Button type="submit" variant="contained" disabled={isSubmitting || !privacyAccepted}>
            {isSubmitting ? 'Wird gebucht…' : 'Termin verbindlich anfragen'}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  )
}
