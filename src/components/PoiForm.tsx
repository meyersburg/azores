import { useState } from 'react'
import type { Poi } from '../types'
import { TAG_COLORS, tagColor } from '../types'

const PRESET_TAGS = Object.keys(TAG_COLORS)

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).slice(2, 6)
}

function parseCoords(input: string): [number, number] | null {
  const parts = input.split(',').map(s => parseFloat(s.trim()))
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]]
  }
  return null
}

interface Props {
  initial?: Poi
  onSave: (poi: Poi) => void
  onCancel: () => void
}

export function PoiForm({ initial, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [translation, setTranslation] = useState(initial?.translation ?? '')
  const [coords, setCoords] = useState(
    initial ? `${initial.coordinates[0]}, ${initial.coordinates[1]}` : ''
  )
  const [description, setDescription] = useState(initial?.description ?? '')
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? '')
  const [error, setError] = useState('')

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const handleSubmit = () => {
    if (!name.trim()) { setError('Name is required'); return }
    const coordinates = parseCoords(coords)
    if (!coordinates) { setError('Enter coordinates as "lat, lng" (e.g. 37.746, -25.593)'); return }
    setError('')
    onSave({
      id: initial?.id ?? slugify(name),
      name: name.trim(),
      translation: translation.trim(),
      coordinates,
      description: description.trim(),
      tags,
      thumbnail: thumbnail.trim(),
    })
  }

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'system-ui, sans-serif',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 4,
  }

  return (
    <div style={{ padding: '0 16px 16px' }}>
      <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#111' }}>
        {initial ? 'Edit POI' : 'Add New POI'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={labelStyle}>Name *</label>
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Sete Cidades" />
        </div>
        <div>
          <label style={labelStyle}>Translation</label>
          <input style={inputStyle} value={translation} onChange={e => setTranslation(e.target.value)} placeholder="Seven Cities" />
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>Coordinates (lat, lng)</label>
        <input
          style={inputStyle}
          value={coords}
          onChange={e => setCoords(e.target.value)}
          placeholder="37.8608, -25.7878  — right-click in Google Maps"
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>Description</label>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="A short description of the place..."
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>Tags</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PRESET_TAGS.map(tag => {
            const active = tags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  background: active ? tagColor(tag) : '#e5e7eb',
                  color: active ? 'white' : '#555',
                }}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Thumbnail URL</label>
        <input style={inputStyle} value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="https://..." />
        {thumbnail && (
          <img src={thumbnail} alt="preview" style={{ marginTop: 6, width: '100%', height: 80, objectFit: 'cover', borderRadius: 4 }} />
        )}
      </div>

      {error && <div style={{ color: '#dc2626', fontSize: 12, marginBottom: 10 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleSubmit}
          style={{
            flex: 1,
            padding: '9px 0',
            background: '#1a6b4a',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {initial ? 'Save Changes' : 'Add POI'}
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '9px 16px',
            background: 'none',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            fontSize: 13,
            cursor: 'pointer',
            color: '#555',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
