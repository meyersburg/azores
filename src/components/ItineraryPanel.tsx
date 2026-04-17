import { useState } from 'react'
import type { Itinerary } from '../hooks/useItinerary'
import { DAY_NAMES } from '../hooks/useItinerary'
import type { DayWeather } from '../hooks/useWeather'
import type { DayLabels } from '../hooks/useDayLabels'
import type { Poi } from '../types'
import { poiEmoji } from '../utils/poiEmoji'

interface Props {
  itinerary: Itinerary
  weather: DayWeather[]
  pois: Poi[]
  labels: DayLabels
  onRemove: (dayIndex: number, poiId: string) => void
  onGenerateLabels: () => Promise<void>
}

const PANEL_WIDTH = 185

function toF(c: number): number {
  return Math.round(c * 9 / 5 + 32)
}

export function ItineraryPanel({ itinerary, weather, pois, labels, onRemove, onGenerateLabels }: Props) {
  const [open, setOpen] = useState(false)
  const [generating, setGenerating] = useState(false)

  const poiMap = Object.fromEntries(pois.map(p => [p.id, p]))

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await onGenerateLabels()
    } finally {
      setGenerating(false)
    }
  }

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
          padding: '12px 12px 10px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 24,
            color: '#111',
          }}>
            Itinerary
          </span>
          <button
            onClick={handleGenerate}
            disabled={generating}
            title="Generate AI day labels"
            style={{
              background: 'none',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              padding: '3px 7px',
              cursor: generating ? 'default' : 'pointer',
              fontSize: 14,
              opacity: generating ? 0.5 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {generating ? '⏳' : '✨'}
          </button>
        </div>

        {/* Day rows */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {itinerary.map((dayPoiIds, i) => {
            const w = weather[i]
            const label = labels[i]
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
                }}>
                  <span style={{
                    fontWeight: 700,
                    fontSize: 16,
                    minWidth: 32,
                    color: '#1a6b4a',
                  }}>
                    {DAY_NAMES[i]}
                  </span>
                  {w ? (
                    <span style={{ fontSize: 16 }} title={`${w.label} · ${toF(w.tempMax)}°F`}>
                      {w.emoji} <span style={{ fontSize: 13, color: '#6b7280' }}>{toF(w.tempMax)}°</span>
                    </span>
                  ) : (
                    <span style={{ fontSize: 16, color: '#d1d5db' }}>—</span>
                  )}
                </div>

                {/* AI label */}
                {label && (
                  <div style={{
                    fontSize: 12,
                    color: '#6b7280',
                    fontStyle: 'italic',
                    marginTop: 1,
                    marginBottom: 4,
                    paddingLeft: 2,
                  }}>
                    {label}
                  </div>
                )}

                {/* POI chips */}
                {dayPoiIds.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: label ? 0 : 5 }}>
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
                            fontSize: 14,
                          }}
                        >
                          <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0 }}>{poiEmoji(poi)}</span>
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
                              fontSize: 17,
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
                  <div style={{ fontSize: 13, color: '#d1d5db', paddingLeft: 2, marginTop: label ? 0 : 5 }}>
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
