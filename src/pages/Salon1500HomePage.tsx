import type * as React from 'react'
import { useEffect, useState } from 'react'
import { Box, Button, Container, Link, Typography } from '@mui/material'

import type { BrandProfile } from '../data/brands'
import type { OpeningHoursByWeekday } from '../data/openingHours'
import { telHref } from '../data/phone'
import type { Salon } from '../data/schemas'
import type { ServiceWithId } from '../data/services'
import { useLocale } from '../i18n'

export type Salon1500HomePageProps = {
  brandProfile: BrandProfile
  salon: Salon | null
  services: ServiceWithId[] | undefined
  servicesLoading: boolean
  servicesError: boolean
  openingHours: OpeningHoursByWeekday | undefined
  onBookClick: () => void
  onServiceClick: (serviceId: string) => void
}

const SCRIPT_FONT = '"Luxurious Script", "Cormorant SC", Georgia, serif'
const BODY_FONT = '"Roboto Condensed", "Helvetica Neue", Arial, sans-serif'

function mapsHref(salon: Salon): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${salon.name}, ${salon.address}`,
  )}`
}

export const Salon1500HomePage: React.FunctionComponent<Salon1500HomePageProps> = ({
  brandProfile,
  salon,
  onBookClick,
}) => {
  const { t, locale } = useLocale()
  const [heroIndex, setHeroIndex] = useState(0)

  const heroImages = brandProfile.heroSlides
  useEffect(() => {
    if (heroImages.length <= 1) return
    const timer = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [heroImages.length])

  const currentHero = heroImages[heroIndex]

  return (
    <Box sx={{ fontFamily: BODY_FONT, color: '#000000', bgcolor: '#FFFFFF' }}>
      {/* Full-bleed hero matching salon1500.it (5 interior slides + 0.52 white overlay + Luxurious Script) */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          minHeight: { xs: 560, md: 700 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          bgcolor: '#FAF6F2',
        }}
      >
        {currentHero ? (
          <Box
            component="img"
            src={currentHero}
            alt=""
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        ) : null}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(255, 255, 255, 0.52)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: { xs: 7, md: 10 } }}>
          {brandProfile.logoUrl ? (
            <Box
              component="img"
              src={brandProfile.logoUrl}
              alt="Salon 1500 Logo"
              sx={{
                width: { xs: 110, sm: 136 },
                height: 'auto',
                mx: 'auto',
                mb: 2,
                display: 'block',
                borderRadius: 1,
                border: '1px solid rgba(0,0,0,0.12)',
              }}
            />
          ) : null}
          <Typography
            component="h1"
            sx={{
              fontFamily: SCRIPT_FONT,
              fontSize: { xs: '5.5rem', sm: '8.5rem', md: '10.5rem' },
              fontWeight: 100,
              lineHeight: 0.9,
              color: '#000000',
              mb: 2,
            }}
          >
            Salon 1500
          </Typography>
          <Typography
            sx={{
              fontFamily: BODY_FONT,
              fontSize: { xs: '1.125rem', md: '1.35rem' },
              fontWeight: 300,
              lineHeight: 1.6,
              maxWidth: '48ch',
              mx: 'auto',
              color: '#000000',
              mb: 4,
            }}
          >
            {brandProfile.heroIntro[locale]}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onBookClick}
            sx={{
              bgcolor: '#000000',
              color: '#FFFFFF',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              letterSpacing: '0.06em',
              borderRadius: 0,
              '&:hover': { bgcolor: '#2B2B2B' },
            }}
          >
            {t('home.book')}
          </Button>
        </Container>
      </Box>

      {/* Styles gallery */}
      {brandProfile.gallery.length > 0 ? (
        <Container maxWidth="lg" component="section" sx={{ py: { xs: 7, md: 10 } }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: SCRIPT_FONT,
              fontSize: { xs: '3.25rem', md: '4.25rem' },
              fontWeight: 400,
              color: '#54595F',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Styles
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
                md: 'repeat(5, minmax(0, 1fr))',
              },
              gap: 1.5,
            }}
          >
            {brandProfile.gallery.map((item) => (
              <Box
                key={item.src}
                component="figure"
                sx={{
                  m: 0,
                  overflow: 'hidden',
                  aspectRatio: '3 / 4',
                  bgcolor: '#FAF6F2',
                  border: '1px solid #DFBFA4',
                  '&:hover img': { transform: 'scale(1.04)' },
                }}
              >
                <Box
                  component="img"
                  src={item.src}
                  alt={locale === 'it' ? item.altIt : item.altDe}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 260ms ease',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Container>
      ) : null}

      {/* Stylistinnen with portrait photos */}
      <Box component="section" sx={{ bgcolor: '#FAF6F2', py: { xs: 7, md: 9 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: SCRIPT_FONT,
              fontSize: { xs: '3.25rem', md: '4.25rem' },
              fontWeight: 400,
              color: '#54595F',
              mb: 4,
            }}
          >
            {t('home.stylistsTitle')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 4,
            }}
          >
            {brandProfile.stylists.map((stylist) => (
              <Box
                key={stylist.name}
                sx={{
                  position: 'relative',
                  minHeight: { xs: 420, sm: 480 },
                  display: 'flex',
                  alignItems: 'flex-end',
                  textAlign: 'left',
                  overflow: 'hidden',
                  border: '1px solid #DFBFA4',
                  bgcolor: '#000000',
                }}
              >
                {stylist.imageUrl ? (
                  <Box
                    component="img"
                    src={stylist.imageUrl}
                    alt={stylist.name}
                    loading="lazy"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                    }}
                  />
                ) : null}
                <Box
                  aria-hidden
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.25) 45%, rgba(0, 0, 0, 0) 75%)',
                  }}
                />
                <Box sx={{ position: 'relative', zIndex: 1, p: 3, width: '100%' }}>
                  <Typography
                    sx={{
                      fontFamily: BODY_FONT,
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      color: '#DFBFA4',
                      mb: 0.5,
                    }}
                  >
                    {stylist.name}
                  </Typography>
                  <Typography sx={{ color: '#FFFFFF', fontSize: '1rem', mb: 1 }}>
                    {locale === 'it' ? stylist.roleIt : stylist.roleDe}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                    <Link
                      href={telHref(stylist.phone)}
                      sx={{ color: '#FFFFFF', fontWeight: 600, textDecorationColor: '#DFBFA4' }}
                    >
                      T: {stylist.phone}
                    </Link>
                    {stylist.instagramUrl ? (
                      <Link
                        href={stylist.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: '#DFBFA4', fontWeight: 600 }}
                      >
                        Instagram
                      </Link>
                    ) : null}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Kontakt */}
      <Box component="section" sx={{ bgcolor: '#FFFFFF', py: { xs: 7, md: 9 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: SCRIPT_FONT,
              fontSize: { xs: '3.25rem', md: '4.25rem' },
              fontWeight: 400,
              color: '#54595F',
              mb: 3,
            }}
          >
            {t('home.visitTitle')}
          </Typography>
          {salon ? (
            <>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.5 }}>
                {salon.name}
              </Typography>
              <Typography sx={{ color: '#54595F', mb: 2 }}>{salon.address}</Typography>
              <Typography sx={{ mb: 1 }}>
                <Link href={`mailto:${salon.email}`} sx={{ color: '#000000' }}>
                  {salon.email}
                </Link>
              </Typography>
              {brandProfile.instagramUrl ? (
                <Typography sx={{ mb: 1 }}>
                  <Link
                    href={brandProfile.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: '#000000', fontWeight: 600, textDecorationColor: '#DFBFA4' }}
                  >
                    Instagram: {brandProfile.instagramHandle ?? brandProfile.instagramUrl}
                  </Link>
                </Typography>
              ) : null}
              <Typography>
                <Link
                  href={mapsHref(salon)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#000000', fontWeight: 600, textDecorationColor: '#DFBFA4' }}
                >
                  {t('home.directions')}
                </Link>
              </Typography>
            </>
          ) : null}
        </Container>
      </Box>
    </Box>
  )
}
