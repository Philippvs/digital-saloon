import type * as React from 'react'
import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import * as v from 'valibot'

import type { AvailableSlotDto } from '../data/bookingApi'
import {
  addMonths,
  monthMatrix,
  parseYmd,
  slotsByDate,
  viennaTodayYmd,
} from '../data/bookingCalendar'
import { formatViennaDateTime, formatViennaTime } from '../data/dateFormat'
import { bookingContactSchema } from '../data/phone'
import type { ServiceWithId } from '../data/services'
import { useLocale } from '../i18n'
import { brand } from '../theme'

export type BookingWizardPageProps = {
  services: ServiceWithId[] | undefined
  servicesLoading: boolean
  servicesError: boolean
  selectedServiceId: string | null
  selectedDate: string | null
  selectedStartAt: string | null
  rangeSlots: AvailableSlotDto[] | undefined
  rangeLoading: boolean
  rangeError: boolean
  isSubmitting: boolean
  submitError: string | null
  onSelectService: (serviceId: string) => void
  onSelectDate: (dateYmd: string) => void
  onSelectTime: (startAt: string) => void
  onClearTime: () => void
  onMonthAnchorChange: (anchorYmd: string) => void
  monthAnchorYmd: string
  onSubmit: (input: {
    firstName: string
    lastName: string
    phone: string
    privacyAccepted: true
  }) => void
}

function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`
}

export const BookingWizardPage: React.FunctionComponent<BookingWizardPageProps> = ({
  services,
  servicesLoading,
  servicesError,
  selectedServiceId,
  selectedDate,
  selectedStartAt,
  rangeSlots,
  rangeLoading,
  rangeError,
  isSubmitting,
  submitError,
  onSelectService,
  onSelectDate,
  onSelectTime,
  onClearTime,
  onMonthAnchorChange,
  monthAnchorYmd,
  onSubmit,
}) => {
  const { t, intlLocale } = useLocale()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const weekdays = [
    t('book.weekday.mo'),
    t('book.weekday.tu'),
    t('book.weekday.we'),
    t('book.weekday.th'),
    t('book.weekday.fr'),
    t('book.weekday.sa'),
    t('book.weekday.su'),
  ]

  const selectedService = services?.find((item) => item.id === selectedServiceId) ?? null
  const byDate = useMemo(() => slotsByDate(rangeSlots ?? []), [rangeSlots])
  const daySlots = selectedDate ? (byDate.get(selectedDate) ?? []) : []
  const { year, monthIndex } = parseYmd(monthAnchorYmd)
  const weeks = monthMatrix(year, monthIndex)
  const todayYmd = viennaTodayYmd()
  const monthLabel = new Intl.DateTimeFormat(intlLocale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, monthIndex, 1)))

  const showDate = selectedServiceId !== null
  const showTime = selectedDate !== null
  const showDetails = selectedStartAt !== null
  const showConfirm = selectedStartAt !== null

  return (
    <Stack spacing={3} sx={{ maxWidth: 560, mx: 'auto', width: '100%' }}>
      <Box>
        <Typography variant="h1" gutterBottom>
          {t('book.title')}
        </Typography>
        <Typography color="text.secondary">{t('book.subtitle')}</Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 3 } }} component="section" aria-labelledby="step-service">
        <Typography id="step-service" variant="h2" sx={{ fontSize: '1.15rem', mb: 2 }}>
          {t('book.step.service')}
        </Typography>
        {servicesLoading ? (
          <CircularProgress aria-label={t('book.servicesLoading')} size={28} />
        ) : null}
        {servicesError ? <Alert severity="error">{t('book.servicesError')}</Alert> : null}
        <Stack spacing={1.5}>
          {services?.map((service) => {
            const selected = service.id === selectedServiceId
            return (
              <Box
                key={service.id}
                component="button"
                type="button"
                onClick={() => onSelectService(service.id)}
                sx={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: '1.5px solid',
                  borderColor: selected ? 'primary.main' : 'divider',
                  bgcolor: selected ? brand.stone : 'background.paper',
                  p: 2,
                  font: 'inherit',
                  color: 'inherit',
                  transition: 'border-color 120ms ease, background-color 120ms ease',
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>{service.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('book.durationMinutes', { minutes: service.durationMinutes })} ·{' '}
                  {formatPrice(service.priceCents)}
                </Typography>
              </Box>
            )
          })}
        </Stack>
      </Paper>

      {showDate ? (
        <Paper sx={{ p: { xs: 2, sm: 3 } }} component="section" aria-labelledby="step-date">
          <Typography id="step-date" variant="h2" sx={{ fontSize: '1.15rem', mb: 2 }}>
            {t('book.step.date')}
          </Typography>
          <Stack
            direction="row"
            sx={{ mb: 2, alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Button size="small" onClick={() => onMonthAnchorChange(addMonths(monthAnchorYmd, -1))}>
              {t('book.monthPrev')}
            </Button>
            <Typography sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
              {monthLabel}
            </Typography>
            <Button size="small" onClick={() => onMonthAnchorChange(addMonths(monthAnchorYmd, 1))}>
              {t('book.monthNext')}
            </Button>
          </Stack>
          {rangeLoading ? (
            <CircularProgress aria-label={t('book.availabilityLoading')} size={28} />
          ) : null}
          {rangeError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t('book.availabilityError')}
            </Alert>
          ) : null}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 0.5,
              mb: 0.5,
            }}
          >
            {weekdays.map((label) => (
              <Typography
                key={label}
                variant="caption"
                color="text.secondary"
                sx={{ textAlign: 'center', fontWeight: 600 }}
              >
                {label}
              </Typography>
            ))}
          </Box>
          <Stack spacing={0.5}>
            {weeks.map((week, weekIndex) => (
              <Box
                key={weekIndex}
                sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}
              >
                {week.map((ymd, dayIndex) => {
                  if (!ymd) return <Box key={`empty-${weekIndex}-${dayIndex}`} />
                  const available = (byDate.get(ymd)?.length ?? 0) > 0
                  const selected = ymd === selectedDate
                  const past = ymd < todayYmd
                  const disabled = !available || past
                  return (
                    <Button
                      key={ymd}
                      size="small"
                      disabled={disabled}
                      variant={selected ? 'contained' : 'text'}
                      onClick={() => onSelectDate(ymd)}
                      sx={{
                        minWidth: 0,
                        px: 0,
                        aspectRatio: '1',
                        borderRadius: 2,
                        opacity: disabled ? 0.35 : 1,
                      }}
                    >
                      {parseYmd(ymd).day}
                    </Button>
                  )
                })}
              </Box>
            ))}
          </Stack>
          {!rangeLoading && byDate.size === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              {t('book.noSlotsMonth')}
            </Alert>
          ) : null}
        </Paper>
      ) : null}

      {showTime ? (
        <Paper sx={{ p: { xs: 2, sm: 3 } }} component="section" aria-labelledby="step-time">
          <Typography id="step-time" variant="h2" sx={{ fontSize: '1.15rem', mb: 2 }}>
            {t('book.step.time')}
          </Typography>
          {daySlots.length === 0 ? (
            <Alert severity="info">{t('book.noSlotsDay')}</Alert>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {daySlots.map((startAt) => (
                <Chip
                  key={startAt}
                  label={formatViennaTime(startAt, intlLocale)}
                  clickable
                  color={selectedStartAt === startAt ? 'primary' : 'default'}
                  variant={selectedStartAt === startAt ? 'filled' : 'outlined'}
                  onClick={() => onSelectTime(startAt)}
                />
              ))}
            </Box>
          )}
        </Paper>
      ) : null}

      {showDetails ? (
        <Paper sx={{ p: { xs: 2, sm: 3 } }} component="section" aria-labelledby="step-details">
          <Typography id="step-details" variant="h2" sx={{ fontSize: '1.15rem', mb: 2 }}>
            {t('book.step.details')}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label={t('book.firstName')}
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
              fullWidth
              autoComplete="given-name"
            />
            <TextField
              label={t('book.lastName')}
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
              fullWidth
              autoComplete="family-name"
            />
            <TextField
              label={t('book.phone')}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              fullWidth
              autoComplete="tel"
              helperText={t('book.phoneHelp')}
            />
          </Stack>
        </Paper>
      ) : null}

      {showConfirm ? (
        <Paper sx={{ p: { xs: 2, sm: 3 } }} component="section" aria-labelledby="step-confirm">
          <Typography id="step-confirm" variant="h2" sx={{ fontSize: '1.15rem', mb: 2 }}>
            {t('book.step.confirm')}
          </Typography>
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 600 }}>{selectedService?.name}</Typography>
            {selectedStartAt ? (
              <Typography color="text.secondary">
                {formatViennaDateTime(selectedStartAt, intlLocale)}
              </Typography>
            ) : null}
            {selectedService ? (
              <Typography color="text.secondary">
                {t('book.durationMinutes', { minutes: selectedService.durationMinutes })} ·{' '}
                {formatPrice(selectedService.priceCents)}
              </Typography>
            ) : null}
          </Stack>
          <FormControlLabel
            control={
              <Checkbox
                checked={privacyAccepted}
                onChange={(event) => setPrivacyAccepted(event.target.checked)}
              />
            }
            label={t('book.privacy')}
          />
          {fieldError ? <Alert severity="error">{fieldError}</Alert> : null}
          {submitError ? <Alert severity="error">{submitError}</Alert> : null}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              disabled={isSubmitting}
              onClick={() => {
                const result = v.safeParse(bookingContactSchema, {
                  firstName: firstName.trim(),
                  lastName: lastName.trim(),
                  phone,
                  privacyAccepted: privacyAccepted ? true : false,
                })
                if (!result.success) {
                  const message = result.issues[0]?.message ?? '…'
                  setFieldError(message)
                  return
                }
                setFieldError(null)
                onSubmit({
                  firstName: result.output.firstName,
                  lastName: result.output.lastName,
                  phone: result.output.phone,
                  privacyAccepted: true,
                })
              }}
            >
              {isSubmitting ? t('book.submitting') : t('book.submit')}
            </Button>
            <Button disabled={isSubmitting} onClick={onClearTime}>
              {t('book.otherTime')}
            </Button>
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  )
}
