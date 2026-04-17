import { useState } from 'react'
import type { Itinerary } from '../hooks/useItinerary'
import { DAY_NAMES } from '../hooks/useItinerary'
import type { DayWeather } from '../hooks/useWeather'
import type { Poi } from '../types'
import { poiEmoji } from '../utils/poiEmoji'

interface Props {
  itinerary: Itinerary
  weather: DayWeather[]
  pois: Poi[]
  onRemove: (dayIndex: number, poiId: string) => void
}

const PANEL_WIDTH = 264

export function ItineraryPanel({ itinerary, weather, pois, onRemove }: Props) {
  const [open, setOpen] = useState(false)

  const poiMap = Object.fromEntries(pois.map(p => [p.id, p]))

  return (
    <>
      {/* Slide-in panel */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: PANEL_WIDTH,
          zIndex: 1400,
          background: 'white',
          boxShadow: '2px 0 16px rgba(0,0,0,0.18)',
          transform: open ? 'translateX(0)' : `translateX(-${PANEL_WIDTH}px)`,
          transition: 'transform 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '14px 12px 10px',
          borderBottom: '1px solid #e5e7eb',
          fontFamily: '"Instrument Serif", serif',
          fontSize: 20,
          color: '#111',
          flexShrink: 0,
        }}>
          🗓 Itinerary
        </div>

        {/* Day rows */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {itinerary.map((dayPoiIds, i) => {
            const w = weather[i]
            return (
              <div
                key={i}
                style={{
                  padding: '8px 10px',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                {/* Day name + weather */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: dayPoiIds.length > 0 ? 5 : 0,
                }}>
                  <span style={{
                    fontWeight: 700,
                    fontSize: 13,
                    minWidth: 28,
                    color: '#1a6b4a',
                  }}>
                    {DAY_NAMES[i]}
                  </span>
                  {w ? (
                    <span style={{ fontSize: 13 }} title={`${w.label} · ${w.tempMax}°C`}>
                      {w.emoji} <span style={{ fontSize: 11, color: '#6b7280' }}>{w.tempMax}°</span>
                    </span>
                  ) : (
                    <span style={{ fontSize: 13, color: '#d1d5db' }}>—</span>
                  )}
                </div>

                {/* POI chips */}
                {dayPoiIds.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {dayPoiIds.map(poiId => {
                      const poi = poiMap[poiId]
                      if (!poi) return null
                      return (
                        <div
                          key={poiId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#f3f4f6',
                            borderRadius: 6,
                            padding: '3px 4px 3px 6px',
                            gap: 5,
                            fontSize: 12,
                          }}
                        >
                          <span style={{ fontSize: 14, lineHeight: 1 }}>{poiEmoji(poi)}</span>
                          <span style={{
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#111',
                          }}>
                            {poi.name}
                          </span>
                          <button
                            onClick={() => onRemove(i, poiId)}
                            title="Remove"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#9ca3af',
                              fontSize: 15,
                              padding: '0 3px',
                              lineHeight: 1,
                              flexShrink: 0,
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ fontSize: 11, color: '#d1d5db', paddingLeft: 2 }}>
                    Nothing planned
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Toggle tab */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'absolute',
          left: open ? PANEL_WIDTH : 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1500,
          background: '#1a6b4a',
          color: 'white',
          border: 'none',
          borderRadius: '0 8px 8px 0',
          width: 22,
          height: 56,
          cursor: 'pointer',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'left 0.25s ease',
          padding: 0,
          boxShadow: '2px 0 6px rgba(0,0,0,0.2)',
        }}
      >
        {open ? '‹' : '›'}
      </button>
    </>
  )
}
