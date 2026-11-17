import { createTheme } from '@mui/material/styles'

const isSalon1500 =
  typeof import.meta.env.VITE_BRAND === 'string' &&
  import.meta.env.VITE_BRAND.trim().toLowerCase() === 'salon1500'

/** Active salon brand colors (KIMM Hair or Salon 1500 via VITE_BRAND). */
export const brand = isSalon1500
  ? ({
      orange: '#DFBFA4',
      orangeDeep: '#9A7656',
      espresso: '#000000',
      espressoMuted: '#54595F',
      stone: '#FAF6F2',
      paper: '#FFFFFF',
    } as const)
  : ({
      orange: '#E2701F',
      orangeDeep: '#B9540E',
      espresso: '#4A3631',
      espressoMuted: '#7A6862',
      stone: '#F2EEEB',
      paper: '#FFFFFF',
    } as const)

const dividerColor = isSalon1500 ? 'rgba(0, 0, 0, 0.14)' : 'rgba(74, 54, 49, 0.16)'
const fontFamily = isSalon1500
  ? '"Roboto Condensed", "Helvetica Neue", Arial, sans-serif'
  : '"Archivo Variable", "Helvetica Neue", Arial, sans-serif'
const headingFontFamily = isSalon1500
  ? '"Cormorant SC", Georgia, serif'
  : '"Archivo Variable", "Helvetica Neue", Arial, sans-serif'

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
    divider: dividerColor,
    background: {
      default: brand.paper,
      paper: brand.paper,
    },
  },
  typography: {
    fontFamily,
    h1: {
      fontFamily: headingFontFamily,
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: headingFontFamily,
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
    MuiCssBaseline: {
      styleOverrides: {
        // App feel: no rubber-band overscroll and no pinch / double-tap zoom.
        'html, body': {
          overscrollBehavior: 'none',
          touchAction: 'pan-x pan-y',
          WebkitTextSizeAdjust: '100%',
        },
        body: {
          WebkitTapHighlightColor: 'transparent',
        },
      },
    },
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
