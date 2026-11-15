import { createTheme } from '@mui/material/styles'

/** KIMM Hair brand colors, taken from the salon's logo. */
export const brand = {
  orange: '#E2701F',
  orangeDeep: '#B9540E',
  espresso: '#4A3631',
  espressoMuted: '#7A6862',
  stone: '#F2EEEB',
  paper: '#FFFFFF',
} as const

const fontFamily = '"Archivo Variable", "Helvetica Neue", Arial, sans-serif'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brand.espresso,
      contrastText: brand.paper,
    },
    secondary: {
      main: brand.orange,
      dark: brand.orangeDeep,
      contrastText: brand.espresso,
    },
    text: {
      primary: brand.espresso,
      secondary: brand.espressoMuted,
    },
    divider: 'rgba(74, 54, 49, 0.16)',
    background: {
      default: brand.paper,
      paper: brand.paper,
    },
  },
  typography: {
    fontFamily,
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: 0,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: '1px solid rgba(74, 54, 49, 0.16)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '1rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          fontWeight: 600,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: brand.orangeDeep,
          textUnderlineOffset: '3px',
        },
      },
    },
  },
})
