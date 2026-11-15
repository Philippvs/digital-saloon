import type * as React from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { WeekPlanner } from '../../components/WeekPlanner'
import { formatViennaDateTime } from '../../data/dateFormat'
import type { ReservationWithId } from '../../data/reservations'
import { formatBookedTime, type WeekPlan } from '../../data/weekPlanner'
import { useLocale } from '../../i18n'
import { WeekTitle, WeekTotals } from './AdminHomePage.styles'

export type AdminHomePageProps = {
  weekTitle: string
  weekRangeLabel: string
  isCurrentWeek: boolean
  plan: WeekPlan | undefined
  planLoading: boolean
  planError: boolean
  pending: ReservationWithId[] | undefined
  confirmingReservationId: string | null
  confirmError: string | null
  opsBusy: boolean
  opsMessage: string | null
  opsError: string | null
  onPrevWeekClick: () => void
  onNextWeekClick: () => void
  onThisWeekClick: () => void
  onSelectReservation: (reservationId: string) => void
  onConfirmReservation: (reservationId: string) => void
  onAddReservationClick: () => void
  onAddReservationAt: (dateYmd: string, startTime: string) => void
  onReservationsClick: () => void
  onServicesClick: () => void
  onSettingsClick: () => void
  onProcessPendingClick: () => void
}

export const AdminHomePage: React.FunctionComponent<AdminHomePageProps> = ({
  weekTitle,
  weekRangeLabel,
  isCurrentWeek,
  plan,
  planLoading,
  planError,
  pending,
  confirmingReservationId,
  confirmError,
  opsBusy,
  opsMessage,
  opsError,
  onPrevWeekClick,
  onNextWeekClick,
  onThisWeekClick,
  onSelectReservation,
  onConfirmReservation,
  onAddReservationClick,
  onAddReservationAt,
  onReservationsClick,
  onServicesClick,
  onSettingsClick,
  onProcessPendingClick,
}) => {
  const { t, intlLocale } = useLocale()
  const revenue = new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format((plan?.totals.revenueCents ?? 0) / 100)

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-end' }}>
          <Box>
            <WeekTitle>{weekTitle}</WeekTitle>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {weekRangeLabel}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', pb: 0.25 }}>
            <IconButton aria-label={t('admin.prevWeek')} onClick={onPrevWeekClick}>
              <ChevronLeftIcon />
            </IconButton>
            <Button
              variant="outlined"
              disabled={isCurrentWeek}
              onClick={onThisWeekClick}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {t('admin.thisWeek')}
            </Button>
            <IconButton aria-label={t('admin.nextWeek')} onClick={onNextWeekClick}>
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {plan ? (
            <WeekTotals aria-label={t('admin.weekTotals')}>
              <div>
                <dt>{t('admin.totalCount')}</dt>
                <dd>{plan.totals.count}</dd>
              </div>
              <div>
                <dt>{t('admin.totalTime')}</dt>
                <dd>{formatBookedTime(plan.totals.bookedMinutes)}</dd>
              </div>
              <div>
                <dt>{t('admin.totalRevenue')}</dt>
                <dd>{revenue}</dd>
              </div>
            </WeekTotals>
          ) : null}
          <Button variant="contained" size="large" onClick={onAddReservationClick}>
            {t('admin.addReservation')}
          </Button>
        </Stack>
      </Box>

      {planError ? <Alert severity="error">{t('admin.reservationsError')}</Alert> : null}

      <Box component="section" aria-label={t('admin.plannerLabel')} sx={{ position: 'relative' }}>
        {plan ? (
          <WeekPlanner
            plan={plan}
            onSelectReservation={onSelectReservation}
            onAddAt={onAddReservationAt}
          />
        ) : null}
        {planLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress aria-label={t('admin.calendarLoading')} />
          </Box>
        ) : null}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Paper component="section" aria-labelledby="dash-pending" sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography id="dash-pending" variant="h2" sx={{ fontSize: '1.25rem', mb: 1.5 }}>
            {t('admin.statPending')}
          </Typography>
          {pending && pending.length === 0 ? (
            <Typography color="text.secondary">{t('admin.pendingEmpty')}</Typography>
          ) : null}
          {confirmError ? (
            <Alert severity="error" sx={{ mb: 1.5 }}>
              {confirmError}
            </Alert>
          ) : null}
          <Stack component="ul" spacing={2} sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {pending?.map((reservation) => (
              <Box
                component="li"
                key={reservation.id}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600 }}>
                    {reservation.firstName} {reservation.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatViennaDateTime(reservation.startAt, intlLocale)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {reservation.serviceName}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={confirmingReservationId !== null}
                    onClick={() => onConfirmReservation(reservation.id)}
                  >
                    {t('admin.confirm')}
                  </Button>
                  <Button size="small" onClick={() => onSelectReservation(reservation.id)}>
                    {t('admin.open')}
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper component="section" aria-labelledby="dash-manage" sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography id="dash-manage" variant="h2" sx={{ fontSize: '1.25rem', mb: 1.5 }}>
            {t('admin.manageTitle')}
          </Typography>
          <Stack spacing={0.5} sx={{ alignItems: 'flex-start', ml: -1 }}>
            <Button onClick={onReservationsClick}>{t('admin.allReservations')}</Button>
            <Button onClick={onServicesClick}>{t('admin.services')}</Button>
            <Button onClick={onSettingsClick}>{t('admin.settings')}</Button>
          </Stack>
        </Paper>

        <Paper component="section" aria-labelledby="dash-maintenance" sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography id="dash-maintenance" variant="h2" sx={{ fontSize: '1.25rem', mb: 1 }}>
            {t('admin.maintenance')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('admin.maintenanceHint')}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            disabled={opsBusy}
            onClick={onProcessPendingClick}
          >
            {t('admin.expirePending')}
          </Button>
          {opsMessage ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              {opsMessage}
            </Alert>
          ) : null}
          {opsError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {opsError}
            </Alert>
          ) : null}
        </Paper>
      </Box>
    </Stack>
  )
}
