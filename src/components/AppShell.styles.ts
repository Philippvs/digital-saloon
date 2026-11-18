import { IconButton } from '@mui/material'
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

/**
 * Every underlined header item (links, phone icons, language switch) shares this box,
 * so their underlines sit on one line at every width.
 */
const navItemHeight = 40
const navUnderline = {
  boxSizing: 'border-box',
  height: navItemHeight,
  borderBottom: '2px solid transparent',
} as const

export const NavLink = styled('button')(({ theme }) => ({
  border: 0,
  ...navUnderline,
  alignItems: 'center',
  padding: theme.spacing(0, 0.25),
  background: 'none',
  color: brand.espresso,
  font: 'inherit',
  fontSize: '0.9375rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'border-color 120ms ease',
  '&:hover': { borderBottomColor: brand.orange },
  '&[aria-current="page"]': { borderBottomColor: brand.orange },
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
    border: 0,
    ...navUnderline,
    minWidth: 32,
    padding: '0 6px',
    background: 'none',
    color: brand.espressoMuted,
    font: 'inherit',
    fontSize: '0.8125rem',
    fontWeight: 500,
    letterSpacing: '0.04em',
    cursor: 'pointer',
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

/** Phone-width header icon; the current page gets the same orange underline as `NavLink`. */
export const NavIconButton = styled(IconButton)(({ theme }) => ({
  ...navUnderline,
  width: navItemHeight,
  padding: 0,
  color: theme.palette.primary.main,
  borderRadius: 0,
  '&[aria-current="page"]': { borderBottomColor: brand.orange },
}))

export const FooterLink = styled('button')({
  padding: 0,
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
})
