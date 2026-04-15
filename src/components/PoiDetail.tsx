import type { Poi } from '../types'

interface Props {
  poi: Poi
  categoryColors: Record<string, string>
  onClose: () => void
}

export function PoiDetail({ poi, categoryColors, onClose }: Props) {
  const color = categoryColors[poi.category] ?? '#6b7280'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 1500,
        }}
      />

      {/* Sheet — slides up from bottom, comfortable on mobile */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: 'white',
        borderRadius: '16px 16px 0 0',
        zIndex: 1600,
        maxHeight: '80dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.2)',
      }}>
        {/* Drag handle */}
        <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 36, height: 4, background: '#ddd', borderRadius: 2, display: 'inline-block' }} />
        </div>

        {/* Thumbnail */}
        {poi.thumbnail && (
          <div style={{ height: 180, overflow: 'hidden', flexShrink: 0 }}>
            <img
              src={poi.thumbnail}
              alt={poi.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '14px 18px 24px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{poi.name}</h2>
              <div style={{ color: '#555', fontSize: 13, marginTop: 2 }}>{poi.island}</div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                background: 'none', border: 'none', fontSize: 22,
                cursor: 'pointer', color: '#888', padding: 0, lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          {/* Category badge */}
          <span style={{
            display: 'inline-block',
            background: color,
            color: 'white',
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 12,
            textTransform: 'capitalize',
            marginBottom: 10,
          }}>
            {poi.category}
          </span>

          <p style={{ margin: '0 0 12px', lineHeight: 1.6, color: '#333', fontSize: 15 }}>
            {poi.description}
          </p>

          {/* Tags */}
          {poi.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {poi.tags.map(tag => (
                <span key={tag} style={{
                  background: '#f0f0f0',
                  color: '#555',
                  fontSize: 12,
                  padding: '3px 8px',
                  borderRadius: 10,
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
