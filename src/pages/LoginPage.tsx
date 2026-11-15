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
  const [email, setEmail] = useState('demo@example.com')
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
          Sign in
        </Typography>
        <Typography color="text.secondary">
          Local demo: demo@example.com / password123 (after `pnpm seed` / `pnpm dev:local`)
        </Typography>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
        />
        {signIn.isError ? (
          <Alert severity="error">
            {signIn.error instanceof Error ? signIn.error.message : 'Sign-in failed'}
          </Alert>
        ) : null}
        <Button type="submit" variant="contained" disabled={signIn.isPending}>
          {signIn.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
        <Button type="button" onClick={onHomeClick}>
          Back home
        </Button>
      </Stack>
    </Paper>
  )
}
