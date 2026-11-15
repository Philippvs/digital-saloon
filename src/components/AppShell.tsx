import type * as React from 'react'
import {
  AppBar,
  Box,
  Button,
  Container,
  Link,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'

import { telHref } from '../data/phone'
import type { Salon } from '../data/schemas'
import { useLocale } from '../i18n'
import { localeLabels, locales, type Locale } from '../i18n'
import { brand } from '../theme'
import { HeaderWordmark } from './Wordmark'

export type AppShellProps = {
  salon: Salon | null
  email: string | null
  /** `full` lets the page own its width (home page bands); `wide` suits dashboards. */
  contentWidth: 'contained' | 'wide' | 'full'
  onHomeClick: () => void
  onBookClick: () => void
  onMyBookingsClick: () => void
  onLoginClick: () => void
  onAdminClick: () => void
  onSignOutClick: () => void
  children: React.ReactNode
}

export const AppShell: React.FunctionComponent<AppShellProps> = ({
  salon,
  email,
  contentWidth,
  onHomeClick,
  onBookClick,
  onMyBookingsClick,
  onLoginClick,
  onAdminClick,
  onSignOutClick,
  children,
}) => {
  const { locale, setLocale, t } = useLocale()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="static"
        elevation={0}
        color="inherit"
        sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1, flexWrap: 'wrap', minHeight: { xs: 64, sm: 72 } }}>
            <Box sx={{ flexGrow: 1 }}>
              <HeaderWordmark label={t('nav.home')} onClick={onHomeClick} />
            </Box>
            <Select
              size="small"
              value={locale}
              aria-label={t('nav.language')}
              onChange={(event) => {
                setLocale(event.target.value as Locale)
              }}
              sx={{ minWidth: 110, fontSize: '0.875rem' }}
            >
              {locales.map((code) => (
                <MenuItem key={code} value={code}>
                  {localeLabels[code]}
                </MenuItem>
              ))}
            </Select>
            <Button color="primary" size="small" onClick={onMyBookingsClick}>
              {t('nav.myBookings')}
            </Button>
            {email ? (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: { xs: 'none', md: 'block' } }}
                >
                  {email}
                </Typography>
                <Button color="primary" size="small" onClick={onAdminClick}>
                  {t('nav.admin')}
                </Button>
                <Button color="primary" size="small" onClick={onSignOutClick}>
                  {t('nav.signOut')}
                </Button>
              </>
            ) : (
              <Button color="primary" size="small" onClick={onLoginClick}>
                {t('nav.admin')}
              </Button>
            )}
            <Button variant="contained" color="primary" onClick={onBookClick}>
              {t('nav.book')}
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {contentWidth === 'full' ? (
          children
        ) : (
          <Container maxWidth={contentWidth === 'wide' ? 'lg' : 'md'} sx={{ py: { xs: 4, sm: 6 } }}>
            {children}
          </Container>
        )}
      </Box>

      <Box component="footer" sx={{ bgcolor: brand.espresso, color: brand.paper, py: 5 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2, sm: 6 }}
            sx={{ alignItems: { sm: 'baseline' } }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
              <Box component="span" sx={{ color: brand.orange }}>
                KIMM
              </Box>{' '}
              <Box component="span" sx={{ fontWeight: 300 }}>
                HAIR
              </Box>
            </Typography>
            {salon ? (
              <>
                <Typography variant="body2">{salon.address}</Typography>
                <Link href={telHref(salon.phone)} variant="body2" sx={{ color: 'inherit' }}>
                  {salon.phone}
                </Link>
                {salon.vatId ? (
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {t('footer.vatId')} {salon.vatId}
                  </Typography>
                ) : null}
              </>
            ) : null}
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
