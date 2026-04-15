import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Poi } from '../types'

// Fix Leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
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
    popupAnchor: [0, -36],
  })
}

// Centers the map on Azores archipelago
function MapInit() {
  const map = useMap()
  map.setView([38.5, -27.5], 7)
  return null
}

interface Props {
  pois: Poi[]
  categoryColors: Record<string, string>
  onSelectPoi: (poi: Poi) => void
}

export function MapView({ pois, categoryColors, onSelectPoi }: Props) {
  return (
    <MapContainer
      style={{ height: '100%', width: '100%' }}
      center={[38.5, -27.5]}
      zoom={7}
      zoomControl={true}
    >
      <MapInit />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {pois.map(poi => (
        <Marker
          key={poi.id}
          position={poi.coordinates}
          icon={makeIcon(categoryColors[poi.category] ?? '#6b7280')}
          eventHandlers={{ click: () => onSelectPoi(poi) }}
        >
          <Popup>
            <div style={{ minWidth: 160 }}>
              <strong>{poi.name}</strong>
              <br />
              <span style={{ fontSize: 12, color: '#555' }}>{poi.island}</span>
              <br />
              <button
                onClick={() => onSelectPoi(poi)}
                style={{
                  marginTop: 6,
                  padding: '4px 10px',
                  background: categoryColors[poi.category] ?? '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                View details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
