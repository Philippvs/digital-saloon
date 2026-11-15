import type * as React from 'react'
import { Alert, Button, Paper, Stack, Typography } from '@mui/material'

import { useHealthMessage } from '../hooks/useHealthMessage'

export type HomePageProps = {
  email: string | null
  usesEmulators: boolean
  onLoginClick: () => void
}

export const HomePage: React.FunctionComponent<HomePageProps> = ({
  email,
  usesEmulators,
  onLoginClick,
}) => {
  const health = useHealthMessage()

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          React Firebase Template
        </Typography>
        <Typography color="text.secondary">
          Vite + TypeScript + MUI + TanStack Router/Query + Firebase emulators.
        </Typography>
      </Paper>

      {usesEmulators ? (
        <Alert severity="info">Connected to local Firebase emulators.</Alert>
      ) : (
        <Alert severity="warning">
          Running against configured Firebase project (not emulators).
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h2" sx={{ fontSize: '1.25rem', mb: 1 }}>
          Status
        </Typography>
        <Typography>{health.data ?? (health.isLoading ? 'Loading…' : 'Unavailable')}</Typography>
        <Typography sx={{ mt: 2 }} color="text.secondary">
          {email ? `Signed in as ${email}` : 'Not signed in'}
        </Typography>
        {!email ? (
          <Button sx={{ mt: 2 }} variant="contained" onClick={onLoginClick}>
            Go to sign in
          </Button>
        ) : null}
      </Paper>
    </Stack>
  )
}
