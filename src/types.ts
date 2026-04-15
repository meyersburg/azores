export type PoiCategory = 'nature' | 'food' | 'culture' | 'beach' | 'accommodation' | 'other'

export interface Poi {
  id: string
  name: string
  island: string
  coordinates: [number, number] // [lat, lng]
  category: PoiCategory
  thumbnail: string
  description: string
  tags: string[]
}
