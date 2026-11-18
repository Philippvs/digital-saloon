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
  Chip,
  Paper,
  Radio,
  Switch,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import type { NewAccountInput, StaffOverview } from '../../data/adminAccessApi'
import { emptySalon } from '../../data/salon'
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
  isOperator?: boolean
  isPrimaryAdmin?: boolean
  demoMode?: {
    enabled: boolean
    loading: boolean
    saving: boolean
    error: string | null
    onToggle: (enabled: boolean) => void
  }
  staffOverview?: StaffOverview
  onCreateFirstAdmin?: (input: NewAccountInput) => Promise<void>
  onCreateEmployee?: (input: NewAccountInput) => Promise<void>
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

type NewAccountFormProps = {
  buttonLabel: string
  successMessage: string
  onCreate: (input: NewAccountInput) => Promise<void>
}

const NewAccountForm: React.FunctionComponent<NewAccountFormProps> = ({
  buttonLabel,
  successMessage,
  onCreate,
}) => {
  const { t } = useLocale()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setCreated(false)
    setSubmitting(true)
    try {
      await onCreate({ displayName, email, password })
      setDisplayName('')
      setEmail('')
      setPassword('')
      setCreated(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={(event) => void handleSubmit(event)} sx={{ maxWidth: 420 }}>
      <Stack spacing={2}>
        <TextField
          label={t('admin.accountDisplayName')}
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          required
          fullWidth
          size="small"
        />
        <TextField
          label={t('admin.accountEmail')}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          fullWidth
          size="small"
        />
        <TextField
          label={t('admin.accountPassword')}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          fullWidth
          size="small"
          slotProps={{ htmlInput: { minLength: 8 } }}
        />
        {error ? <Alert severity="error">{error}</Alert> : null}
        {created ? (
          <Typography role="status" sx={{ color: 'success.main', fontWeight: 600 }}>
            {successMessage}
          </Typography>
        ) : null}
        <Box>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? t('admin.saving') : buttonLabel}
          </Button>
        </Box>
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
  isOperator,
  isPrimaryAdmin,
  demoMode,
  staffOverview,
  onCreateFirstAdmin,
  onCreateEmployee,
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
        {!salonLoading ? (
          <SalonDetailsForm
            key={salon ? 'loaded' : 'empty'}
            initial={salon ?? emptySalon}
            save={salonSave}
            onSave={onSaveSalon}
          />
        ) : null}
      </Paper>

      {isOperator && demoMode ? (
        <Paper component="section" aria-labelledby="settings-demo" sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography id="settings-demo" variant="h2" sx={{ mb: 0.5 }}>
            {t('admin.demoModeTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('admin.demoModeHint')}
          </Typography>
          {demoMode.loading ? (
            <CircularProgress size={24} />
          ) : (
            <FormControlLabel
              control={
                <Switch
                  checked={demoMode.enabled}
                  disabled={demoMode.saving}
                  onChange={(event) => demoMode.onToggle(event.target.checked)}
                />
              }
              label={t('admin.demoModeSwitch')}
            />
          )}
          {demoMode.error ? (
            <Alert severity="error" sx={{ mt: 1.5 }}>
              {demoMode.error}
            </Alert>
          ) : null}
        </Paper>
      ) : null}

      {isOperator && onCreateFirstAdmin ? (
        <Paper
          component="section"
          aria-labelledby="settings-first-admin"
          sx={{ p: { xs: 2, sm: 3 } }}
        >
          <Typography id="settings-first-admin" variant="h2" sx={{ mb: 0.5 }}>
            {t('admin.firstAdminTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('admin.firstAdminHint')}
          </Typography>
          {staffOverview?.hasPrimaryAdmin ? (
            <Alert severity="info">{t('admin.firstAdminAlreadyExists')}</Alert>
          ) : (
            <NewAccountForm
              buttonLabel={t('admin.firstAdminCreateButton')}
              successMessage={t('admin.firstAdminCreated')}
              onCreate={onCreateFirstAdmin}
            />
          )}
        </Paper>
      ) : null}

      {isPrimaryAdmin && onCreateEmployee ? (
        <Paper
          component="section"
          aria-labelledby="settings-employees"
          sx={{ p: { xs: 2, sm: 3 } }}
        >
          <Typography id="settings-employees" variant="h2" sx={{ mb: 0.5 }}>
            {t('admin.employeesTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('admin.employeesHint')}
          </Typography>
          {staffOverview && staffOverview.staff.length > 0 ? (
            <Stack spacing={1} sx={{ mb: 2.5 }}>
              {staffOverview.staff.map((member) => (
                <Box
                  key={member.uid}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 0.75,
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }}>{member.displayName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.email}
                  </Typography>
                  {member.isPrimaryAdmin ? (
                    <Chip size="small" label={t('admin.primaryAdminBadge')} />
                  ) : null}
                </Box>
              ))}
            </Stack>
          ) : null}
          <NewAccountForm
            buttonLabel={t('admin.employeeCreateButton')}
            successMessage={t('admin.employeeCreated')}
            onCreate={onCreateEmployee}
          />
        </Paper>
      ) : null}
    </Stack>
  )
}
