import { arcTypeTaxonomy, elementTaxonomy, rarityTaxonomy } from './gameTaxonomy.js'

function SvgIcon({ children, className = 'h-4 w-4', ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...props}>
      {children}
    </svg>
  )
}

export function IncantationIcon(props) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5.3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3.5v3.1M12 17.4v3.1M3.5 12h3.1M17.4 12h3.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 7.9l1.35 2.75L16.1 12l-2.75 1.35L12 16.1l-1.35-2.75L7.9 12l2.75-1.35L12 7.9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </SvgIcon>
  )
}

export function CosmosIcon(props) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 4.7l1.85 4.15L18 10.7l-4.15 1.85L12 16.7l-1.85-4.15L6 10.7l4.15-1.85L12 4.7z" fill="currentColor" opacity="0.82" />
      <circle cx="12" cy="12" r="3.1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 1.9v3.2M12 18.9v3.2M1.9 12h3.2M18.9 12h3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
    </SvgIcon>
  )
}

export function ChaosIcon(props) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14.9 5.9a6.5 6.5 0 1 0 2.9 6.3c-1.7 1-3.8.8-5.2-.6-1.5-1.5-1.6-3.8-.4-5.5" fill="currentColor" />
      <path d="M12 8.1l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6z" fill="white" opacity="0.95" />
    </SvgIcon>
  )
}

export function PsycheIcon(props) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.8 5.7c-2.8 3.1-2.4 5.8 1.3 8.4 1.9 1.3 2.4 2.8.9 4.2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M13.4 4.9c-2.2 3.2-1.4 5.1 1.7 7.2 2 1.3 2.3 3.2.5 5.7M6.6 8.4c.5 2.4 2 4.2 4.8 5.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" opacity="0.86" />
    </SvgIcon>
  )
}

export function AnimaIcon(props) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13.9 4.8c-4.1 3.5-5.5 7.2-3.4 10.1 1.5 2.1 4.8 2 5.7-.3.8-2-.4-3.7-2.1-4.9-1.1-.8-1.2-2.5-.2-4.9z" fill="currentColor" />
      <path d="M9 17.7c-1.5-3.2.2-6.4 4.8-9.2M12.1 18.6c2.7-1 4.2-3.5 3.4-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  )
}

export function LakshanaIcon(props) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 4.9c1.4 3.5 3.6 5.7 7.1 7.1-3.5 1.4-5.7 3.6-7.1 7.1-1.4-3.5-3.6-5.7-7.1-7.1 3.5-1.4 5.7-3.6 7.1-7.1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.8" stroke="currentColor" strokeWidth="1.7" />
    </SvgIcon>
  )
}

export function BoseIcon(props) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="8" ry="3.7" stroke="currentColor" strokeWidth="1.7" transform="rotate(0 12 12)" />
      <ellipse cx="12" cy="12" rx="8" ry="3.7" stroke="currentColor" strokeWidth="1.7" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="8" ry="3.7" stroke="currentColor" strokeWidth="1.7" transform="rotate(120 12 12)" />
    </SvgIcon>
  )
}

export function GasIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12.8 3.2c-3.7.4-6.4 2.7-7.3 5.8 2.4-1.4 4.7-1.3 6.3.3-3.1-.3-5.8 1.3-7 4.2 2.6-.9 4.8-.4 6.1 1.3-2.6.4-4.6 2-5.3 4.5 3.5-.2 6.1-1.7 7.4-4.3 1.4 2 3.5 2.9 6.3 2.4-.5-3.1-2.4-5-5.3-5.8 2.6-1 4-3 4-5.9-2.3.5-4 1.7-5.2 3.5-.6-2-.6-4 .1-6z" fill="currentColor" />
    </SvgIcon>
  )
}

export function LiquidIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M18.8 8.4c.9 3.2-.4 6.8-3.4 8.8-3.8 2.6-9 1.5-11.3-2.3 3 .5 5.3-.5 6.6-2.7-2.4.8-4.6.2-6.2-1.7 2.9-.7 5-2.1 6.2-4.4.2 1.7.9 3 2.1 3.9.5-2.1 1.9-3.5 4.2-4.2-.3 1.6.3 2.5 1.8 2.6z" fill="currentColor" />
      <circle cx="8.1" cy="10.4" r="1.2" fill="white" opacity="0.9" />
      <circle cx="11.8" cy="8.7" r="1.45" fill="white" opacity="0.9" />
      <circle cx="15.2" cy="7.6" r="1.1" fill="white" opacity="0.9" />
    </SvgIcon>
  )
}

export function PlasmaIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M18.1 5.2a8.4 8.4 0 1 0 1.4 10.7" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M14.1 3.9L6.5 13h4.8l-1.4 7.2 7.9-10h-4.6l.9-6.3z" fill="currentColor" />
    </SvgIcon>
  )
}

export function SolidIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12 3.5l7.2 4.2v8.6L12 20.5l-7.2-4.2V7.7L12 3.5z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M12 3.7V12M5 7.9l7 4.1 7-4.1M12 12v8.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.1 7.8l6.9 4.1-6.9 4.1V7.8z" fill="currentColor" opacity="0.18" />
      <path d="M12 12l7-4.1v8.2L12 20.2V12z" fill="currentColor" opacity="0.26" />
    </SvgIcon>
  )
}

const elementIcons = {
  incantation: IncantationIcon,
  cosmos: CosmosIcon,
  chaos: ChaosIcon,
  psyche: PsycheIcon,
  anima: AnimaIcon,
  lakshana: LakshanaIcon,
}

const arcTypeIcons = {
  bose: BoseIcon,
  gas: GasIcon,
  liquid: LiquidIcon,
  plasma: PlasmaIcon,
  solid: SolidIcon,
}

export const elementsMeta = elementTaxonomy.map((item) => ({ ...item, icon: elementIcons[item.id] }))
export const rarityMeta = rarityTaxonomy.map((item) => ({ ...item }))
export const arcTypesMeta = arcTypeTaxonomy.map((item) => ({ ...item, icon: arcTypeIcons[item.id] }))

export const getElementMeta = (id) => elementsMeta.find((item) => item.id === id)
export const getRarityMeta = (id) => rarityMeta.find((item) => item.id === id)
export const getArcTypeMeta = (id) => arcTypesMeta.find((item) => item.id === id)
