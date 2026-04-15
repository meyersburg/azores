import { useState } from 'react'
import type { Poi } from '../types'
import { PoiForm } from './PoiForm'

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN ?? '1234'

interface Props {
  pois: Poi[]
  onSave: (poi: Poi) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export function AdminPanel({ pois, onSave, onDelete, onClose }: Props) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('admin_authed') === 'true'
  )
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [editing, setEditing] = useState<Poi | null | 'new'>(null)

  const submitPin = () => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('admin_authed', 'true')
      setAuthed(true)
    } else {
      setPinError(true)
      setPin('')
    }
  }

  const handleSave = (poi: Poi) => {
    onSave(poi)
    setEditing(null)
  }

  const handleDelete = (poi: Poi) => {
    if (confirm(`Delete "${poi.name}"?`)) onDelete(poi.id)
  }

  // Overlay backdrop
  const backdrop = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 3000,
      }}
    />
  )

  // Panel wrapper
  const panel = (
    <div style={{
      position: 'fixed',
      top: 0, right: 0, bottom: 0,
      width: '100%',
      maxWidth: 400,
      background: 'white',
      zIndex: 3001,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        background: '#1a6b4a',
        color: 'white',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Manage POIs</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
      </div>

      {/* PIN gate */}
      {!authed ? (
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#555' }}>Enter admin PIN to continue.</p>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={e => { setPin(e.target.value); setPinError(false) }}
            onKeyDown={e => e.key === 'Enter' && submitPin()}
            placeholder="PIN"
            autoFocus
            style={{
              padding: '10px 12px',
              border: `1px solid ${pinError ? '#dc2626' : '#d1d5db'}`,
              borderRadius: 6,
              fontSize: 18,
              letterSpacing: 6,
              textAlign: 'center',
              outline: 'none',
            }}
          />
          {pinError && <p style={{ margin: 0, color: '#dc2626', fontSize: 12 }}>Incorrect PIN</p>}
          <button
            onClick={submitPin}
            style={{
              padding: '10px 0',
              background: '#1a6b4a',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Unlock
          </button>
        </div>
      ) : editing ? (
        /* Add / Edit form */
        <div style={{ paddingTop: 16 }}>
          <PoiForm
            initial={editing === 'new' ? undefined : editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      ) : (
        /* POI list */
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => setEditing('new')}
            style={{
              padding: '10px 0',
              background: '#1a6b4a',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              marginBottom: 4,
            }}
          >
            + Add New POI
          </button>

          {pois.length === 0 && (
            <p style={{ color: '#888', fontSize: 13, textAlign: 'center', margin: '20px 0' }}>No POIs yet.</p>
          )}

          {[...pois].sort((a, b) => a.name.localeCompare(b.name)).map(poi => (
            <div
              key={poi.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: '10px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {poi.name}
                </div>
                {poi.translation && (
                  <div style={{ fontSize: 11, color: '#888' }}>{poi.translation}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => setEditing(poi)}
                  style={{
                    padding: '4px 10px',
                    border: '1px solid #d1d5db',
                    borderRadius: 5,
                    background: 'none',
                    fontSize: 12,
                    cursor: 'pointer',
                    color: '#444',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(poi)}
                  style={{
                    padding: '4px 10px',
                    border: '1px solid #fca5a5',
                    borderRadius: 5,
                    background: 'none',
                    fontSize: 12,
                    cursor: 'pointer',
                    color: '#dc2626',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <>
      {backdrop}
      {panel}
    </>
  )
}
