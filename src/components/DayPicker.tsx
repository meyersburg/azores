import { useState } from 'react'
import type { Itinerary } from '../hooks/useItinerary'
import { DAY_NAMES } from '../hooks/useItinerary'
import type { DayWeather } from '../hooks/useWeather'

interface Props {
  poiId: string
  itinerary: Itinerary
  weather: DayWeather[]
  onAdd: (dayIndex: number) => void
  onRemove: (dayIndex: number) => void
}

export function DayPicker({ poiId, itinerary, weather, onAdd, onRemove }: Props) {
  const [open, setOpen] = useState(false)
  const [pendingDay, setPendingDay] = useState<number | null>(null)

  const daysWithThisPoi = itinerary.reduce<number[]>((acc: number[], day: string[], i: number) => {
    if (day.includes(poiId)) acc.push(i)
    return acc
  }, [])

  const handleCellClick = (dayIndex: number) => {
    const alreadyOnDay = itinerary[dayIndex]?.includes(poiId) ?? false
    if (alreadyOnDay) {
      onRemove(dayIndex)
      return
    }
    if (daysWithThisPoi.length > 0) {
      setPendingDay(dayIndex)
      return
    }
    onAdd(dayIndex)
  }

  const confirmAdd = () => {
    if (pendingDay !== null) {
      onAdd(pendingDay)
      setPendingDay(null)
    }
  }

  return (
    <div style={{ marginTop: 10, borderTop: '1px solid #eee', paddingTop: 8 }}>
      {!open ? (
        <button
          onClick={e => { e.stopPropagation(); setOpen(true) }}
          style={{
            background: '#f3f4f6',
            border: 'none',
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: 12,
            cursor: 'pointer',
            width: '100%',
            textAlign: 'center',
            fontWeight: 600,
            color: '#374151',
          }}
        >
          📅 Add to Itinerary
        </button>
      ) : (
        <div onClick={e => e.stopPropagation()}>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 5, fontWeight: 600 }}>
            Tap a day · tap ✓ to remove:
          </div>

          {/* 8 day cells */}
          <div style={{ display: 'flex', gap: 2 }}>
            {DAY_NAMES.map((name: string, i: number) => {
              const hasThis = itinerary[i]?.includes(poiId) ?? false
              const w = weather[i]
              const isPending = pendingDay === i
              return (
                <div
                  key={i}
                  onClick={() => handleCellClick(i)}
                  style={{
                    flex: 1,
                    background: hasThis ? '#1a6b4a' : '#f3f4f6',
                    color: hasThis ? 'white' : '#111',
                    borderRadius: 5,
                    padding: '4px 0',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontSize: 10,
                    fontWeight: 700,
                    border: isPending ? '2px solid #f59e0b' : '2px solid transparent',
                    lineHeight: 1.3,
                    userSelect: 'none',
                  }}
                >
                  <div>{name}</div>
                  {w && <div style={{ fontSize: 12 }}>{w.emoji}</div>}
                  {hasThis && <div style={{ fontSize: 11 }}>✓</div>}
                </div>
              )
            })}
          </div>

          {/* Duplicate warning */}
          {pendingDay !== null && (
            <div style={{
              marginTop: 6,
              background: '#fef3c7',
              borderRadius: 6,
              padding: '6px 8px',
              fontSize: 11,
              color: '#92400e',
            }}>
              ⚠️ Already on {daysWithThisPoi.map((d: number) => DAY_NAMES[d]).join(', ')}. Add to{' '}
              <strong>{DAY_NAMES[pendingDay]}</strong> anyway?
              <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
                <button
                  onClick={confirmAdd}
                  style={{
                    flex: 1, background: '#f59e0b', color: 'white',
                    border: 'none', borderRadius: 4, padding: '4px 0',
                    cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  }}
                >
                  Add anyway
                </button>
                <button
                  onClick={() => setPendingDay(null)}
                  style={{
                    flex: 1, background: '#e5e7eb', color: '#374151',
                    border: 'none', borderRadius: 4, padding: '4px 0',
                    cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
