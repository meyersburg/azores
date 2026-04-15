import { useVotes } from '../hooks/useVotes'

interface Props {
  poiId: string
}

export function VoteButton({ poiId }: Props) {
  const { count, hasVoted, vote } = useVotes(poiId)

  return (
    <button
      onClick={vote}
      disabled={hasVoted}
      title={hasVoted ? 'Already voted' : 'Vote for this place'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '5px 12px',
        background: hasVoted ? '#1a6b4a' : '#f0f0f0',
        color: hasVoted ? 'white' : '#444',
        border: 'none',
        borderRadius: 14,
        cursor: hasVoted ? 'default' : 'pointer',
        fontSize: 13,
        fontWeight: 600,
        transition: 'background 0.2s',
      }}
    >
      👍 {count}
    </button>
  )
}
