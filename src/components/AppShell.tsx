import type * as React from 'react'
import { Box, Button, Container, IconButton, Link, Stack, Typography } from '@mui/material'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'

import { telHref } from '../data/phone'
import type { Salon } from '../data/schemas'
import { useLocale } from '../i18n'
import { localeLabels, locales } from '../i18n'
import { brand } from '../theme'
import { Header, LanguageSwitch, NavLink, StaffBar } from './AppShell.styles'
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
      {email ? (
        <StaffBar>
          <Container maxWidth="lg" className="staff-inner">
            <span className="staff-email">{t('nav.signedInAs', { email })}</span>
            <button type="button" onClick={onAdminClick}>
              {t('nav.staffCalendar')}
            </button>
            <button type="button" onClick={onSignOutClick}>
              {t('nav.signOut')}
            </button>
          </Container>
        </StaffBar>
      ) : null}

      <Header>
        <Container maxWidth="lg" className="header-inner">
          <HeaderWordmark label={t('nav.home')} onClick={onHomeClick} />
          <nav className="header-nav" aria-label={t('nav.main')}>
            <NavLink
              type="button"
              onClick={onMyBookingsClick}
              sx={{ display: { xs: 'none', sm: 'inline' } }}
            >
              {t('nav.myBookings')}
            </NavLink>
            <IconButton
              aria-label={t('nav.myBookings')}
              onClick={onMyBookingsClick}
              sx={{ display: { xs: 'inline-flex', sm: 'none' }, color: 'primary.main' }}
            >
              <EventNoteOutlinedIcon />
            </IconButton>
            <LanguageSwitch role="group" aria-label={t('nav.language')}>
              {locales.map((code) => (
                <button
                  key={code}
                  type="button"
                  lang={code}
                  aria-label={localeLabels[code]}
                  aria-pressed={code === locale}
                  onClick={() => setLocale(code)}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </LanguageSwitch>
            <Button
              variant="contained"
              color="primary"
              onClick={onBookClick}
              sx={{ whiteSpace: 'nowrap', px: { xs: 1.5, sm: 2.5 } }}
            >
              {t('nav.book')}
            </Button>
          </nav>
        </Container>
      </Header>

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
            {email ? null : (
              <Box
                component="button"
                type="button"
                onClick={onLoginClick}
                sx={{
                  ml: { sm: 'auto !important' },
                  alignSelf: { xs: 'flex-start', sm: 'baseline' },
                  p: 0,
                  border: 0,
                  background: 'none',
                  color: 'inherit',
                  font: 'inherit',
                  fontSize: '0.875rem',
                  opacity: 0.7,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: 4,
                  '&:hover, &:focus-visible': { opacity: 1 },
                }}
              >
                {t('nav.staffLogin')}
              </Box>
            )}
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
