import type { Poi } from '../types'
import { TAG_ORDER } from '../types'

const C = '#1a6b4a'
const S = { fill: 'none', stroke: C, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function Hike() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
      <polyline points="1,13 5.5,4 8,8 10,5.5 15,13" {...S} />
    </svg>
  )
}

function Attraction() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
      <polygon points="8,1.5 9.5,6 14,6 10.5,8.8 11.8,13.2 8,10.5 4.2,13.2 5.5,8.8 2,6 6.5,6" {...S} />
    </svg>
  )
}

function CarVista() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
      <path d="M2 10V8.5L4 5.5h8l2 3V10H2z" {...S} />
      <line x1="2" y1="10" x2="14" y2="10" {...S} />
      <circle cx="4.5" cy="12" r="1.2" {...S} />
      <circle cx="11.5" cy="12" r="1.2" {...S} />
    </svg>
  )
}

function Brekkie() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
      <path d="M2 11Q2 6.5 8 6.5Q14 6.5 14 11" {...S} />
      <line x1="1" y1="11" x2="15" y2="11" {...S} />
      <line x1="8" y1="2" x2="8" y2="4" {...S} />
      <line x1="4.5" y1="3" x2="5.5" y2="4.8" {...S} />
      <line x1="11.5" y1="3" x2="10.5" y2="4.8" {...S} />
    </svg>
  )
}

function Lunch() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
      <line x1="5" y1="2" x2="5" y2="14" {...S} />
      <path d="M3 2v3.5c0 1 1 1.5 2 1.5s2-.5 2-1.5V2" {...S} />
      <path d="M11 2c1.5 1.5 2 3 2 4.5 0 1-.5 1.5-2 1.5V14" {...S} />
    </svg>
  )
}

function Dinner() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
      <path d="M5 2h6l-1.5 5.5Q9 9 8 9Q7 9 6.5 7.5Z" {...S} />
      <line x1="8" y1="9" x2="8" y2="13" {...S} />
      <line x1="5.5" y1="13" x2="10.5" y2="13" {...S} />
    </svg>
  )
}

function Cafe() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
      <path d="M3 7h8v4.5A2.5 2.5 0 018.5 14h-3A2.5 2.5 0 013 11.5V7z" {...S} />
      <path d="M11 8.5h1a1.5 1.5 0 010 3h-1" {...S} />
      <path d="M5.5 5c0-1 1-1.5 1.5-1s1.5 0 1.5-1" {...S} />
    </svg>
  )
}

function Pin() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none">
      <path d="M8 2a4 4 0 00-4 4c0 3.5 4 8 4 8s4-4.5 4-8a4 4 0 00-4-4z" {...S} />
      <circle cx="8" cy="6" r="1.5" {...S} />
    </svg>
  )
}

const TAG_ICON_MAP: Record<string, () => JSX.Element> = {
  'Hike':      Hike,
  'Attraction': Attraction,
  'Car Vista': CarVista,
  'Brekkie':   Brekkie,
  'Lunch':     Lunch,
  'Dinner':    Dinner,
  'Cafe':      Cafe,
}

export function TagIcon({ poi }: { poi: Poi }) {
  const tags = poi.tags ?? []
  const match = TAG_ORDER.find(t => tags.includes(t)) ?? tags[0]
  const Icon = (match && TAG_ICON_MAP[match]) ? TAG_ICON_MAP[match] : Pin
  return <Icon />
}
