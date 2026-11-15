import type * as React from 'react'
import { useState } from 'react'
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material'

import { useSignIn } from '../hooks/useSignIn'

export type LoginPageProps = {
  onSuccess: () => void
  onHomeClick: () => void
}

export const LoginPage: React.FunctionComponent<LoginPageProps> = ({ onSuccess, onHomeClick }) => {
  const signIn = useSignIn()
  const [email, setEmail] = useState('admin@salonflow.local')
  const [password, setPassword] = useState('password123')

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    signIn.mutate(
      { email, password },
      {
        onSuccess: () => {
          onSuccess()
        },
      },
    )
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 420, mx: 'auto' }}>
      <Stack component="form" spacing={2} onSubmit={onSubmit}>
        <Typography variant="h1" sx={{ fontSize: '1.5rem' }}>
          Admin-Anmeldung
        </Typography>
        <Typography color="text.secondary">
          Nur für Salon-Mitarbeiter. Kunden buchen Termine ohne Login — zurück zur Startseite und
          „Termin buchen“ wählen.
        </Typography>
        <Alert severity="info">Lokal nach Seed: admin@salonflow.local / password123</Alert>
        <TextField
          label="E-Mail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          fullWidth
          autoComplete="username"
        />
        <TextField
          label="Passwort"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
          autoComplete="current-password"
        />
        {signIn.isError ? (
          <Alert severity="error">
            {signIn.error instanceof Error ? signIn.error.message : 'Anmeldung fehlgeschlagen'}
          </Alert>
        ) : null}
        <Button type="submit" variant="contained" disabled={signIn.isPending}>
          {signIn.isPending ? 'Wird angemeldet…' : 'Als Admin anmelden'}
        </Button>
        <Button type="button" onClick={onHomeClick}>
          Zur Kunden-Startseite
        </Button>
      </Stack>
    </Paper>
  )
}
