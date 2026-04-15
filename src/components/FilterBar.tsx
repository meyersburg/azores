import { tagColor } from '../types'

interface Props {
  tags: string[]
  activeTags: string[]
  onToggle: (tag: string) => void
}

export function FilterBar({ tags, activeTags, onToggle }: Props) {
  if (tags.length === 0) return null

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '10px 12px',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(6px)',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      gap: 6,
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      {tags.map(tag => {
        const active = activeTags.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            style={{
              flexShrink: 0,
              padding: '5px 12px',
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              background: active ? tagColor(tag) : '#e5e7eb',
              color: active ? 'white' : '#555',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
