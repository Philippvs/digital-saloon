import { styled } from '@mui/material/styles'

import { brand } from '../theme'

export const Header = styled('header')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  backgroundColor: 'rgba(255, 255, 255, 0.96)',
  backdropFilter: 'saturate(1.2) blur(6px)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .header-inner': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    minHeight: 72,
    minWidth: 0,
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(0.75),
      minHeight: 56,
      paddingInline: theme.spacing(1.5),
    },
  },
  '& .header-nav': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    marginLeft: 'auto',
    minWidth: 0,
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(0.25),
    },
  },
}))

export const NavLink = styled('button')(({ theme }) => ({
  padding: theme.spacing(1, 0),
  border: 0,
  background: 'none',
  color: brand.espresso,
  font: 'inherit',
  fontSize: '0.9375rem',
  fontWeight: 500,
  cursor: 'pointer',
  textDecoration: 'underline',
  textDecorationColor: 'transparent',
  textDecorationThickness: 2,
  textUnderlineOffset: 6,
  transition: 'text-decoration-color 120ms ease',
  '&:hover': { textDecorationColor: brand.orange },
  '&:focus-visible': {
    outline: `2px solid ${brand.orange}`,
    outlineOffset: 2,
  },
  [theme.breakpoints.down('sm')]: {
    '& button': { minWidth: 28, paddingInline: 4 },
  },
}))

export const LanguageSwitch = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& button': {
    minWidth: 32,
    padding: '6px 6px',
    border: 0,
    background: 'none',
    color: brand.espressoMuted,
    font: 'inherit',
    fontSize: '0.8125rem',
    fontWeight: 500,
    letterSpacing: '0.04em',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
  },
  '& button + button': {
    borderLeft: `1px solid rgba(74, 54, 49, 0.2)`,
  },
  '& button[aria-pressed="true"]': {
    color: brand.espresso,
    fontWeight: 700,
    borderBottomColor: brand.orange,
  },
  '& button:hover': { color: brand.espresso },
  '& button:focus-visible': {
    outline: `2px solid ${brand.orange}`,
    outlineOffset: 2,
  },
  [theme.breakpoints.down('sm')]: {
    '& button': { minWidth: 28, paddingInline: 4 },
  },
}))
