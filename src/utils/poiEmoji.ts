import type { Poi } from '../types'

export function poiEmoji(poi: Poi): string {
  const tags = poi.tags ?? []
  const text = `${poi.name} ${poi.description}`.toLowerCase()

  if (tags.includes('Hike'))      return '🥾'
  if (tags.includes('Brekkie'))   return '🥐'
  if (tags.includes('Lunch'))     return '🍽️'
  if (tags.includes('Dinner'))    return '🍷'
  if (tags.includes('Cafe'))      return '☕'
  if (tags.includes('Car Vista')) return '🚗'
  if (tags.includes('Attraction')) return '⭐'

  if (text.includes('tea') || text.includes('plantation')) return '🍵'
  if (text.includes('lake') || text.includes('lagoa'))     return '🌊'
  if (text.includes('volcano') || text.includes('geotherm') || text.includes('fumarol')) return '🌋'
  if (text.includes('beach') || text.includes('praia'))    return '🏖️'
  if (text.includes('church') || text.includes('cathedral') || text.includes('chapel')) return '⛪'
  if (text.includes('museum'))    return '🏛️'
  if (text.includes('market'))    return '🛒'
  if (text.includes('viewpoint') || text.includes('miradouro') || text.includes('vista')) return '👁️'
  if (text.includes('hot spring') || text.includes('thermal') || text.includes('pool')) return '♨️'
  if (text.includes('cave') || text.includes('gruta'))     return '🕳️'
  if (text.includes('whale') || text.includes('dolphin') || text.includes('ocean')) return '🐋'
  if (text.includes('garden') || text.includes('park') || text.includes('jardim')) return '🌿'
  if (text.includes('waterfall') || text.includes('cascata')) return '💧'
  if (text.includes('town') || text.includes('city') || text.includes('downtown')) return '🏙️'

  return '📍'
}
