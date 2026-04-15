export const TAG_COLORS: Record<string, string> = {
  Attraction: '#7c3aed',
  Hike:       '#1a6b4a',
  Vista:      '#0284c7',
  Brekkie:    '#f59e0b',
  Lunch:      '#ea580c',
  Dinner:     '#be123c',
  Cafe:       '#92400e',
  Sleep:      '#0e7490',
  Eat:        '#b45309',
}

export function tagColor(tag: string): string {
  return TAG_COLORS[tag] ?? '#6b7280'
}

export interface Poi {
  id: string
  name: string
  translation: string
  coordinates: [number, number]
  description: string
  tags: string[]
  thumbnail?: string
}
