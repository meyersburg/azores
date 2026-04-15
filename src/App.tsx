import { useState, useMemo } from 'react'
import { MapView } from './components/MapView'
import { FilterBar } from './components/FilterBar'
import { AdminPanel } from './components/AdminPanel'
import { usePois } from './hooks/usePois'
import { TAG_ORDER } from './types'
import 'leaflet/dist/leaflet.css'

export default function App() {
  const { pois, savePoi, deletePoi } = usePois()
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [adminOpen, setAdminOpen] = useState(false)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    pois.forEach(p => (p.tags ?? []).forEach(t => set.add(t)))
    return Array.from(set).sort((a, b) => {
      const ai = TAG_ORDER.indexOf(a)
      const bi = TAG_ORDER.indexOf(b)
      if (ai === -1 && bi === -1) return a.localeCompare(b)
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
  }, [pois])

  const filteredPois = useMemo(() => {
    if (activeTags.length === 0) return pois
    return pois.filter(p => (p.tags ?? []).length === 0 || (p.tags ?? []).some(t => activeTags.includes(t)))
  }, [pois, activeTags])

  const toggleTag = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div style={{ height: '100dvh', position: 'relative', fontFamily: 'system-ui, sans-serif' }}>
      <MapView pois={filteredPois} />

      {/* Title — floats over map */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: '"Instrument Serif", serif',
          fontSize: 28,
          color: '#000000',
          textShadow: '0 1px 6px rgba(0,0,0,0.5)',
        }}>
          The Azwhores
        </span>
        <button
          onClick={() => setAdminOpen(true)}
          title="Manage POIs"
          style={{
            position: 'absolute',
            right: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 20,
            padding: 4,
            lineHeight: 1,
            pointerEvents: 'all',
          }}
        >
          ⚙️
        </button>
      </div>

      <FilterBar tags={allTags} activeTags={activeTags} onToggle={toggleTag} />

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
