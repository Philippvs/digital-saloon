import type * as React from 'react'
import {
  AppBar,
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from '@mui/material'

import { useLocale } from '../i18n'
import { localeLabels, locales, type Locale } from '../i18n'

export type AppShellProps = {
  title: string
  email: string | null
  onHomeClick: () => void
  onMyBookingsClick: () => void
  onLoginClick: () => void
  onAdminClick: () => void
  onSignOutClick: () => void
  children: React.ReactNode
}

export const AppShell: React.FunctionComponent<AppShellProps> = ({
  title,
  email,
  onHomeClick,
  onMyBookingsClick,
  onLoginClick,
  onAdminClick,
  onSignOutClick,
  children,
}) => {
  const { locale, setLocale, t } = useLocale()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} color="primary">
        <Toolbar sx={{ gap: 1.5, flexWrap: 'wrap' }}>
          <Typography
            variant="h6"
            component="button"
            onClick={onHomeClick}
            sx={{
              flexGrow: 1,
              textAlign: 'left',
              background: 'none',
              border: 0,
              color: 'inherit',
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            {title}
          </Typography>
          <Select
            size="small"
            value={locale}
            aria-label={t('nav.language')}
            onChange={(event) => {
              setLocale(event.target.value as Locale)
            }}
            sx={{
              color: 'inherit',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.35)' },
              '.MuiSvgIcon-root': { color: 'inherit' },
              minWidth: 110,
            }}
          >
            {locales.map((code) => (
              <MenuItem key={code} value={code}>
                {localeLabels[code]}
              </MenuItem>
            ))}
          </Select>
          <Button color="inherit" size="small" onClick={onMyBookingsClick}>
            {t('nav.myBookings')}
          </Button>
          {email ? (
            <>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {email}
              </Typography>
              <Button color="inherit" onClick={onAdminClick}>
                {t('nav.admin')}
              </Button>
              <Button color="inherit" onClick={onSignOutClick}>
                {t('nav.signOut')}
              </Button>
            </>
          ) : (
            <Button color="inherit" size="small" onClick={onLoginClick}>
              {t('nav.admin')}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  )
}
