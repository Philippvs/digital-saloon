import type * as React from 'react'
import { Paper, Stack, Typography } from '@mui/material'

export type AdminPlaceholderPageProps = {
  title: string
  description: string
}

export const AdminPlaceholderPage: React.FunctionComponent<AdminPlaceholderPageProps> = ({
  title,
  description,
}) => {
  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Paper>
    </Stack>
  )
}
