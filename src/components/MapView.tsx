import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import type { Poi } from '../types'
import { tagColor } from '../types'
import { VoteButton } from './VoteButton'
import { DayPicker } from './DayPicker'
import type { Itinerary } from '../hooks/useItinerary'
import type { DayWeather } from '../hooks/useWeather'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const cartIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>`,
  className: '',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -14],
})

function makeIcon(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="white"/>
    </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  })
}

function TitleOverlay() {
  const map = useMap()
  const [visible, setVisible] = useState(true)

  useMapEvents({
    popupopen: () => setVisible(false),
    popupclose: () => setVisible(true),
  })

  const [container] = useState(() => {
    const el = document.createElement('div')
    el.style.cssText = `
      position: absolute;
      top: 0; left: 0; right: 0;
      z-index: 650;
      text-align: center;
      padding: 12px 0;
      pointer-events: none;
      transition: opacity 0.15s;
    `
    return el
  })

  useEffect(() => {
    map.getContainer().appendChild(container)
    return () => { container.remove() }
  }, [map, container])

  useEffect(() => {
    container.style.opacity = visible ? '1' : '0'
  }, [visible, container])

  return createPortal(
    <span style={{
      fontFamily: '"Instrument Serif", serif',
      fontSize: 28,
      color: '#000',
      textShadow: '0 1px 6px rgba(0,0,0,0.15)',
    }}>
      The Azwhores
    </span>,
    container
  )
}

interface Props {
  pois: Poi[]
  itinerary: Itinerary
  weather: DayWeather[]
  onAddToDay: (dayIndex: number, poiId: string) => void
  onRemoveFromDay: (dayIndex: number, poiId: string) => void
}

export function MapView({ pois, itinerary, weather, onAddToDay, onRemoveFromDay }: Props) {
  return (
    <MapContainer
      style={{ height: '100%', width: '100%' }}
      center={[37.79, -25.47]}
      zoom={11}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_KEY}`}
        tileSize={512}
        zoomOffset={-1}
        maxZoom={20}
      />
      <TitleOverlay />

      {/* Static grocery store marker */}
      <Marker position={[37.745985, -25.584970]} icon={cartIcon}>
        <Popup>
          <strong>Continente Modelo</strong><br />
          <span style={{ fontSize: 11, color: '#777' }}>(Grocery Store)</span>
        </Popup>
      </Marker>

      {pois.map(poi => {
        const markerColor = (poi.tags ?? []).length === 0 ? '#000000' : '#1a6b4a'

        return (
          <Marker
            key={poi.id}
            position={poi.coordinates}
            icon={makeIcon(markerColor)}
          >
            <Popup maxWidth={280} minWidth={220}>
              <div style={{ fontFamily: 'system-ui, sans-serif' }}>
                {poi.thumbnail && (
                  <img
                    src={poi.thumbnail}
                    alt={poi.name}
                    style={{
                      width: '100%', height: 120, objectFit: 'cover',
                      borderRadius: 4, marginBottom: 8, display: 'block',
                    }}
                  />
                )}

                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{poi.name}</div>
                {poi.translation && (
                  <div style={{ fontSize: 12, color: '#777', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>Translation: </span>{poi.translation}
                  </div>
                )}

                {(poi.tags ?? []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                    {(poi.tags ?? []).map(tag => (
                      <span key={tag} style={{
                        background: tagColor(tag),
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 10,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {poi.description && (
                  <p style={{ margin: '0 0 10px', fontSize: 12, lineHeight: 1.5, color: '#333' }}>
                    {poi.description}
                  </p>
                )}

                <VoteButton poiId={poi.id} />

                <DayPicker
                  poiId={poi.id}
                  itinerary={itinerary}
                  weather={weather}
                  onAdd={dayIndex => onAddToDay(dayIndex, poi.id)}
                  onRemove={dayIndex => onRemoveFromDay(dayIndex, poi.id)}
                />
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
