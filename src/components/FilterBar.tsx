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
      bottom: 16,
      left: 0,
      right: 0,
      zIndex: 2000,
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 6,
      padding: '0 12px',
      pointerEvents: 'none',
    }}>
      {tags.map(tag => {
        const active = activeTags.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            style={{
              pointerEvents: 'all',
              padding: '5px 12px',
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              background: active ? tagColor(tag) : 'rgba(100,100,100,0.55)',
              color: 'white',
              backdropFilter: 'blur(4px)',
              transition: 'background 0.15s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
            }}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
