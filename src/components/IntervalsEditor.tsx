import type * as React from 'react'
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

import {
  intervalIssues,
  nextIntervalSuggestion,
  type IntervalIssue,
} from '../data/openingHoursForm'
import type { TimeInterval } from '../data/schemas'
import { useLocale } from '../i18n'

export type IntervalsEditorProps = {
  intervals: readonly TimeInterval[]
  onChange: (intervals: TimeInterval[]) => void
  /** Accessible prefix for the inputs, e.g. the weekday name. */
  label: string
  /** Allow removing the last interval (weekly rows use the open/closed switch instead). */
  allowEmpty?: boolean
}

const issueKey = {
  invalid: 'hours.intervalInvalid',
  order: 'hours.intervalOrder',
  overlap: 'hours.intervalOverlap',
} as const satisfies Record<IntervalIssue, string>

export const IntervalsEditor: React.FunctionComponent<IntervalsEditorProps> = ({
  intervals,
  onChange,
  label,
  allowEmpty = false,
}) => {
  const { t } = useLocale()
  const issues = intervalIssues(intervals)

  const update = (index: number, patch: Partial<TimeInterval>) => {
    onChange(intervals.map((interval, i) => (i === index ? { ...interval, ...patch } : interval)))
  }

  return (
    <Stack spacing={1}>
      {intervals.map((interval, index) => {
        const issue = issues[index]
        return (
          <Box key={index}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <TextField
                type="time"
                size="small"
                label={t('hours.from')}
                value={interval.start}
                error={issue !== undefined}
                onChange={(event) => update(index, { start: event.target.value })}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { step: 900, 'aria-label': `${label} ${t('hours.from')}` },
                }}
                sx={{ width: 132 }}
              />
              <Typography aria-hidden color="text.secondary">
                –
              </Typography>
              <TextField
                type="time"
                size="small"
                label={t('hours.to')}
                value={interval.end}
                error={issue !== undefined}
                onChange={(event) => update(index, { end: event.target.value })}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { step: 900, 'aria-label': `${label} ${t('hours.to')}` },
                }}
                sx={{ width: 132 }}
              />
              {intervals.length > 1 || allowEmpty ? (
                <IconButton
                  size="small"
                  aria-label={`${label}: ${t('hours.removeInterval')}`}
                  onClick={() => onChange(intervals.filter((_, i) => i !== index))}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null}
            </Stack>
            {issue ? (
              <Typography variant="caption" color="error" role="alert">
                {t(issueKey[issue])}
              </Typography>
            ) : null}
          </Box>
        )
      })}
      <Box>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => onChange([...intervals, nextIntervalSuggestion(intervals)])}
          sx={{ ml: -0.5 }}
        >
          {t('hours.addInterval')}
        </Button>
      </Box>
    </Stack>
  )
}
