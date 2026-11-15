import type * as React from 'react'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'

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
          <Button color="inherit" size="small" onClick={onMyBookingsClick}>
            Meine Termine
          </Button>
          {email ? (
            <>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {email}
              </Typography>
              <Button color="inherit" onClick={onAdminClick}>
                Admin
              </Button>
              <Button color="inherit" onClick={onSignOutClick}>
                Abmelden
              </Button>
            </>
          ) : (
            <Button color="inherit" size="small" onClick={onLoginClick}>
              Admin
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
