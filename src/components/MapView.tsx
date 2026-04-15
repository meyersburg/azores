import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Poi } from '../types'
import { tagColor } from '../types'
import { VoteButton } from './VoteButton'

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
    popupAnchor: [0, -38],
  })
}

function MapInit() {
  const map = useMap()
  map.setView([37.79, -25.47], 11)
  return null
}

interface Props {
  pois: Poi[]
}

export function MapView({ pois }: Props) {
  return (
    <MapContainer
      style={{ height: '100%', width: '100%' }}
      center={[37.79, -25.47]}
      zoom={11}
    >
      <MapInit />
      <TileLayer
        attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_KEY}`}
        tileSize={512}
        zoomOffset={-1}
        maxZoom={20}
      />
      {pois.map(poi => {
        const markerColor = tagColor(poi.tags[0] ?? '')

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
                <div style={{ fontSize: 12, color: '#777', marginBottom: 8 }}>{poi.translation}</div>

                {poi.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                    {poi.tags.map(tag => (
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
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
