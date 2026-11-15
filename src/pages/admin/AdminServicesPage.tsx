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
import { useLocale } from '../../i18n'

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
  const { t } = useLocale()

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h1" gutterBottom>
          {t('admin.services')}
        </Typography>
        <Typography color="text.secondary">{t('admin.servicesSubtitle')}</Typography>
      </Paper>

      {isLoading ? <CircularProgress aria-label={t('admin.servicesLoading')} /> : null}
      {isError ? <Alert severity="error">{t('admin.servicesError')}</Alert> : null}

      {services && services.length === 0 ? (
        <Alert severity="info">{t('admin.noServices')}</Alert>
      ) : null}

      {services && services.length > 0 ? (
        <Paper sx={{ p: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.name')}</TableCell>
                <TableCell>{t('admin.duration')}</TableCell>
                <TableCell>{t('admin.price')}</TableCell>
                <TableCell>{t('admin.active')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{t('admin.minutes', { minutes: service.durationMinutes })}</TableCell>
                  <TableCell>{formatPrice(service.priceCents)}</TableCell>
                  <TableCell>{service.active ? t('admin.yes') : t('admin.no')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : null}
    </Stack>
  )
}
