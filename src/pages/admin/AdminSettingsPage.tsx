import type * as React from 'react'
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import type { BookingSettings, ConfirmationMode, Salon, SalonDetails } from '../../data/schemas'
import {
  bookingNumbersOf,
  defaultBookingSettings,
  salonDetailsInputOf,
  slotIntervalChoices,
  validateBookingRules,
  validateSalonDetails,
  type BookingNumberField,
  type SalonDetailsField,
} from '../../data/settingsForm'
import { fieldIssueMessages } from '../../components/fieldIssueMessages'
import { useLocale } from '../../i18n'

export type SaveState = {
  saving: boolean
  saved: boolean
  error: string | null
}

export type AdminSettingsPageProps = {
  settings: BookingSettings | null | undefined
  settingsLoading: boolean
  settingsError: boolean
  settingsSave: SaveState
  onSaveSettings: (settings: BookingSettings) => void
  salon: Salon | null | undefined
  salonLoading: boolean
  salonSave: SaveState
  onSaveSalon: (details: SalonDetails) => void
  onOpeningHoursClick: () => void
  onBackClick: () => void
}

type SaveFeedbackProps = {
  save: SaveState
  dirty: boolean
}

const SaveFeedback: React.FunctionComponent<SaveFeedbackProps> = ({ save, dirty }) => {
  const { t } = useLocale()
  if (save.error) {
    return <Alert severity="error">{t('admin.saveFailed', { message: save.error })}</Alert>
  }
  if (save.saved && !dirty) {
    return (
      <Typography role="status" sx={{ color: 'success.main', fontWeight: 600 }}>
        {t('admin.saved')}
      </Typography>
    )
  }
  return null
}

type BookingRulesFormProps = {
  initial: BookingSettings
  save: SaveState
  onSave: (settings: BookingSettings) => void
}

const BookingRulesForm: React.FunctionComponent<BookingRulesFormProps> = ({
  initial,
  save,
  onSave,
}) => {
  const { t } = useLocale()
  const [mode, setMode] = useState<ConfirmationMode>(initial.confirmationMode)
  const [slotInterval, setSlotInterval] = useState(initial.slotIntervalMinutes)
  const [numbers, setNumbers] = useState(bookingNumbersOf(initial))
  const [errors, setErrors] = useState<Partial<Record<BookingNumberField, string>>>({})
  const [dirty, setDirty] = useState(false)
  const intervalOptions = slotIntervalChoices(initial.slotIntervalMinutes)

  const numberField = (field: BookingNumberField, label: string, unit: string, hint: string) => (
    <TextField
      label={label}
      value={numbers[field]}
      onChange={(event) => {
        setNumbers((current) => ({ ...current, [field]: event.target.value }))
        setDirty(true)
      }}
      error={errors[field] !== undefined}
      helperText={errors[field] ?? hint}
      slotProps={{
        htmlInput: { inputMode: 'numeric' },
        input: { endAdornment: <InputAdornment position="end">{unit}</InputAdornment> },
      }}
      sx={{ maxWidth: 360 }}
    />
  )

  return (
    <Box
      component="form"
      noValidate
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const result = validateBookingRules({
          confirmationMode: mode,
          slotIntervalMinutes: slotInterval,
          numbers,
        })
        if (!result.ok) {
          setErrors(fieldIssueMessages(t, result.issues))
          return
        }
        setErrors({})
        setDirty(false)
        onSave(result.value)
      }}
    >
      <Stack spacing={3}>
        <FormControl>
          <FormLabel id="settings-mode" sx={{ mb: 1, color: 'text.primary', fontWeight: 600 }}>
            {t('admin.confirmationMode')}
          </FormLabel>
          <RadioGroup
            aria-labelledby="settings-mode"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value === 'MANUAL' ? 'MANUAL' : 'AUTOMATIC')
              setDirty(true)
            }}
          >
            <FormControlLabel
              value="AUTOMATIC"
              control={<Radio />}
              label={
                <Box>
                  <Typography>{t('admin.modeAutomatic')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.modeAutomaticHint')}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', mb: 1, '& .MuiRadio-root': { pt: 0.5 } }}
            />
            <FormControlLabel
              value="MANUAL"
              control={<Radio />}
              label={
                <Box>
                  <Typography>{t('admin.modeManual')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.modeManualHint')}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', '& .MuiRadio-root': { pt: 0.5 } }}
            />
          </RadioGroup>
        </FormControl>

        <TextField
          select
          label={t('admin.slotInterval')}
          value={slotInterval}
          onChange={(event) => {
            setSlotInterval(Number(event.target.value))
            setDirty(true)
          }}
          helperText={t('admin.slotIntervalHint')}
          sx={{ maxWidth: 360 }}
        >
          {intervalOptions.map((minutes) => (
            <MenuItem key={minutes} value={minutes}>
              {minutes} {t('admin.unitMinutes')}
            </MenuItem>
          ))}
        </TextField>

        {numberField(
          'minAdvanceBookingMinutes',
          t('admin.minAdvance'),
          t('admin.unitMinutes'),
          t('admin.minAdvanceHint'),
        )}
        {numberField(
          'maxAdvanceBookingDays',
          t('admin.maxAdvance'),
          t('admin.unitDays'),
          t('admin.maxAdvanceHint'),
        )}
        {numberField(
          'pendingExpirationHours',
          t('admin.pendingExpiration'),
          t('admin.unitHours'),
          t('admin.pendingExpirationHint'),
        )}

        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Button type="submit" variant="contained" disabled={save.saving}>
            {save.saving ? t('admin.saving') : t('admin.save')}
          </Button>
          <SaveFeedback save={save} dirty={dirty} />
        </Stack>
      </Stack>
    </Box>
  )
}

type SalonDetailsFormProps = {
  initial: Salon
  save: SaveState
  onSave: (details: SalonDetails) => void
}

const SalonDetailsForm: React.FunctionComponent<SalonDetailsFormProps> = ({
  initial,
  save,
  onSave,
}) => {
  const { t } = useLocale()
  const [values, setValues] = useState(salonDetailsInputOf(initial))
  const [errors, setErrors] = useState<Partial<Record<SalonDetailsField, string>>>({})
  const [dirty, setDirty] = useState(false)

  const field = (name: SalonDetailsField, label: string, autoComplete: string) => (
    <TextField
      label={label}
      value={values[name]}
      onChange={(event) => {
        setValues((current) => ({ ...current, [name]: event.target.value }))
        setDirty(true)
      }}
      error={errors[name] !== undefined}
      helperText={errors[name]}
      required={name !== 'vatId'}
      autoComplete={autoComplete}
      fullWidth
    />
  )

  return (
    <Box
      component="form"
      noValidate
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const result = validateSalonDetails(values)
        if (!result.ok) {
          setErrors(fieldIssueMessages(t, result.issues))
          return
        }
        setErrors({})
        setDirty(false)
        onSave(result.value)
      }}
    >
      <Stack spacing={2.5}>
        {field('name', t('admin.fieldName'), 'organization')}
        {field('address', t('admin.fieldAddress'), 'street-address')}
        {field('phone', t('admin.fieldPhone'), 'tel')}
        {field('email', t('admin.fieldEmail'), 'email')}
        {field('vatId', t('admin.fieldVatId'), 'off')}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Button type="submit" variant="contained" disabled={save.saving}>
            {save.saving ? t('admin.saving') : t('admin.save')}
          </Button>
          <SaveFeedback save={save} dirty={dirty} />
        </Stack>
      </Stack>
    </Box>
  )
}

export const AdminSettingsPage: React.FunctionComponent<AdminSettingsPageProps> = ({
  settings,
  settingsLoading,
  settingsError,
  settingsSave,
  onSaveSettings,
  salon,
  salonLoading,
  salonSave,
  onSaveSalon,
  onOpeningHoursClick,
  onBackClick,
}) => {
  const { t } = useLocale()

  return (
    <Stack spacing={4} sx={{ maxWidth: 760 }}>
      <Box>
        <Button onClick={onBackClick} sx={{ ml: -1, mb: 1 }}>
          {t('admin.backToDashboard')}
        </Button>
        <Typography variant="h1">{t('admin.settings')}</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {t('admin.settingsSubtitle')}
        </Typography>
      </Box>

      <Paper
        component="button"
        type="button"
        onClick={onOpeningHoursClick}
        sx={{
          p: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          textAlign: 'left',
          font: 'inherit',
          color: 'inherit',
          bgcolor: 'background.paper',
          cursor: 'pointer',
          '&:hover, &:focus-visible': { borderColor: 'primary.main' },
        }}
      >
        <ScheduleOutlinedIcon color="primary" />
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1.125rem' }}>{t('hours.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('hours.absencesHint')}
          </Typography>
        </Box>
        <ChevronRightIcon color="action" />
      </Paper>

      <Paper component="section" aria-labelledby="settings-booking" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography id="settings-booking" variant="h2" sx={{ mb: 2.5 }}>
          {t('admin.bookingRulesTitle')}
        </Typography>
        {settingsLoading ? <CircularProgress aria-label={t('admin.settingsLoading')} /> : null}
        {settingsError ? <Alert severity="error">{t('admin.settingsError')}</Alert> : null}
        {!settingsLoading && !settingsError ? (
          <BookingRulesForm
            initial={settings ?? defaultBookingSettings}
            save={settingsSave}
            onSave={onSaveSettings}
          />
        ) : null}
      </Paper>

      <Paper component="section" aria-labelledby="settings-salon" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography id="settings-salon" variant="h2" sx={{ mb: 0.5 }}>
          {t('admin.salonDetailsTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {t('admin.salonDetailsHint')}
        </Typography>
        {salonLoading ? <CircularProgress aria-label={t('admin.loading')} /> : null}
        {salon ? <SalonDetailsForm initial={salon} save={salonSave} onSave={onSaveSalon} /> : null}
      </Paper>
    </Stack>
  )
}
