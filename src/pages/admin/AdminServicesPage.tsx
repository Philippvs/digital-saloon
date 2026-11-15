import type * as React from 'react'
import {
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import type { ServiceWithId } from '../../data/services'

export type AdminServicesPageProps = {
  services: ServiceWithId[] | undefined
  isLoading: boolean
  isError: boolean
}

function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`
}

export const AdminServicesPage: React.FunctionComponent<AdminServicesPageProps> = ({
  services,
  isLoading,
  isError,
}) => {
  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          Services
        </Typography>
        <Typography color="text.secondary">
          Catalog used for online and manual bookings. Prices are stored as integer cents.
        </Typography>
      </Paper>

      {isLoading ? <CircularProgress aria-label="Loading services" /> : null}
      {isError ? <Alert severity="error">Could not load services.</Alert> : null}

      {services && services.length === 0 ? <Alert severity="info">No services yet.</Alert> : null}

      {services && services.length > 0 ? (
        <Paper sx={{ p: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.durationMinutes} min</TableCell>
                  <TableCell>{formatPrice(service.priceCents)}</TableCell>
                  <TableCell>{service.active ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : null}
    </Stack>
  )
}
