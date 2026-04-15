import { useState, useEffect, useMemo } from 'react'
import { MapView } from './components/MapView'
import { FilterBar } from './components/FilterBar'
import type { Poi } from './types'
import 'leaflet/dist/leaflet.css'

export default function App() {
  const [pois, setPois] = useState<Poi[]>([])
  const [activeTags, setActiveTags] = useState<string[]>([])

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}pois.json`)
      .then(r => r.json())
      .then(setPois)
      .catch(console.error)
  }, [])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    pois.forEach(p => p.tags.forEach(t => set.add(t)))
    return Array.from(set).sort()
  }, [pois])

  const filteredPois = useMemo(() => {
    if (activeTags.length === 0) return pois
    return pois.filter(p => p.tags.some(t => activeTags.includes(t)))
  }, [pois, activeTags])

  const toggleTag = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{
        background: '#1a6b4a',
        color: 'white',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        zIndex: 1000,
      }}>
        <span style={{ fontSize: 22 }}>🌋</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: 0.3 }}>Azores Trip</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>{filteredPois.length} points of interest</div>
        </div>
      </header>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <MapView pois={filteredPois} />
      </div>
      <FilterBar tags={allTags} activeTags={activeTags} onToggle={toggleTag} />
    </div>
  )
}
