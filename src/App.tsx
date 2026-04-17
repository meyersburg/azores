import { useState, useMemo } from 'react'
import { MapView } from './components/MapView'
import { FilterBar } from './components/FilterBar'
import { AdminPanel } from './components/AdminPanel'
import { ItineraryPanel } from './components/ItineraryPanel'
import { usePois } from './hooks/usePois'
import { useItinerary } from './hooks/useItinerary'
import { useWeather } from './hooks/useWeather'
import { useDayLabels } from './hooks/useDayLabels'
import { generateDayLabels } from './utils/generateDayLabels'
import { TAG_ORDER } from './types'
import 'leaflet/dist/leaflet.css'

export default function App() {
  const { pois, savePoi, deletePoi } = usePois()
  const { itinerary, addToDay, removeFromDay } = useItinerary()
  const weather = useWeather()
  const { labels, saveLabels } = useDayLabels()

  const handleGenerateLabels = async () => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string
    const newLabels = await generateDayLabels(itinerary, pois, apiKey)
    await saveLabels(newLabels)
  }
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
      <MapView
        pois={filteredPois}
        itinerary={itinerary}
        weather={weather}
        onAddToDay={addToDay}
        onRemoveFromDay={removeFromDay}
      />

      {/* Gear button — always on top */}
      <button
        onClick={() => setAdminOpen(true)}
        title="Manage POIs"
        style={{
          position: 'absolute',
          top: 10, right: 16,
          zIndex: 1000,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 20,
          padding: 4,
          lineHeight: 1,
        }}
      >
        ⚙️
      </button>

      <ItineraryPanel
        itinerary={itinerary}
        weather={weather}
        pois={pois}
        labels={labels}
        onRemove={removeFromDay}
        onGenerateLabels={handleGenerateLabels}
      />

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
