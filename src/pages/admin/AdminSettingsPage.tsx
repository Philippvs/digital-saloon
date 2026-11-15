import type * as React from 'react'
import { Alert, CircularProgress, Paper, Stack, Typography } from '@mui/material'

import type { BookingSettings } from '../../data/schemas'

export type AdminSettingsPageProps = {
  settings: BookingSettings | null | undefined
  isLoading: boolean
  isError: boolean
}

export const AdminSettingsPage: React.FunctionComponent<AdminSettingsPageProps> = ({
  settings,
  isLoading,
  isError,
}) => {
  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Booking settings
        </Typography>
        <Typography color="text.secondary">
          Confirmation mode and advance-booking limits for the pilot salon.
        </Typography>
      </Paper>

      {isLoading ? <CircularProgress aria-label="Loading settings" /> : null}
      {isError ? <Alert severity="error">Could not load booking settings.</Alert> : null}

      {settings ? (
        <Paper sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Typography>Confirmation mode: {settings.confirmationMode}</Typography>
            <Typography>Slot interval: {settings.slotIntervalMinutes} minutes</Typography>
            <Typography>Minimum advance: {settings.minAdvanceBookingMinutes} minutes</Typography>
            <Typography>Maximum advance: {settings.maxAdvanceBookingDays} days</Typography>
            <Typography>Pending expiration: {settings.pendingExpirationHours} hours</Typography>
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  )
}
