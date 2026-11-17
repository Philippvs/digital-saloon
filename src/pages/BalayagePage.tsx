import type * as React from 'react'
import { useEffect, useState } from 'react'
import { Box, Button, Container, Typography } from '@mui/material'

import { arePricesVisible } from '../data/salonConfig'
import { useLocale } from '../i18n'

export type BalayagePageProps = {
  onSelectPackage: (serviceId: string) => void
  onBookClick: () => void
}

const SCRIPT_FONT = '"Luxurious Script", "Cormorant SC", Georgia, serif'
const BODY_FONT = '"Roboto Condensed", "Helvetica Neue", Arial, sans-serif'

const BALAYAGE_PACKAGES = [
  {
    id: 'balayage-xs',
    size: 'XS',
    title: 'Paket XS',
    subtitleDe: 'Dezente Lichtreflexe & Face-Framing',
    subtitleIt: 'Riflessi delicati e face-framing',
    duration: '180 min',
    price: '140€',
    includesDe: ['Typgerechte Beratung', 'Partielles Balayage / Face-Framing', 'Glossing & Finish'],
    includesIt: [
      'Consulenza personalizzata',
      'Balayage parziale / face-framing',
      'Glossing e finish',
    ],
  },
  {
    id: 'balayage-s',
    size: 'S',
    title: 'Paket S',
    subtitleDe: 'Natürliches Balayage für feines bis mittleres Haar',
    subtitleIt: 'Balayage naturale per capelli fini o medi',
    duration: '180 min',
    price: '150€',
    includesDe: ['Typgerechte Beratung', 'Klassisches Balayage', 'Glossing, Pflege & Föhnen'],
    includesIt: ['Consulenza personalizzata', 'Balayage classico', 'Glossing, cura e piega'],
  },
  {
    id: 'balayage-m',
    size: 'M',
    title: 'Paket M',
    subtitleDe: 'Mehrdimensionale Farbverläufe & Intensivpflege',
    subtitleIt: 'Sfumature multidimensionali e cura intensiva',
    duration: '210 min',
    price: '170€-180€',
    includesDe: [
      'Ausführliche Farbberatung',
      'Full Balayage & Root Shadow',
      'Glossing, Intensivpflege & Styling',
    ],
    includesIt: [
      'Consulenza colore dedicata',
      'Full Balayage e root shadow',
      'Glossing, trattamento e styling',
    ],
  },
  {
    id: 'balayage-l',
    size: 'L',
    title: 'Paket L',
    subtitleDe: 'Komplett-Transformation für langes oder kräftiges Haar',
    subtitleIt: 'Trasformazione completa per capelli lunghi o folti',
    duration: '240 – 300 min',
    price: '200€-250€',
    includesDe: [
      'Umfassende Farb- & Schnittberatung',
      'Full Balayage (High-Density)',
      'Glossing, Bond-Care & Styling',
    ],
    includesIt: [
      'Consulenza colore e taglio',
      'Full Balayage alta densità',
      'Glossing, bond-care e styling',
    ],
  },
] as const

const MODEL_SLIDES = [
  'https://salon1500.it/wp-content/uploads/2024/01/Balayage-3-Models-scaled.jpg',
  'https://salon1500.it/wp-content/uploads/2024/01/Balayage-Balkon-scaled.jpg',
  'https://salon1500.it/wp-content/uploads/2024/01/Balayage-Studio-Haare-fliegen-scaled.jpg',
  'https://salon1500.it/wp-content/uploads/2024/01/Balayage-Zaun-scaled.jpg',
] as const

export const BalayagePage: React.FunctionComponent<BalayagePageProps> = ({
  onSelectPackage,
  onBookClick,
}) => {
  const { t, locale } = useLocale()
  const pricesVisible = arePricesVisible()
  const [modelIndex, setModelIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setModelIndex((prev) => (prev + 1) % MODEL_SLIDES.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <Box sx={{ fontFamily: BODY_FONT, color: '#000000', bgcolor: '#FFFFFF' }}>
      <Box
        component="section"
        sx={{
          bgcolor: '#FAF6F2',
          py: { xs: 6, md: 9 },
          textAlign: 'center',
          borderBottom: '1px solid #DFBFA4',
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            sx={{
              fontFamily: SCRIPT_FONT,
              fontSize: { xs: '4.5rem', sm: '6.5rem', md: '8rem' },
              fontWeight: 100,
              lineHeight: 0.95,
              color: '#000000',
              mb: 2,
            }}
          >
            Balayage
          </Typography>
          <Typography
            sx={{
              fontFamily: BODY_FONT,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#54595F',
              maxWidth: '46ch',
              mx: 'auto',
            }}
          >
            “balayer” – to dye like an artist painting a masterpiece
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" component="section" sx={{ py: { xs: 6, md: 9 } }}>
        <Typography
          component="h2"
          sx={{
            fontFamily: SCRIPT_FONT,
            fontSize: { xs: '3rem', md: '4rem' },
            fontWeight: 400,
            color: '#54595F',
            textAlign: 'center',
            mb: 5,
          }}
        >
          Price List
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3.5,
          }}
        >
          {BALAYAGE_PACKAGES.map((pkg) => {
            const subtitle = locale === 'it' ? pkg.subtitleIt : pkg.subtitleDe
            const includes = locale === 'it' ? pkg.includesIt : pkg.includesDe
            return (
              <Box
                key={pkg.id}
                sx={{
                  border: '1px solid #DFBFA4',
                  bgcolor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    bgcolor: '#FAF6F2',
                    px: 3.5,
                    py: 3,
                    borderBottom: '1px solid #DFBFA4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      component="h3"
                      sx={{
                        fontFamily: '"Cormorant SC", Georgia, serif',
                        fontSize: '1.85rem',
                        fontWeight: 600,
                        color: '#000000',
                        lineHeight: 1.1,
                      }}
                    >
                      {pkg.title}
                    </Typography>
                    <Typography sx={{ color: '#54595F', fontSize: '0.95rem', mt: 0.5 }}>
                      {subtitle}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      flexShrink: 0,
                      border: '1px solid #000000',
                      bgcolor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: '"Cormorant SC", Georgia, serif',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#000000',
                    }}
                  >
                    {pkg.size}
                  </Box>
                </Box>

                <Box sx={{ p: 3.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      pb: 2,
                      mb: 2,
                      borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography sx={{ color: '#54595F', fontSize: '1rem' }}>
                      {pkg.duration}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: '#000000',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {pricesVisible ? pkg.price : t('price.onRequest')}
                    </Typography>
                  </Box>

                  <Box
                    component="ul"
                    sx={{
                      m: 0,
                      mb: 3,
                      pl: 2.25,
                      color: '#54595F',
                      fontSize: '0.95rem',
                      lineHeight: 1.75,
                      flex: 1,
                    }}
                  >
                    {includes.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => onSelectPackage(pkg.id)}
                    sx={{
                      bgcolor: '#000000',
                      color: '#FFFFFF',
                      borderRadius: 0,
                      py: 1.25,
                      letterSpacing: '0.04em',
                      '&:hover': { bgcolor: '#2B2B2B' },
                    }}
                  >
                    {t('home.book')}
                  </Button>
                </Box>
              </Box>
            )
          })}
        </Box>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onBookClick}
            sx={{
              borderColor: '#000000',
              color: '#000000',
              borderRadius: 0,
              px: 4,
              py: 1.25,
            }}
          >
            {t('home.book')}
          </Button>
        </Box>
      </Container>

      {/* Models showcase matching salon1500.it/balayage/ without cropping */}
      <Box
        component="section"
        sx={{
          bgcolor: '#FAF6F2',
          py: { xs: 6, md: 9 },
          borderTop: '1px solid #DFBFA4',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h2"
            sx={{
              fontFamily: SCRIPT_FONT,
              fontSize: { xs: '3rem', md: '4rem' },
              fontWeight: 400,
              color: '#54595F',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Models
          </Typography>

          <Box
            sx={{
              position: 'relative',
              maxWidth: 920,
              mx: 'auto',
              border: '1px solid #DFBFA4',
              bgcolor: '#F4EDE6',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 360, sm: 480, md: 580 },
              }}
            >
              {MODEL_SLIDES.map((src, idx) => (
                <Box
                  key={src}
                  component="img"
                  src={src}
                  alt={`Salon 1500 Balayage Model ${idx + 1}`}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    p: { xs: 1, sm: 2 },
                    opacity: idx === modelIndex ? 1 : 0,
                    transition: 'opacity 500ms ease',
                  }}
                />
              ))}
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1.25,
                bgcolor: '#FFFFFF',
                borderTop: '1px solid #DFBFA4',
                gap: 2,
              }}
            >
              <Button
                size="small"
                onClick={() =>
                  setModelIndex((prev) => (prev - 1 + MODEL_SLIDES.length) % MODEL_SLIDES.length)
                }
                sx={{ color: '#000000', minWidth: 0, px: 1.5, borderRadius: 0 }}
              >
                ‹
              </Button>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {MODEL_SLIDES.map((src, idx) => (
                  <Box
                    key={src}
                    component="button"
                    type="button"
                    aria-label={`Model ${idx + 1}`}
                    onClick={() => setModelIndex(idx)}
                    sx={{
                      width: 48,
                      height: 36,
                      p: 0,
                      border: idx === modelIndex ? '2px solid #000000' : '1px solid #DFBFA4',
                      bgcolor: '#FAF6F2',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      opacity: idx === modelIndex ? 1 : 0.65,
                      transition: 'opacity 150ms ease, border-color 150ms ease',
                    }}
                  >
                    <Box
                      component="img"
                      src={src}
                      alt=""
                      aria-hidden
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        display: 'block',
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Button
                size="small"
                onClick={() => setModelIndex((prev) => (prev + 1) % MODEL_SLIDES.length)}
                sx={{ color: '#000000', minWidth: 0, px: 1.5, borderRadius: 0 }}
              >
                ›
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
