import type * as React from 'react'
import { useState } from 'react'
import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material'

import { useSignIn } from '../hooks/useSignIn'
import { useLocale } from '../i18n'

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginPageProps = {
  /** Seeded emulator account shown as a hint and prefilled; `null` in production. */
  devCredentials: LoginCredentials | null
  onSuccess: () => void
  onHomeClick: () => void
}

export const LoginPage: React.FunctionComponent<LoginPageProps> = ({
  devCredentials,
  onSuccess,
  onHomeClick,
}) => {
  const signIn = useSignIn()
  const { t } = useLocale()
  const [email, setEmail] = useState(devCredentials?.email ?? '')
  const [password, setPassword] = useState(devCredentials?.password ?? '')

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
          {t('login.title')}
        </Typography>
        <Typography color="text.secondary">{t('login.staffOnly')}</Typography>
        {devCredentials ? <Alert severity="info">{t('login.hint', devCredentials)}</Alert> : null}
        <TextField
          label={t('login.email')}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          fullWidth
          autoComplete="username"
        />
        <TextField
          label={t('login.password')}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
          autoComplete="current-password"
        />
        {signIn.isError ? (
          <Alert severity="error">
            {signIn.error instanceof Error ? signIn.error.message : t('login.failed')}
          </Alert>
        ) : null}
        <Button type="submit" variant="contained" disabled={signIn.isPending}>
          {signIn.isPending ? t('login.submitting') : t('login.submit')}
        </Button>
        <Button type="button" onClick={onHomeClick}>
          {t('login.backHome')}
        </Button>
      </Stack>
    </Paper>
  )
}
