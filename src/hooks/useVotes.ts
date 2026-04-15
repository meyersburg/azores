import { useState, useEffect } from 'react'
import { ref, set, remove, onValue } from 'firebase/database'
import { db } from '../firebase'

function getDeviceId(): string {
  let id = localStorage.getItem('azores_device_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('azores_device_id', id)
  }
  return id
}

export function useVotes(poiId: string) {
  const [count, setCount] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)
  const deviceId = getDeviceId()

  useEffect(() => {
    const votesRef = ref(db, `votes/${poiId}`)
    const unsubscribe = onValue(votesRef, (snapshot) => {
      const data = snapshot.val() as Record<string, boolean> | null
      if (data) {
        setCount(Object.keys(data).length)
        setHasVoted(!!data[deviceId])
      } else {
        setCount(0)
        setHasVoted(false)
      }
    })
    return () => unsubscribe()
  }, [poiId, deviceId])

  const vote = () => {
    if (hasVoted) {
      remove(ref(db, `votes/${poiId}/${deviceId}`))
    } else {
      set(ref(db, `votes/${poiId}/${deviceId}`), true)
    }
  }

  return { count, hasVoted, vote }
}
