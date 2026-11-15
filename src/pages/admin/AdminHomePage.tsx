import type * as React from 'react'
import { Button, Paper, Stack, Typography } from '@mui/material'

export type AdminHomePageProps = {
  salonName: string
  onCalendarClick: () => void
  onServicesClick: () => void
  onSettingsClick: () => void
}

export const AdminHomePage: React.FunctionComponent<AdminHomePageProps> = ({
  salonName,
  onCalendarClick,
  onServicesClick,
  onSettingsClick,
}) => {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Admin
        </Typography>
        <Typography color="text.secondary">{salonName}</Typography>
      </Paper>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Button variant="contained" onClick={onCalendarClick}>
          Calendar
        </Button>
        <Button variant="outlined" onClick={onServicesClick}>
          Services
        </Button>
        <Button variant="outlined" onClick={onSettingsClick}>
          Settings
        </Button>
      </Stack>
    </Stack>
  )
}
