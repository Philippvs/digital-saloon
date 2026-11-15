import type * as React from 'react'
import { Alert, Button, Stack, Typography } from '@mui/material'
import type { ErrorComponentProps } from '@tanstack/react-router'

import { useLocale } from '../i18n'

export const RouteError: React.FunctionComponent<ErrorComponentProps> = ({ error, reset }) => {
  const { t } = useLocale()

  return (
    <Stack spacing={2}>
      <Typography variant="h2" sx={{ fontSize: '1.25rem' }}>
        {t('error.somethingWrong')}
      </Typography>
      <Alert severity="error">{error instanceof Error ? error.message : String(error)}</Alert>
      <Button variant="contained" onClick={reset}>
        {t('error.tryAgain')}
      </Button>
    </Stack>
  )
}
