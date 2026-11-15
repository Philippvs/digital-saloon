import type * as React from 'react'
import { Alert, Button, Stack, Typography } from '@mui/material'
import type { ErrorComponentProps } from '@tanstack/react-router'

export const RouteError: React.FunctionComponent<ErrorComponentProps> = ({ error, reset }) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h2" sx={{ fontSize: '1.25rem' }}>
        Something went wrong
      </Typography>
      <Alert severity="error">{error instanceof Error ? error.message : String(error)}</Alert>
      <Button variant="contained" onClick={reset}>
        Try again
      </Button>
    </Stack>
  )
}
