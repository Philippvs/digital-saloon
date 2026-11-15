import type * as React from 'react'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'

export type AppShellProps = {
  title: string
  email: string | null
  onHomeClick: () => void
  onLoginClick: () => void
  onSignOutClick: () => void
  children: React.ReactNode
}

export const AppShell: React.FunctionComponent<AppShellProps> = ({
  title,
  email,
  onHomeClick,
  onLoginClick,
  onSignOutClick,
  children,
}) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} color="primary">
        <Toolbar sx={{ gap: 2 }}>
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
          {email ? (
            <>
              <Typography variant="body2">{email}</Typography>
              <Button color="inherit" onClick={onSignOutClick}>
                Sign out
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={onLoginClick}>
              Sign in
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
