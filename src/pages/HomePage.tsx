import type * as React from 'react'
import { Box, Button, CircularProgress, Container, Link, Typography } from '@mui/material'

import { parseYmd, viennaTodayYmd } from '../data/bookingCalendar'
import type { OpeningHoursByWeekday } from '../data/openingHours'
import { telHref } from '../data/phone'
import type { Salon, Weekday } from '../data/schemas'
import type { ServiceWithId } from '../data/services'
import { HeroWordmark } from '../components/Wordmark'
import { useLocale } from '../i18n'
import { brand } from '../theme'
import { HoursList, PriceList, PriceRow } from './HomePage.styles'

export type HomePageProps = {
  salon: Salon | null
  services: ServiceWithId[] | undefined
  servicesLoading: boolean
  servicesError: boolean
  openingHours: OpeningHoursByWeekday | undefined
  openingHoursLoading: boolean
  openingHoursError: boolean
  onBookClick: () => void
  onServiceClick: (serviceId: string) => void
}

const weekdaysFromMonday: readonly Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

function mapsHref(salon: Salon): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${salon.name}, ${salon.address}`,
  )}`
}

export const HomePage: React.FunctionComponent<HomePageProps> = ({
  salon,
  services,
  servicesLoading,
  servicesError,
  openingHours,
  openingHoursLoading,
  openingHoursError,
  onBookClick,
  onServiceClick,
}) => {
  const { t, intlLocale } = useLocale()

  const priceFormat = (cents: number): string =>
    new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    }).format(cents / 100)
  const weekdayFormat = new Intl.DateTimeFormat(intlLocale, { weekday: 'long', timeZone: 'UTC' })
  const today = parseYmd(viennaTodayYmd())
  const todayIndex =
    (new Date(Date.UTC(today.year, today.monthIndex, today.day)).getUTCDay() + 6) % 7
  const sortedServices = services ? [...services].sort((a, b) => a.priceCents - b.priceCents) : []

  return (
    <>
      <Container
        maxWidth="lg"
        component="section"
        sx={{ pt: { xs: 6, md: 11 }, pb: { xs: 7, md: 12 } }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
            gap: { xs: 5, md: 6 },
            alignItems: 'end',
          }}
        >
          <Box component="h1" sx={{ m: 0, font: 'inherit' }}>
            <HeroWordmark />
          </Box>
          <Box sx={{ maxWidth: '44ch', pb: { md: 1.5 } }}>
            <Typography sx={{ fontSize: '1.375rem', fontWeight: 600, mb: 1.5 }}>
              {t('home.place')}
            </Typography>
            <Typography sx={{ fontSize: '1.0625rem', lineHeight: 1.65, mb: 4 }}>
              {t('home.intro')}
            </Typography>
            <Button variant="contained" size="large" onClick={onBookClick}>
              {t('home.book')}
            </Button>
            {salon ? (
              <Typography variant="body2" sx={{ mt: 2 }}>
                <Link href={telHref(salon.phone)}>{t('home.call', { phone: salon.phone })}</Link>
              </Typography>
            ) : null}
          </Box>
        </Box>
      </Container>

      <Container
        maxWidth="lg"
        component="section"
        aria-labelledby="home-services"
        sx={{ pb: { xs: 8, md: 12 } }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '4fr 8fr' },
            gap: { xs: 3, md: 6 },
          }}
        >
          <Box>
            <Typography id="home-services" variant="h2" sx={{ mb: 1 }}>
              {t('home.servicesTitle')}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: '32ch' }}>
              {t('home.servicesHint')}
            </Typography>
          </Box>
          <Box>
            {servicesLoading ? (
              <CircularProgress aria-label={t('book.servicesLoading')} size={28} />
            ) : null}
            {servicesError ? <Typography>{t('home.servicesError')}</Typography> : null}
            {!servicesLoading && !servicesError && sortedServices.length === 0 ? (
              <Typography>{t('home.servicesEmpty')}</Typography>
            ) : null}
            {sortedServices.length > 0 ? (
              <PriceList>
                {sortedServices.map((service) => (
                  <li key={service.id}>
                    <PriceRow type="button" onClick={() => onServiceClick(service.id)}>
                      <Typography
                        component="span"
                        className="price-name"
                        sx={{ fontWeight: 600, fontSize: '1.125rem' }}
                      >
                        {service.name}
                      </Typography>
                      <Typography
                        component="span"
                        className="price-duration"
                        variant="body2"
                        color="text.secondary"
                      >
                        {t('book.durationMinutes', { minutes: service.durationMinutes })}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600,
                          fontSize: '1.125rem',
                          fontVariantNumeric: 'tabular-nums',
                          textAlign: 'right',
                        }}
                      >
                        {priceFormat(service.priceCents)}
                      </Typography>
                      {service.description ? (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ gridColumn: '1 / -1', mt: 0.5 }}
                        >
                          {service.description}
                        </Typography>
                      ) : null}
                    </PriceRow>
                  </li>
                ))}
              </PriceList>
            ) : null}
          </Box>
        </Box>
      </Container>

      <Box component="section" sx={{ bgcolor: brand.stone, py: { xs: 7, md: 10 } }}>
        <Container
          maxWidth="lg"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 6, md: 10 },
          }}
        >
          <Box>
            <Typography variant="h2" sx={{ mb: 2.5 }}>
              {t('home.hoursTitle')}
            </Typography>
            {openingHoursLoading ? <CircularProgress size={28} /> : null}
            {openingHoursError ? <Typography>{t('home.hoursError')}</Typography> : null}
            {openingHours ? (
              <HoursList>
                {weekdaysFromMonday.map((weekday, index) => {
                  const intervals = openingHours[weekday]?.intervals ?? []
                  const isToday = index === todayIndex
                  const className = isToday ? 'is-today' : undefined
                  return (
                    <Box key={weekday} sx={{ display: 'contents' }}>
                      <dt className={className}>
                        {weekdayFormat.format(new Date(Date.UTC(2024, 0, 1 + index)))}
                        {isToday ? (
                          <Box
                            component="span"
                            sx={{ ml: 1, color: brand.orangeDeep, fontWeight: 600 }}
                          >
                            {t('home.today')}
                          </Box>
                        ) : null}
                      </dt>
                      <dd className={className}>
                        {intervals.length === 0 ? (
                          <Box component="span" sx={{ color: 'text.secondary' }}>
                            {t('home.closed')}
                          </Box>
                        ) : (
                          intervals
                            .map((interval) => `${interval.start}–${interval.end}`)
                            .join(', ')
                        )}
                      </dd>
                    </Box>
                  )
                })}
              </HoursList>
            ) : null}
          </Box>

          <Box>
            <Typography variant="h2" sx={{ mb: 2.5 }}>
              {t('home.visitTitle')}
            </Typography>
            {salon ? (
              <>
                <Typography
                  component="address"
                  sx={{ fontStyle: 'normal', fontSize: '1.375rem', lineHeight: 1.4, mb: 2 }}
                >
                  {salon.name}
                  <br />
                  {salon.address}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  <Link href={telHref(salon.phone)}>{salon.phone}</Link>
                </Typography>
                <Typography>
                  <Link href={mapsHref(salon)} target="_blank" rel="noopener noreferrer">
                    {t('home.directions')}
                  </Link>
                </Typography>
              </>
            ) : null}
          </Box>
        </Container>
      </Box>
    </>
  )
}
