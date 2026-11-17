import type * as React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

import { useLocale } from '../i18n'

export type AdminView = 'week' | 'list'

export type AdminViewSwitchProps = {
  value: AdminView
  onWeekClick: () => void
  onListClick: () => void
}

/** Week planner and appointment list are two views of the same bookings. */
export const AdminViewSwitch: React.FunctionComponent<AdminViewSwitchProps> = ({
  value,
  onWeekClick,
  onListClick,
}) => {
  const { t } = useLocale()

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      aria-label={t('admin.viewLabel')}
      onChange={(_event, next: AdminView | null) => {
        if (next === 'week') onWeekClick()
        if (next === 'list') onListClick()
      }}
      sx={{ '& .MuiToggleButton-root': { px: 2, textTransform: 'none', fontWeight: 600 } }}
    >
      <ToggleButton value="week">{t('admin.viewWeek')}</ToggleButton>
      <ToggleButton value="list">{t('admin.viewList')}</ToggleButton>
    </ToggleButtonGroup>
  )
}
