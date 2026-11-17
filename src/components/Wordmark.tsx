import type * as React from 'react'

import { HeaderMark, HeroMark, MarkHair, MarkKimm, MarkStudio } from './Wordmark.styles'

/** The KIMM Hair logo set in type, with the vertical rule from the printed logo. */
export const HeroWordmark: React.FunctionComponent = () => (
  <HeroMark role="img" aria-label="KIMM Hair, haarstudio capelli">
    <MarkKimm aria-hidden>KIMM</MarkKimm>
    <MarkHair aria-hidden>HAIR</MarkHair>
    <MarkStudio aria-hidden>
      haar<span>studio capelli</span>
    </MarkStudio>
  </HeroMark>
)

export type HeaderWordmarkProps = {
  label: string
  onClick: () => void
}

export const HeaderWordmark: React.FunctionComponent<HeaderWordmarkProps> = ({
  label,
  onClick,
}) => (
  <HeaderMark type="button" aria-label={label} onClick={onClick}>
    <MarkKimm as="span" sx={{ display: 'inline' }}>
      KIMM
    </MarkKimm>
    <MarkHair as="span" sx={{ display: 'inline' }}>
      HAIR
    </MarkHair>
  </HeaderMark>
)
