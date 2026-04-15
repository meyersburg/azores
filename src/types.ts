export type TagType = 'Attraction' | 'Hike' | 'Vista' | 'Brekkie' | 'Lunch' | 'Dinner' | 'Cafe'

export const TAG_COLORS: Record<TagType, string> = {
  Attraction: '#7c3aed',
  Hike:       '#1a6b4a',
  Vista:      '#0284c7',
  Brekkie:    '#f59e0b',
  Lunch:      '#ea580c',
  Dinner:     '#be123c',
  Cafe:       '#92400e',
}

export interface Poi {
  id: string
  name: string
  town: string
  coordinates: [number, number]
  description: string
  tags: TagType[]
  thumbnail?: string
}
