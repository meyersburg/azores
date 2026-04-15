import { useState, useMemo } from 'react'
import { MapView } from './components/MapView'
import { FilterBar } from './components/FilterBar'
import { AdminPanel } from './components/AdminPanel'
import { usePois } from './hooks/usePois'
import 'leaflet/dist/leaflet.css'

export default function App() {
  const { pois, savePoi, deletePoi } = usePois()
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [adminOpen, setAdminOpen] = useState(false)

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
        justifyContent: 'space-between',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        zIndex: 1000,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🌋</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: 0.3 }}>Azores Trip</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>{filteredPois.length} points of interest</div>
          </div>
        </div>
        <button
          onClick={() => setAdminOpen(true)}
          title="Manage POIs"
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: 20,
            opacity: 0.8,
            padding: 4,
            lineHeight: 1,
          }}
        >
          ⚙️
        </button>
      </header>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <MapView pois={filteredPois} />
        <FilterBar tags={allTags} activeTags={activeTags} onToggle={toggleTag} />
      </div>

      {adminOpen && (
        <AdminPanel
          pois={pois}
          onSave={savePoi}
          onDelete={deletePoi}
          onClose={() => setAdminOpen(false)}
        />
      )}
    </div>
  )
}
