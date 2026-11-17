import { styled } from '@mui/material/styles'

import { brand } from '../../theme'

export const WeekTotals = styled('dl')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1, 3),
  margin: 0,
  '& > div': {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  '& dt': {
    fontSize: '0.8125rem',
    color: theme.palette.text.secondary,
  },
  '& dd': {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    fontVariantNumeric: 'tabular-nums',
    color: brand.espresso,
  },
}))

export const WeekTitle = styled('h1')(({ theme }) => ({
  margin: 0,
  fontSize: '2.25rem',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1.05,
  fontVariantNumeric: 'tabular-nums',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.75rem',
  },
}))
