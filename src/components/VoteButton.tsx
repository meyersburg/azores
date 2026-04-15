import { useVotes } from '../hooks/useVotes'

interface Props {
  poiId: string
}

export function VoteButton({ poiId }: Props) {
  const { count, hasVoted, vote } = useVotes(poiId)

  return (
    <button
      onClick={(e) => { e.stopPropagation(); vote() }}
      title={hasVoted ? 'Click to remove vote' : 'Vote for this place'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: 0,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 14,
        opacity: hasVoted ? 0.6 : 1,
        pointerEvents: 'all',
      }}
    >
      👍 <span style={{ fontSize: 13, color: '#333' }}>{count}</span>
    </button>
  )
}
